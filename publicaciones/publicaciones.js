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
    id: 'transporte-terrestre-facturacion-retenciones', tipo: 'documento', fecha: '2026-09-29', destacado: true,
    titulo: 'Transporte terrestre comercial: lo que cambió con la reforma del SRI y cuándo se retiene',
    resumen: 'La Resolución NAC-DGERCGC26-00000028 reforma la 00000024: fija retenciones de 1% o 0% según quién paga y cómo factura el socio, y amplía los plazos hasta el 31 de diciembre de 2026.',
    temas: ['SRI'],
    archivo: { url: 'publicaciones/archivos/transporte-terrestre-facturacion-retenciones.pdf', peso: '326 KB', paginas: 4 },
    cuerpo: [
      'El SRI reformó las reglas de facturación y retención del transporte terrestre comercial, excepto taxis. La Resolución NAC-DGERCGC26-00000028 rige desde el 31 de julio de 2026 y modifica la Resolución NAC-DGERCGC26-00000024.',
      'Qué cambió',
      '• Las retenciones ahora tienen porcentajes expresos: 1% o 0%, según quién paga y cómo factura el socio.',
      '• Se amplían los plazos. El RUC y el campo "placa" en la factura electrónica se pueden cumplir hasta el 31 de diciembre de 2026. El SRI actualizará de oficio la actividad de los socios desde el 1 de enero de 2027.',
      '• Hasta el 31 de diciembre de 2026 los socios pueden seguir facturando como puntos de emisión de la operadora.',
      '¿Se retiene o no?',
      'Hasta el 31-dic-2026 (socio como punto de emisión):',
      '• La operadora no retiene (0%) al socio.',
      '• El cliente retiene 1% al socio.',
      '• El cliente retiene 1% a la operadora si el servicio es con unidades propias de la operadora.',
      'Desde el 1-ene-2027 (socio con RUC propio):',
      '• La operadora retiene 1% al socio.',
      '• El cliente no retiene (0%) a la operadora si el servicio es con unidades de los socios.',
      '• El cliente retiene 1% a la operadora si el servicio es con unidades propias de la operadora.',
      'La retención aplica solo si quien paga es agente de retención. Cuando la retención es 0%, no se emite comprobante de retención informativo, salvo pagos al exterior, dividendos o comprobante de venta preimpreso.',
      'Qué hacer: confirme en qué esquema factura su operadora o su socio antes de retener. Verifique que el RUC tenga la actividad correcta y que las facturas de la operadora incluyan la placa. Agende el 1 de enero de 2027.',
      'TAX AUDITORS COMPANY TAXAUD S.A.S. — Seguridad jurídica y eficiencia tributaria. Fuente: SRI, Resoluciones NAC-DGERCGC26-00000024 y 00000028.'
    ]
  },
  {
    id: 'registro-proveedores-facturacion-electronica', tipo: 'documento', fecha: '2026-09-29',
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
