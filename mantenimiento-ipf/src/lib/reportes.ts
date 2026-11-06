// Store mínimo en memoria (sin librerías) para los reportes, el borrador del
// formulario, la bandeja de avisos y la preferencia "Avisarme cuando se resuelva".
// Ojo: acá NO se guarda el estado de los permisos; eso se consulta siempre al sistema.
import { useSyncExternalStore } from "react";

export type Categoria = "electricidad" | "agua" | "mobiliario" | "equipos";
export const CATEGORIAS: Categoria[] = ["electricidad", "agua", "mobiliario", "equipos"];

export type EstadoReporte = "pendiente" | "en curso" | "resuelto";

export const SECTORES = [
  "Patio",
  "Estacionamiento",
  "Pasillo planta baja",
  "Pasillo primer piso",
  "Baños",
  "Buffet",
] as const;

export type UbicacionReporte =
  | { tipo: "gps"; latitud: number; longitud: number; aproximada: boolean }
  | { tipo: "sector"; sector: string };

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria | null;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  estado: EstadoReporte;
  creado: number;
};

export type Borrador = Omit<Reporte, "id" | "estado" | "creado">;

export type Aviso = {
  id: string;
  reporteId: string;
  titulo: string;
  cuerpo: string;
  fecha: number;
  /** true si además se programó una notificación del sistema. */
  notificado: boolean;
};

type Estado = {
  reportes: Reporte[];
  borrador: Borrador;
  avisos: Aviso[];
  avisarAlResolver: boolean;
};

const BORRADOR_VACIO: Borrador = {
  titulo: "",
  descripcion: "",
  aula: "",
  categoria: null,
  fotoUri: null,
  ubicacion: null,
};

const ahora = Date.now();
let estado: Estado = {
  reportes: [
    {
      id: "1",
      titulo: "Luz quemada en el pasillo",
      descripcion: "El tubo del fondo no prende.",
      aula: "",
      categoria: "electricidad",
      fotoUri: null,
      ubicacion: { tipo: "sector", sector: "Pasillo primer piso" },
      estado: "pendiente",
      creado: ahora - 86_400_000,
    },
    {
      id: "2",
      titulo: "Canilla que pierde",
      descripcion: "Gotea todo el día en el baño de varones.",
      aula: "",
      categoria: "agua",
      fotoUri: null,
      ubicacion: { tipo: "sector", sector: "Baños" },
      estado: "en curso",
      creado: ahora - 2 * 86_400_000,
    },
    {
      id: "3",
      titulo: "Proyector sin imagen",
      descripcion: "Enciende pero no muestra nada por HDMI.",
      aula: "A-12",
      categoria: "equipos",
      fotoUri: null,
      ubicacion: null,
      estado: "resuelto",
      creado: ahora - 5 * 86_400_000,
    },
  ],
  borrador: BORRADOR_VACIO,
  avisos: [],
  avisarAlResolver: false,
};

const oyentes = new Set<() => void>();

function actualizar(cambio: (anterior: Estado) => Estado) {
  estado = cambio(estado);
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function obtenerEstado() {
  return estado;
}

/** Hook para leer el store desde cualquier pantalla. */
export function useAppStore() {
  return useSyncExternalStore(suscribir, obtenerEstado, obtenerEstado);
}

export function actualizarBorrador(cambios: Partial<Borrador>) {
  actualizar((e) => ({ ...e, borrador: { ...e.borrador, ...cambios } }));
}

/** Valida y guarda el borrador. Devuelve el reporte o un mensaje de error. */
export function guardarBorrador(): { ok: true; reporte: Reporte } | { ok: false; error: string } {
  const b = estado.borrador;
  if (!b.titulo.trim()) return { ok: false, error: "Escribí un título." };
  if (!b.categoria) return { ok: false, error: "Elegí una categoría." };
  if (!b.aula.trim() && !b.ubicacion) {
    return {
      ok: false,
      error: "Indicá el aula (escaneada o escrita) o marcá la ubicación/sector.",
    };
  }
  const reporte: Reporte = {
    ...b,
    titulo: b.titulo.trim(),
    descripcion: b.descripcion.trim(),
    aula: b.aula.trim(),
    id: String(Date.now()),
    estado: "pendiente",
    creado: Date.now(),
  };
  actualizar((e) => ({ ...e, reportes: [reporte, ...e.reportes], borrador: BORRADOR_VACIO }));
  return { ok: true, reporte };
}

export function buscarReporte(id: string | undefined) {
  return estado.reportes.find((r) => r.id === id);
}

export function cambiarEstadoReporte(id: string, nuevo: EstadoReporte) {
  actualizar((e) => ({
    ...e,
    reportes: e.reportes.map((r) => (r.id === id ? { ...r, estado: nuevo } : r)),
  }));
}

export function agregarAviso(aviso: Omit<Aviso, "id" | "fecha">) {
  actualizar((e) => ({
    ...e,
    avisos: [{ ...aviso, id: String(Date.now()), fecha: Date.now() }, ...e.avisos],
  }));
}

export function setAvisarAlResolver(valor: boolean) {
  actualizar((e) => ({ ...e, avisarAlResolver: valor }));
}

export function describirUbicacion(u: UbicacionReporte | null) {
  if (!u) return "Sin ubicación";
  if (u.tipo === "sector") return `Sector: ${u.sector}`;
  // Requisito: si es aproximada no se muestran coordenadas exactas.
  if (u.aproximada) return "Ubicación aproximada";
  return `${u.latitud.toFixed(5)}, ${u.longitud.toFixed(5)}`;
}
