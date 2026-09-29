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
    id: 'calendario-tributario-2026', tipo: 'documento', fecha: '2026-09-22', destacado: true,
    titulo: 'Calendario tributario: vencimientos según el noveno dígito del RUC',
    resumen: 'Tabla de fechas de declaración de IVA, retenciones y anexos para sociedades y personas naturales, lista para imprimir.',
    temas: ['SRI'],
    archivo: { url: 'publicaciones/archivos/calendario-tributario.pdf', peso: '420 KB', paginas: 2 },
    cuerpo: ['Las obligaciones mensuales vencen según el noveno dígito del RUC. Descargue la tabla y compártala con su equipo contable.']
  },
  {
    id: 'notificaciones-sri-que-hacer', tipo: 'video', fecha: '2026-09-15',
    titulo: 'Recibí una notificación del SRI: qué hacer en las primeras 48 horas',
    resumen: 'Cómo leer el documento, qué plazos corren y qué información reunir antes de responder.',
    temas: ['SRI'],
    video: { youtube: '', duracion: '6:40' }
  },
  {
    id: 'balances-scvs', tipo: 'noticia', fecha: '2026-09-08',
    titulo: 'Carga de estados financieros en la SCVS: errores frecuentes que generan observaciones',
    resumen: 'Diferencias entre formularios, notas incompletas y firmas: lo que revisamos antes de cada presentación.',
    temas: ['SCVS', 'NIIF'],
    cuerpo: [
      'Cada año, una parte importante de las observaciones de la Superintendencia de Compañías se origina en detalles de forma que pueden evitarse con una revisión previa.',
      'En esta nota resumimos los puntos que verificamos antes de cada carga: coherencia entre estados, notas explicativas y documentos habilitantes.'
    ]
  },
  {
    id: 'guia-riesgo-liquidez', tipo: 'documento', fecha: '2026-08-28',
    titulo: 'Guía práctica: indicadores de riesgo de liquidez para cooperativas',
    resumen: 'Plantilla de indicadores, límites sugeridos y forma de reportarlos al consejo de administración.',
    temas: ['SEPS'],
    archivo: { url: 'publicaciones/archivos/guia-riesgo-liquidez.pdf', peso: '1,2 MB', paginas: 14 }
  },
  {
    id: 'decimos-2026', tipo: 'noticia', fecha: '2026-08-12',
    titulo: 'Décimo cuarto sueldo en la Sierra y Amazonía: cálculo y fecha de pago',
    resumen: 'Quiénes lo reciben, cómo se calcula de forma proporcional y cómo registrarlo en el IESS.',
    temas: ['IESS', 'Laboral'],
    cuerpo: ['El décimo cuarto sueldo se paga de forma proporcional al tiempo trabajado en el periodo de cálculo. Revise la fecha límite aplicable a su región.']
  },
  {
    id: 'webinar-niif-pymes', tipo: 'video', fecha: '2026-07-30',
    titulo: 'Webinar: NIIF para PYMES — cambios que debe conocer su contador',
    resumen: 'Grabación completa de la sesión con preguntas del público.',
    temas: ['NIIF'],
    video: { youtube: '', duracion: '48:10' }
  },
  {
    id: 'uafe-reportes', tipo: 'noticia', fecha: '2026-07-18',
    titulo: 'Reportes a la UAFE: qué sujetos obligados deben presentarlos y con qué frecuencia',
    resumen: 'Resumen de obligaciones de prevención de lavado de activos para empresas y cooperativas.',
    temas: ['UAFE'],
    cuerpo: ['Los sujetos obligados deben designar un oficial de cumplimiento y presentar reportes periódicos. Verifique si su actividad está incluida.']
  },
  {
    id: 'checklist-cierre', tipo: 'documento', fecha: '2026-07-02',
    titulo: 'Checklist de cierre contable mensual',
    resumen: 'Lista de verificación de conciliaciones, provisiones y ajustes antes de emitir estados financieros.',
    temas: ['NIIF', 'General'],
    archivo: { url: 'publicaciones/archivos/checklist-cierre.pdf', peso: '310 KB', paginas: 3 }
  },
  {
    id: 'ats-guia', tipo: 'noticia', fecha: '2026-06-20',
    titulo: 'Anexo Transaccional Simplificado: cómo evitar diferencias con las declaraciones',
    resumen: 'Por qué el ATS y el formulario de IVA no cuadran y cómo conciliarlos cada mes.',
    temas: ['SRI'],
    cuerpo: ['Las diferencias entre el ATS y las declaraciones son una de las causas más comunes de comunicaciones del SRI. Conciliar mensualmente evita sorpresas.']
  }
];
