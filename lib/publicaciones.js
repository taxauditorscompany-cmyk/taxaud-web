/*
  Lector de publicaciones — TAXAUD
  Lo usan las funciones de Cloudflare (functions/blog/[slug].js y functions/sitemap.xml.js)
  para leer publicaciones/publicaciones.js sin ejecutarlo.
  No hay que modificar este archivo para publicar: se sigue editando publicaciones.js como siempre.
*/

// Convierte el texto de publicaciones.js (objetos JavaScript) en datos.
export function leerPublicaciones(src) {
  const ini = src.indexOf('TAXAUD_PUBS');
  if (ini < 0) return [];
  let i = src.indexOf('[', ini);
  if (i < 0) return [];

  const ws = () => {
    for (;;) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (src.startsWith('/*', i)) { const e = src.indexOf('*/', i + 2); i = e < 0 ? src.length : e + 2; continue; }
      return;
    }
  };
  const cadena = () => {
    const q = src[i++]; let s = '';
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') {
        const c = src[i + 1]; i += 2;
        if (c === 'n') s += '\n'; else if (c === 't') s += '\t';
        else if (c === 'u') { s += String.fromCharCode(parseInt(src.substr(i, 4), 16)); i += 4; }
        else if (c === '\n') { /* continuación de línea */ } else s += c;
      } else s += src[i++];
    }
    i++; return s;
  };
  const valor = () => {
    ws();
    const c = src[i];
    if (c === '[') {
      i++; const a = [];
      for (;;) { ws(); if (src[i] === ']') { i++; return a; } a.push(valor()); ws(); if (src[i] === ',') i++; }
    }
    if (c === '{') {
      i++; const o = {};
      for (;;) {
        ws(); if (src[i] === '}') { i++; return o; }
        let k;
        if (src[i] === '"' || src[i] === "'") k = cadena();
        else { const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i, i + 80)); if (!m) throw new Error('Clave inválida en la posición ' + i); k = m[0]; i += k.length; }
        ws(); if (src[i] !== ':') throw new Error('Se esperaba ":" en la posición ' + i); i++;
        o[k] = valor(); ws(); if (src[i] === ',') i++;
      }
    }
    if (c === '"' || c === "'" || c === '`') return cadena();
    const m = /^(-?\d+(\.\d+)?|true|false|null|undefined)/.exec(src.slice(i, i + 40));
    if (!m) throw new Error('Valor inválido en la posición ' + i);
    i += m[0].length;
    const t = m[0];
    return t === 'true' ? true : t === 'false' ? false : (t === 'null' || t === 'undefined') ? null : Number(t);
  };

  const lista = valor();
  return Array.isArray(lista) ? lista.filter(p => p && p.id && p.titulo) : [];
}

// Descarga y lee publicaciones.js desde los archivos del propio sitio.
export async function obtenerPublicaciones(context) {
  const url = new URL('/publicaciones/publicaciones.js', context.request.url);
  const r = await context.env.ASSETS.fetch(url.toString());
  if (!r.ok) return [];
  return leerPublicaciones(await r.text());
}
