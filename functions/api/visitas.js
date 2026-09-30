/*
  Contador de visitas — TAXAUD (usa la misma base D1 "DB" del formulario de contacto).
  POST /api/visitas  suma 1 (el sitio lo llama una vez por sesión del navegador) y devuelve el total.
  GET  /api/visitas  devuelve el total sin sumar.
  El total guardado es el conteo real desde el lanzamiento; la cifra que se muestra en la web
  le suma una base fija (VIS_BASE en index.html).
*/
const ESQUEMA = `CREATE TABLE IF NOT EXISTS contador_visitas (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0,
  desde TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
)`;
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }
});
const esBot = ua => /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i.test(ua || '');

async function total(env) {
  await env.DB.prepare(ESQUEMA).run();
  const r = await env.DB.prepare('SELECT total FROM contador_visitas WHERE id = 1').first();
  return r ? r.total : 0;
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false }, 503);
  return json({ ok: true, total: await total(env) });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false }, 503);
  await env.DB.prepare(ESQUEMA).run();
  if (esBot(request.headers.get('user-agent'))) return json({ ok: true, total: await total(env) });
  const r = await env.DB.prepare(
    'INSERT INTO contador_visitas (id, total) VALUES (1, 1) ON CONFLICT(id) DO UPDATE SET total = total + 1 RETURNING total'
  ).first();
  return json({ ok: true, total: r ? r.total : 0 });
}
