-- ============================================================
--  TAXAUD · Publicaciones — pegar completo en Supabase → SQL Editor → Run
--  Antes de ejecutar: cambie el correo del editor al final del archivo.
-- ============================================================

-- 1. Tabla de publicaciones
create table if not exists public.publicaciones (
  id              text primary key,
  tipo            text not null check (tipo in ('noticia','documento','video')),
  fecha           date not null default current_date,
  titulo          text not null,
  resumen         text,
  temas           text[] not null default '{}',
  cuerpo          text,                       -- párrafos separados por una línea en blanco
  destacado       boolean not null default false,
  publicado       boolean not null default true,
  archivo_url     text,
  archivo_path    text,
  archivo_peso    text,
  archivo_paginas int,
  video_youtube   text,
  video_mp4       text,
  video_duracion  text,
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);
create index if not exists publicaciones_fecha_idx on public.publicaciones (fecha desc);

create or replace function public.tocar_actualizado() returns trigger
language plpgsql as $$ begin new.actualizado_en = now(); return new; end $$;
drop trigger if exists publicaciones_actualizado on public.publicaciones;
create trigger publicaciones_actualizado before update on public.publicaciones
  for each row execute function public.tocar_actualizado();

-- 2. Lista de editores autorizados (solo estos correos pueden publicar)
create table if not exists public.editores (
  email text primary key
);

create or replace function public.es_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.editores
                 where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- 3. Reglas de acceso (RLS)
alter table public.publicaciones enable row level security;
alter table public.editores      enable row level security;

drop policy if exists "pub_lectura"   on public.publicaciones;
drop policy if exists "pub_insertar"  on public.publicaciones;
drop policy if exists "pub_editar"    on public.publicaciones;
drop policy if exists "pub_eliminar"  on public.publicaciones;
create policy "pub_lectura"  on public.publicaciones for select using (publicado or public.es_editor());
create policy "pub_insertar" on public.publicaciones for insert to authenticated with check (public.es_editor());
create policy "pub_editar"   on public.publicaciones for update to authenticated using (public.es_editor()) with check (public.es_editor());
create policy "pub_eliminar" on public.publicaciones for delete to authenticated using (public.es_editor());

drop policy if exists "editor_propio" on public.editores;
create policy "editor_propio" on public.editores for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- 4. Almacenamiento de archivos (PDF / MP4, máx. 50 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos', 'documentos', true, 52428800, array['application/pdf','video/mp4'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "docs_subir"    on storage.objects;
drop policy if exists "docs_editar"   on storage.objects;
drop policy if exists "docs_eliminar" on storage.objects;
create policy "docs_subir"    on storage.objects for insert to authenticated with check (bucket_id = 'documentos' and public.es_editor());
create policy "docs_editar"   on storage.objects for update to authenticated using (bucket_id = 'documentos' and public.es_editor());
create policy "docs_eliminar" on storage.objects for delete to authenticated using (bucket_id = 'documentos' and public.es_editor());

-- 5. Editores: cambie o agregue los correos de TAXAUD autorizados
insert into public.editores (email) values
  ('admin@taxaud.com.ec')
on conflict do nothing;

-- 6. Contador de visitas (sección "En cifras" de Inicio)
--    'base' = visitas previas que quiera sumar al arrancar (p. ej. 12500).
create table if not exists public.contador_visitas (
  id    int primary key default 1 check (id = 1),
  total bigint not null default 0
);
insert into public.contador_visitas (id, total) values (1, 12500) on conflict do nothing;
alter table public.contador_visitas enable row level security;

-- Suma 1 y devuelve el total (la web la llama una vez por sesión)
create or replace function public.registrar_visita() returns bigint
language sql security definer set search_path = public as $$
  update public.contador_visitas set total = total + 1 where id = 1 returning total;
$$;
-- Solo lee el total (para refrescar la cifra sin sumar)
create or replace function public.total_visitas() returns bigint
language sql stable security definer set search_path = public as $$
  select total from public.contador_visitas where id = 1;
$$;
grant execute on function public.registrar_visita() to anon, authenticated;
grant execute on function public.total_visitas()    to anon, authenticated;
