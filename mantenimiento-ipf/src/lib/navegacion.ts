import { router, type Href } from "expo-router";
import type { EstadoPermiso, Recurso } from "./permisos";

/**
 * Se llama SOLO cuando la persona toca una función (pedir en contexto).
 * - Concedido → va directo a la función (si hay destino).
 * - Preguntable o bloqueado → primero la pantalla previa /permisos/[recurso].
 *   Si la persona dijo que no, la previa no vuelve a aparecer sola: recién
 *   cuando toca otra vez la función (requisito "no insistir").
 * Devuelve true si el permiso ya estaba concedido.
 */
export function usarFuncion(recurso: Recurso, estado: EstadoPermiso, destino?: string) {
  if (estado === "cargando") return false;
  if (estado === "concedido") {
    if (destino) router.push(destino as Href);
    return true;
  }
  router.push({
    pathname: "/permisos/[recurso]",
    params: destino ? { recurso, siguiente: destino } : { recurso },
  });
  return false;
}
