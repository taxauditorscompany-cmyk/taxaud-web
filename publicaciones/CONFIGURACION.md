# Publicaciones con Supabase — puesta en marcha

## 1. Supabase (una sola vez)
1. **SQL Editor → New query**: pegue `publicaciones/supabase.sql`, cambie el correo del editor (sección 5) y pulse **Run**.
   Crea la tabla, el almacenamiento `documentos` y las reglas de acceso.
2. **Authentication → Users → Add user → Create new user**: el mismo correo de la sección 5, con contraseña. Marque *Auto confirm user*.
3. **Authentication → Sign In / Providers → Email**: desactive **Allow new users to sign up** (nadie más podrá registrarse).
4. **Authentication → URL Configuration**: en *Site URL* ponga su dominio (ej. `https://taxaud.com.ec`) y en *Redirect URLs* agregue `https://taxaud.com.ec/**` (necesario para "¿Olvidó su contraseña?").
5. **Project Settings → API**: copie *Project URL* y la clave pública (*anon* o *publishable*) en `publicaciones/supabase-config.js`.

## 2. Cloudflare Pages
1. **Workers & Pages → Create → Pages → Connect to Git** → elija el repositorio de GitHub.
2. Framework preset: **None**. Build command: vacío. Output directory: `/`.
3. **Custom domains**: agregue su dominio (HTTPS se activa solo).
Cada `git push` al repositorio publica la web automáticamente.

## 3. Publicar
Abra `Admin.dc.html` en su dominio, inicie sesión y use **Nueva publicación**.
Los cambios aparecen de inmediato en `Publicaciones.dc.html`, sin tocar GitHub.

- PDF: hasta 50 MB (plan gratuito, 1 GB en total).
- Videos: pegue el enlace de YouTube.
- "Borrador" oculta la publicación al público.

## Notas
- Nunca use la clave `service_role` / `secret` en la web.
- El plan gratuito pausa el proyecto tras 7 días sin actividad; reactívelo desde el panel o pase a Pro cuando el sistema contable esté en producción.
- Para más editores: agregue su correo en la tabla `editores` y cree su usuario en Authentication.
