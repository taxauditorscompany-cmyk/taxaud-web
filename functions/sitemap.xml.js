/*
  Sitemap automático — TAXAUD
  GET /sitemap.xml arma la lista de páginas para Google a partir de publicaciones.js.
  Cada publicación nueva aparece sola, con su fecha. No hay que editar este archivo.
*/
import { obtenerPublicaciones } from '../lib/publicaciones.js';

const SITIO = 'https://taxauditorscompany.com';
const FIJAS = [
  { loc: '/', prioridad: '1.0', fecha: '2026-10-25' },
  { loc: '/privacidad', prioridad: '0.3', fecha: '2026-09-30' }
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fechaValida = f => /^\d{4}-\d{2}-\d{2}$/.test(f || '') ? f : null;

export async function onRequestGet(context) {
  let pubs = [];
  try { pubs = await obtenerPublicaciones(context); } catch (e) { pubs = []; }

  const fechas = pubs.map(p => fechaValida(p.fecha)).filter(Boolean).sort();
  const ultima = fechas[fechas.length - 1] || '2026-09-30';

  const urls = [
    FIJAS[0],
    { loc: '/blog', prioridad: '0.8', fecha: ultima },
    FIJAS[1],
    ...pubs.map(p => ({ loc: '/blog/' + encodeURIComponent(p.id), prioridad: '0.7', fecha: fechaValida(p.fecha) }))
  ];

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => '  <url><loc>' + esc(SITIO + u.loc) + '</loc>'
      + (u.fecha ? '<lastmod>' + u.fecha + '</lastmod>' : '')
      + '<priority>' + u.prioridad + '</priority></url>').join('\n')
    + '\n</urlset>\n';

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' }
  });
}
