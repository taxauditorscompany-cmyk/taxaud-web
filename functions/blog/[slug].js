/*
  Página propia de cada publicación — TAXAUD
  GET /blog/<id> muestra el artículo completo (texto, PDF, video) para lectores y para Google.
  Toma los datos de publicaciones/publicaciones.js: para publicar no hay que tocar este archivo.
*/
import { obtenerPublicaciones } from '../../lib/publicaciones.js';

const SITIO = 'https://taxauditorscompany.com';
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const TIPOS = {
  noticia: { label: 'Noticia', icon: 'ph-newspaper' },
  documento: { label: 'Documento PDF', icon: 'ph-file-pdf' },
  video: { label: 'Video', icon: 'ph-play-circle' }
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = u => !u ? '' : /^https?:\/\//.test(u) ? u : '/' + String(u).replace(/^\.?\//, '');
const fechaLarga = f => { const [y, m, d] = String(f || '').split('-').map(Number); return y ? d + ' de ' + MESES[(m || 1) - 1] + ' de ' + y : ''; };
const recorta = (s, n) => { s = String(s || ''); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; };

// Da formato al cuerpo: subtítulos, listas con "•", etiquetas que terminan en ":" y la firma final.
function cuerpoHTML(parrafos) {
  const out = []; let lista = null;
  const cerrar = () => { if (lista) { out.push('<ul>' + lista.join('') + '</ul>'); lista = null; } };
  parrafos.forEach((raw, k) => {
    const t = String(raw || '').trim(); if (!t) return;
    if (/^[•\-–]\s*/.test(t)) { (lista = lista || []).push('<li>' + esc(t.replace(/^[•\-–]\s*/, '')) + '</li>'); return; }
    cerrar();
    if (/^TAX AUDITORS COMPANY/i.test(t) && k === parrafos.length - 1) { out.push('<p class="firma">' + esc(t) + '</p>'); return; }
    if (/^Qué hacer:/i.test(t)) { out.push('<p class="accion"><strong>Qué hacer:</strong> ' + esc(t.replace(/^Qué hacer:\s*/i, '')) + '</p>'); return; }
    if (t.length <= 120 && /:$/.test(t)) { out.push('<p class="etiqueta">' + esc(t) + '</p>'); return; }
    if (k > 0 && t.length <= 80 && !/[.;,]$/.test(t)) { out.push('<h2>' + esc(t) + '</h2>'); return; }
    out.push('<p>' + esc(t) + '</p>');
  });
  cerrar();
  return out.join('\n');
}

function pagina(p, otras) {
  const tipo = TIPOS[p.tipo] || TIPOS.noticia;
  const url = SITIO + '/blog/' + encodeURIComponent(p.id);
  const archivo = p.archivo && p.archivo.url ? p.archivo : null;
  const fileUrl = archivo ? abs(archivo.url) : '';
  const v = p.video || {};
  const yt = v.youtube ? 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtube) + '?rel=0' : '';
  const mp4 = !v.youtube && v.mp4 ? abs(v.mp4) : '';
  const cuerpo = Array.isArray(p.cuerpo) ? p.cuerpo : String(p.cuerpo || '').split(/\n\s*\n/);
  const palabras = (cuerpo.join(' ') + ' ' + (p.resumen || '')).split(/\s+/).length;
  const extra = p.tipo === 'documento' && archivo
    ? ['PDF', archivo.peso, archivo.paginas ? archivo.paginas + (archivo.paginas === 1 ? ' pág.' : ' págs.') : ''].filter(Boolean).join(' · ')
    : p.tipo === 'video' ? (v.duracion || '') : 'Lectura ' + Math.max(1, Math.round(palabras / 200)) + ' min';
  const descripcion = recorta(p.resumen || cuerpo[0] || p.titulo, 160);
  const temas = (p.temas || []).filter(Boolean);

  const ld = [
    {
      '@context': 'https://schema.org', '@type': p.tipo === 'video' ? 'VideoObject' : 'Article',
      headline: recorta(p.titulo, 110), name: p.titulo, description: descripcion,
      datePublished: p.fecha, dateModified: p.fecha, inLanguage: 'es-EC',
      mainEntityOfPage: url, url, image: SITIO + '/assets/compartir.png',
      ...(p.tipo === 'video' ? { uploadDate: p.fecha, thumbnailUrl: SITIO + '/assets/compartir.png', ...(v.youtube ? { embedUrl: yt } : {}) } : {}),
      keywords: temas.join(', '),
      author: { '@type': 'Organization', name: 'TAX AUDITORS', url: SITIO + '/' },
      publisher: { '@type': 'Organization', name: 'TAX AUDITORS COMPANY TAXAUD S.A.S.', logo: { '@type': 'ImageObject', url: SITIO + '/assets/favicon-512.png' } }
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITIO + '/blog' },
        { '@type': 'ListItem', position: 3, name: p.titulo, item: url }
      ]
    }
  ];

  const nav = [['Inicio', '/#inicio'], ['Servicios', '/#servicios'], ['Nosotros', '/#nosotros'], ['Cómo trabajamos', '/#metodo'], ['Calculadora', '/#calculadora'], ['Blog', '/blog'], ['Contacto', '/#contacto']];
  const navHTML = nav.map(([t, h]) => '<a href="' + h + '"' + (t === 'Blog' ? ' aria-current="page"' : '') + '>' + t + '</a>').join('');

  const relacionadas = otras.length ? `
<section class="mas" aria-labelledby="mas-t">
  <h2 id="mas-t">Más publicaciones</h2>
  <div class="mas-lista">
    ${otras.map(o => `<a class="tarjeta" href="/blog/${encodeURIComponent(o.id)}"><span class="meta">${esc((TIPOS[o.tipo] || TIPOS.noticia).label)} · ${esc(fechaLarga(o.fecha))}</span><span class="t">${esc(o.titulo)}</span><span class="r">${esc(recorta(o.resumen, 140))}</span></a>`).join('\n    ')}
  </div>
</section>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${esc(p.titulo)} — TAX AUDITORS</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/assets/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png"><link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:locale" content="es_EC">
<meta property="og:site_name" content="TAX AUDITORS">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:image" content="${SITIO}/assets/compartir.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${esc(p.fecha)}">
${temas.map(t => '<meta property="article:tag" content="' + esc(t) + '">').join('\n')}
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&amp;family=Geist:wght@300;400;500;600&amp;family=Geist+Mono:wght@400;500&amp;display=swap">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:#0A1428;color:#EEF2F8;font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:#8FC6F2;text-decoration:none}
a:hover{color:#FFFFFF}
::selection{background:#58A8EA;color:#07101F}
:focus-visible{outline:2px solid #58A8EA;outline-offset:3px;border-radius:6px}
.wrap{max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
header{position:sticky;top:0;z-index:40;background:rgba(10,20,40,.72);backdrop-filter:blur(24px) saturate(1.2);-webkit-backdrop-filter:blur(24px) saturate(1.2);border-bottom:1px solid rgba(255,255,255,.08)}
.barra{height:68px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.barra img{height:34px;width:auto;display:block}
nav.principal{display:flex;gap:28px;font-size:14px}
nav.principal a{padding:6px 2px;color:#B7C3D8;white-space:nowrap;background-image:linear-gradient(#58A8EA,#58A8EA);background-repeat:no-repeat;background-position:0 100%;background-size:0% 1px;transition:color .2s ease,background-size .35s cubic-bezier(0.23,1,0.32,1)}
nav.principal a:hover,nav.principal a[aria-current]{color:#FFFFFF;background-size:100% 1px}
.acciones{display:flex;align-items:center;gap:10px;flex-shrink:0}
.btn{display:inline-flex;align-items:center;gap:10px;white-space:nowrap;padding:9px 14px;border-radius:8px;background:#FFFFFF;color:#0A1428;font-size:14px;font-weight:500;transition:background-color .15s ease}
.btn:hover{background:#58A8EA;color:#07101F}
.btn-sec{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;border:1px solid rgba(157,190,230,.28);color:#EEF2F8;font-size:14px;font-weight:500;transition:border-color .15s ease}
.btn-sec:hover{border-color:#58A8EA;color:#FFFFFF}
details.menu{display:none}
details.menu summary{list-style:none;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:1px solid rgba(157,190,230,.28);color:#EEF2F8;cursor:pointer;font-size:22px}
details.menu summary::-webkit-details-marker{display:none}
details.menu nav{position:absolute;left:0;right:0;top:68px;background:#0A1428;border-bottom:1px solid rgba(255,255,255,.08);padding:4px clamp(16px,4vw,48px) 20px;display:grid}
details.menu nav a{display:flex;justify-content:space-between;padding:14px 2px;font-size:17px;color:#B7C3D8;border-bottom:1px solid rgba(157,190,230,.12)}
details.menu nav a::after{content:'→';font-size:14px;color:#58A8EA}
@media (max-width:999px){nav.principal{display:none}details.menu{display:block}}
main{position:relative;overflow:hidden}
main::before{content:'';position:absolute;left:-260px;top:-300px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(88,168,234,.16),rgba(88,168,234,.05) 45%,rgba(88,168,234,0));pointer-events:none}
.articulo{position:relative;max-width:880px;margin:0 auto;padding:clamp(28px,5vw,64px) clamp(16px,4vw,48px) clamp(56px,8vw,96px)}
.migas{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9AA8C2;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.migas a{color:#58A8EA}
.meta-sup{margin-top:28px;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.meta-sup .tipo{display:inline-flex;align-items:center;gap:6px;color:#8FC6F2}
.meta-sup .tipo i{font-size:15px}
h1{margin:16px 0 0;font-family:'Newsreader',Georgia,serif;font-weight:300;font-size:clamp(32px,4.4vw,56px);line-height:1.06;letter-spacing:-.02em;color:#FFFFFF;text-wrap:balance}
.resumen{margin:20px 0 0;color:#B7C3D8;font-size:clamp(17px,1.5vw,19px);font-weight:300;line-height:1.6;text-wrap:pretty}
.pdf{margin-top:32px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 20px;padding:18px 20px;border-radius:14px;background:#07101F;border:1px solid rgba(157,190,230,.14)}
.pdf .ico{width:48px;height:56px;border-radius:6px;background:#E8EDF4;color:#0A1428;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:26px}
.pdf .nom{font-size:15px;font-weight:500;color:#FFFFFF;overflow-wrap:anywhere}
.pdf .det{margin-top:4px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.1em;color:#9AA8C2}
.pdf .bts{display:flex;flex-wrap:wrap;gap:8px}
.video{margin-top:32px;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#07101F;border:1px solid rgba(157,190,230,.14)}
.video iframe,.video video{width:100%;height:100%;border:0;display:block}
.cuerpo{margin-top:36px;display:grid;gap:16px}
.cuerpo p,.cuerpo li{margin:0;color:#D6DEEA;font-size:17px;line-height:1.7;max-width:66ch;text-wrap:pretty}
.cuerpo h2{margin:18px 0 0;font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:clamp(22px,2.2vw,28px);line-height:1.2;color:#FFFFFF}
.cuerpo ul{margin:0;padding:0 0 0 22px;display:grid;gap:10px}
.cuerpo li::marker{color:#58A8EA}
.cuerpo .etiqueta{color:#FFFFFF;font-weight:500}
.cuerpo .accion{padding:16px 18px;border-left:3px solid #58A8EA;background:rgba(88,168,234,.08);border-radius:0 10px 10px 0}
.cuerpo .accion strong{color:#FFFFFF}
.cuerpo .firma{margin-top:8px;padding-top:16px;border-top:1px solid rgba(157,190,230,.14);font-size:14px;color:#9AA8C2}
.pie-art{margin-top:32px;padding-top:20px;border-top:1px solid rgba(157,190,230,.14);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
.temas{display:flex;flex-wrap:wrap;gap:6px}
.temas span{font-size:12px;color:#B7C3D8;border:1px solid rgba(157,190,230,.2);border-radius:999px;padding:3px 9px}
.copiar{display:inline-flex;align-items:center;gap:8px;background:none;border:none;color:#8FC6F2;font:inherit;font-size:14px;cursor:pointer;padding:6px 0}
.copiar:hover{color:#FFFFFF}
.cta{margin-top:48px;padding:clamp(22px,3.5vw,36px);border-radius:18px;background:#07101F;border:1px solid rgba(157,190,230,.14);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px 28px}
.cta p{margin:0;font-family:'Newsreader',Georgia,serif;font-weight:300;font-size:clamp(22px,2.4vw,28px);line-height:1.2;color:#FFFFFF;max-width:28ch}
.cta .btn{padding:12px 18px;font-size:15px}
.mas{margin-top:56px}
.mas h2{margin:0;padding-bottom:12px;border-bottom:2px solid #EEF2F8;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#EEF2F8}
.mas-lista{display:grid}
.tarjeta{display:grid;gap:6px;padding:20px 12px;margin:0 -12px;border-bottom:1px solid rgba(157,190,230,.14);border-radius:4px;transition:background-color .2s ease}
.tarjeta:hover{background:rgba(88,168,234,.05)}
.tarjeta .meta{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8FC6F2}
.tarjeta .t{font-size:clamp(17px,1.4vw,20px);color:#FFFFFF;line-height:1.35}
.tarjeta .r{font-size:15px;color:#9AA8C2;line-height:1.55}
.volver{margin-top:40px;display:inline-flex;align-items:center;gap:8px;font-size:15px}
footer{background:#0A1428;color:#9AA8C2;font-size:13px;border-top:1px solid rgba(255,255,255,.06)}
footer .wrap{padding-top:32px;padding-bottom:32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px}
footer img{height:26px;width:auto;display:block}
footer .der{display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px}
footer .der>a{color:#B7C3D8;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(157,190,230,.35)}
.redes{display:flex;gap:8px}
.redes a{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid rgba(157,190,230,.22);color:#B7C3D8;font-size:20px;transition:border-color .15s ease,color .15s ease}
.redes a:hover{border-color:#58A8EA;color:#FFFFFF}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<header>
<div class="wrap barra">
<a href="/#inicio" aria-label="TAX AUDITORS, inicio"><img src="/assets/logo.png" alt="TAX AUDITORS"></a>
<nav class="principal" aria-label="Secciones">${navHTML}</nav>
<div class="acciones">
<a class="btn" href="/#contacto">Solicitar consulta</a>
<details class="menu"><summary aria-label="Abrir menú"><i class="ph-light ph-list" aria-hidden="true"></i></summary><nav aria-label="Secciones">${navHTML}</nav></details>
</div>
</div>
</header>

<main>
<article class="articulo">
<div class="migas"><a href="/blog">Blog</a><span aria-hidden="true">/</span><span>${esc(tipo.label)}</span></div>
<div class="meta-sup">
<span class="tipo"><i class="ph-light ${tipo.icon}" aria-hidden="true"></i>${esc(tipo.label)}</span>
<time datetime="${esc(p.fecha)}" style="color:#9AA8C2">${esc(fechaLarga(p.fecha))}</time>
${extra ? '<span style="color:#6B7A96">' + esc(extra) + '</span>' : ''}
</div>
<h1>${esc(p.titulo)}</h1>
${p.resumen ? '<p class="resumen">' + esc(p.resumen) + '</p>' : ''}
${p.tipo === 'video' && (yt || mp4) ? '<div class="video">' + (yt ? '<iframe src="' + esc(yt) + '" title="' + esc(p.titulo) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' : '<video src="' + esc(mp4) + '" controls playsinline></video>') + '</div>' : ''}
${archivo ? `<div class="pdf">
<span class="ico"><i class="ph-light ph-file-pdf" aria-hidden="true"></i></span>
<div style="flex:1 1 200px;min-width:0"><div class="nom">${esc(fileUrl.split('/').pop())}</div><div class="det">${esc(['PDF', archivo.peso, archivo.paginas ? archivo.paginas + ' páginas' : ''].filter(Boolean).join(' · '))}</div></div>
<div class="bts"><a class="btn-sec" href="${esc(fileUrl)}" target="_blank" rel="noopener"><i class="ph-light ph-eye" aria-hidden="true"></i>Ver en línea</a><a class="btn" href="${esc(fileUrl)}" download><i class="ph-light ph-download-simple" aria-hidden="true"></i>Descargar PDF</a></div>
</div>` : ''}
<div class="cuerpo">
${cuerpoHTML(cuerpo)}
</div>
<div class="pie-art">
<div class="temas">${temas.map(t => '<span>' + esc(t) + '</span>').join('')}</div>
<button type="button" class="copiar" data-url="${url}"><i class="ph-light ph-link-simple" aria-hidden="true"></i><span>Copiar enlace</span></button>
</div>
<div class="cta">
<p>¿Tiene dudas sobre cómo le afecta? Le asesoramos.</p>
<a class="btn" href="/#contacto">Solicitar consulta <span aria-hidden="true">→</span></a>
</div>
${relacionadas}
<a class="volver" href="/blog"><span aria-hidden="true">←</span> Volver al blog</a>
</article>
</main>

<footer>
<div class="wrap">
<img src="/assets/logo.png" alt="TAX AUDITORS">
<div class="der"><span>© 2026 TAX AUDITORS COMPANY TAXAUD S.A.S. · RUC 0691784323001 · Ecuador</span><a href="/privacidad">Política de privacidad</a><div class="redes"><a href="https://www.facebook.com/tax.auditors.9" target="_blank" rel="noopener" aria-label="Facebook de TAX AUDITORS"><i class="ph-light ph-facebook-logo" aria-hidden="true"></i></a><a href="https://www.instagram.com/tax_auditors_riobamba/" target="_blank" rel="noopener" aria-label="Instagram de TAX AUDITORS"><i class="ph-light ph-instagram-logo" aria-hidden="true"></i></a></div></div>
</div>
</footer>
<script>
document.querySelectorAll('.copiar').forEach(function (b) {
  b.addEventListener('click', function () {
    var s = b.querySelector('span');
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.url).then(function () { s.textContent = 'Enlace copiado'; });
  });
});
</script>
</body>
</html>`;
}

export async function onRequestGet(context) {
  const slug = decodeURIComponent(String(context.params.slug || '')).replace(/\.html$/, '');
  let pubs = [];
  try { pubs = await obtenerPublicaciones(context); } catch (e) { pubs = []; }

  const p = pubs.find(x => x.id === slug);
  if (!p) return Response.redirect(new URL('/blog', context.request.url).toString(), 302);

  const otras = pubs.filter(x => x.id !== p.id).sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || ''))).slice(0, 3);
  return new Response(pagina(p, otras), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
}
