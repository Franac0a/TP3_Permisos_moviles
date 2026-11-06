export const colores = {
  primario: "#0A66C2",
  exito: "#1E8E3E",
  peligro: "#C5221F",
  advertencia: "#B06000",
  texto: "#1F1F1F",
  suave: "#5F6368",
  borde: "#DADCE0",
  tarjeta: "#F4F6F8",
  fondo: "#FFFFFF",
};

export const COLOR_ESTADO = {
  cargando: colores.suave,
  concedido: colores.exito,
  preguntable: colores.advertencia,
  bloqueado: colores.peligro,
} as const;

export const COLOR_REPORTE = {
  pendiente: colores.peligro,
  "en curso": colores.advertencia,
  resuelto: colores.exito,
} as const;
