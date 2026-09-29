/*
  PUBLICACIONES — TAXAUD
  Para publicar: copie un bloque, cambie los datos y guarde.
  tipo:     'noticia' | 'documento' | 'video'
  fecha:    'AAAA-MM-DD'
  temas:    cualquiera de: SRI, SCVS, SEPS, IESS, UAFE, NIIF, Laboral, General
  archivo:  PDF descargable → coloque el PDF en publicaciones/archivos/ y escriba su ruta
  video:    { youtube: 'ID del video' }  o  { mp4: 'publicaciones/videos/archivo.mp4' }
  cuerpo:   párrafos del artículo (opcional)
  destacado: true → aparece arriba como publicación principal
*/
window.TAXAUD_PUBS = [
  {
    id: 'registro-proveedores-facturacion-electronica', tipo: 'documento', fecha: '2026-09-29', destacado: true,
    titulo: 'SRI crea el registro de proveedores de facturación electrónica',
    resumen: 'La Resolución Nro. NAC-DGERCGC26-00000027 obliga a quienes desarrollan o comercializan sistemas de facturación electrónica a identificarse en el RUC, y a los emisores a incluir el RUC de su proveedor en los comprobantes.',
    temas: ['SRI'],
    archivo: { url: 'publicaciones/archivos/resolucion-NAC-DGERCGC26-00000027.pdf', peso: '305 KB', paginas: 4 },
    cuerpo: [
      'El Servicio de Rentas Internas expidió la Resolución Nro. NAC-DGERCGC26-00000027 (27 de julio de 2026). Establece que quienes desarrollan o comercializan sistemas de facturación electrónica deberán identificarse formalmente en el RUC.',
      'Qué cambia',
      '• Los desarrolladores y los propietarios de licencias de estos sistemas, domiciliados en Ecuador, deben registrar un establecimiento exclusivo en el RUC con los códigos CIIU J62021002 (desarrollo de sistemas) o J62021003 (comercialización de sistemas de terceros).',
      '• El SRI publicará en su portal el listado de proveedores registrados. Se actualizará cada mes, dentro de los primeros 10 días hábiles, y la primera publicación será desde octubre de 2026.',
      '• Los emisores de comprobantes electrónicos deberán incluir en la información adicional el RUC del proveedor de su sistema de facturación.',
      'Plazos (desde la publicación en el Registro Oficial)',
      '• 30 días para inscribirse o actualizar el RUC.',
      '• 60 días calendario para incluir el RUC del proveedor en los comprobantes.',
      'Qué hacer: revise quién le provee su sistema de facturación y confirme que esté registrado. Si usted desarrolla o comercializa software de facturación, actualice su RUC dentro del plazo.',
      'TAX AUDITORS COMPANY TAXAUD S.A.S. — Seguridad jurídica y eficiencia tributaria. Fuente: SRI, Resolución NAC-DGERCGC26-00000027.'
    ]
  }
];
