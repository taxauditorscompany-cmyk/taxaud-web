/*
  Formulario de contacto — TAX AUDITORS COMPANY TAXAUD S.A.S.
  POST  /api/solicitudes          (público)  guarda una solicitud y envía aviso por correo
  GET   /api/solicitudes          (privado)  lista las solicitudes      — requiere cabecera x-clave
  PATCH /api/solicitudes          (privado)  cambia estado / nota       — requiere cabecera x-clave

  Configuración en Cloudflare Pages → taxaud-web → Settings:
    Bindings  → D1 database   nombre de variable: DB
    Variables → ADMIN_CLAVE   (secreta) contraseña para ver el listado en solicitudes.html
                RESEND_API_KEY (secreta) clave de Resend para el aviso por correo (opcional)
                MAIL_TO        (opcional) correo que recibe los avisos; por defecto taxauditorscompany@gmail.com
                MAIL_FROM      (opcional) remitente; por defecto "Web TAXAUD <onboarding@resend.dev>"
*/
const ESQUEMA = `CREATE TABLE IF NOT EXISTS solicitudes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creado TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  nombre TEXT NOT NULL, empresa TEXT, telefono TEXT, correo TEXT,
  servicio TEXT, plazo TEXT, mensaje TEXT, pais TEXT,
  estado TEXT NOT NULL DEFAULT 'Nueva', nota TEXT
)`;
const ESTADOS = ['Nueva', 'Contactado', 'Cerrada', 'Descartada'];

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }
});
const txt = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function tabla(env) { await env.DB.prepare(ESQUEMA).run(); }

function autorizado(request, env) {
  const clave = request.headers.get('x-clave') || '';
  const real = env.ADMIN_CLAVE || '';
  if (!real || clave.length !== real.length) return false;
  let d = 0; for (let i = 0; i < real.length; i++) d |= clave.charCodeAt(i) ^ real.charCodeAt(i);
  return d === 0;
}

async function avisoCorreo(env, s) {
  if (!env.RESEND_API_KEY) return;
  const filas = [['Nombre', s.nombre], ['Empresa', s.empresa], ['WhatsApp / teléfono', s.telefono], ['Correo', s.correo],
    ['Servicio', s.servicio], ['Para cuándo', s.plazo], ['Mensaje', s.mensaje]]
    .filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('');
  const body = {
    from: env.MAIL_FROM || 'Web TAXAUD <onboarding@resend.dev>',
    to: [env.MAIL_TO || 'taxauditorscompany@gmail.com'],
    subject: `Nueva solicitud web: ${s.nombre}${s.servicio ? ' — ' + s.servicio : ''}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111"><p><b>Nueva solicitud desde el formulario de contacto de la web.</b></p><table>${filas}</table><p style="color:#777;font-size:12px">Ver todas: ${esc(env.SITE_URL || 'https://taxaud-web.pages.dev')}/solicitudes.html</p></div>`
  };
  if (s.correo) body.reply_to = s.correo;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
  } catch (e) { /* el aviso es opcional: la solicitud ya quedó guardada */ }
}

export async function onRequestPost({ request, env, waitUntil }) {
  if (!env.DB) return json({ ok: false, error: 'sin_base' }, 503);
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'formato' }, 400); }
  if (d.website) return json({ ok: true }); // trampa para robots: se ignora en silencio
  const s = {
    nombre: txt(d.nombre, 120), empresa: txt(d.empresa, 160), telefono: txt(d.telefono, 40), correo: txt(d.correo, 160),
    servicio: txt(d.servicio, 120), plazo: txt(d.plazo, 60), mensaje: txt(d.mensaje, 3000),
    pais: txt(request.cf && request.cf.country, 4)
  };
  if (!s.nombre) return json({ ok: false, error: 'nombre' }, 400);
  if (!s.telefono && !/^\S+@\S+\.\S+$/.test(s.correo)) return json({ ok: false, error: 'contacto' }, 400);
  if (d.consentimiento !== true) return json({ ok: false, error: 'consentimiento' }, 400);
  await tabla(env);
  await env.DB.prepare('INSERT INTO solicitudes (nombre, empresa, telefono, correo, servicio, plazo, mensaje, pais) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)')
    .bind(s.nombre, s.empresa, s.telefono, s.correo, s.servicio, s.plazo, s.mensaje, s.pais).run();
  waitUntil(avisoCorreo(env, s));
  return json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  if (!env.DB || !env.ADMIN_CLAVE) return json({ ok: false, error: 'sin_configurar' }, 503);
  if (!autorizado(request, env)) return json({ ok: false, error: 'clave' }, 401);
  await tabla(env);
  const { results } = await env.DB.prepare('SELECT * FROM solicitudes ORDER BY id DESC LIMIT 2000').all();
  return json({ ok: true, solicitudes: results, estados: ESTADOS });
}

export async function onRequestPatch({ request, env }) {
  if (!env.DB || !env.ADMIN_CLAVE) return json({ ok: false, error: 'sin_configurar' }, 503);
  if (!autorizado(request, env)) return json({ ok: false, error: 'clave' }, 401);
  let d; try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'formato' }, 400); }
  const id = Number(d.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: 'id' }, 400);
  if (d.estado !== undefined && !ESTADOS.includes(d.estado)) return json({ ok: false, error: 'estado' }, 400);
  await env.DB.prepare('UPDATE solicitudes SET estado = COALESCE(?1, estado), nota = COALESCE(?2, nota) WHERE id = ?3')
    .bind(d.estado ?? null, d.nota !== undefined ? txt(d.nota, 2000) : null, id).run();
  return json({ ok: true });
}
