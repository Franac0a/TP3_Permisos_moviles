import { useCallback, useState } from "react";
import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import * as Notifications from "expo-notifications";
import type { PermissionResponse } from "expo-location";
import { useFocusEffect } from "expo-router";
import {
  abrirAjustes as abrirAjustesSistema,
  interpretar,
  pedirNotificaciones,
  type EstadoPermiso,
  type Lectura,
  type Recurso,
} from "@/lib/permisos";
import { useRevisarAlVolver } from "./useRevisarAlVolver";

export type ResultadoPermiso = {
  estado: EstadoPermiso;
  /** Fotos limitadas, ubicación aproximada o notificaciones provisionales. */
  parcial: boolean;
  matiz: string | null;
  respuesta: PermissionResponse | null;
  /** Muestra el diálogo del sistema (si se puede) y devuelve el nuevo estado. */
  pedir: () => Promise<Lectura>;
  abrirAjustes: () => void;
  /** Vuelve a consultar al sistema sin mostrar diálogos. */
  revisar: () => void;
};

/**
 * Hook unificado de permisos.
 * - Cámara: useCameraPermissions (expo-camera).
 * - Ubicación: useForegroundPermissions (expo-location), solo primer plano.
 * - Notificaciones: get/requestPermissionsAsync (expo-notifications),
 *   creando el canal "reportes" antes de pedir en Android.
 * Se actualiza al volver de Ajustes (AppState) y al enfocar la pantalla.
 */
export function usePermiso(recurso: Recurso): ResultadoPermiso {
  // Los hooks se llaman siempre, en el mismo orden (reglas de los hooks).
  const [camara, pedirCamara, consultarCamara] = useCameraPermissions();
  const [ubicacion, pedirUbicacion, consultarUbicacion] = useForegroundPermissions();
  const [notificaciones, setNotificaciones] = useState<PermissionResponse | null>(null);

  const consultarNotificaciones = useCallback(async () => {
    const r = await Notifications.getPermissionsAsync();
    setNotificaciones(r);
    return r;
  }, []);

  const respuesta =
    recurso === "camara" ? camara : recurso === "ubicacion" ? ubicacion : notificaciones;

  const revisar = useCallback(() => {
    if (recurso === "camara") consultarCamara();
    else if (recurso === "ubicacion") consultarUbicacion();
    else consultarNotificaciones();
  }, [recurso, consultarCamara, consultarUbicacion, consultarNotificaciones]);

  useRevisarAlVolver(revisar); // al volver de Ajustes
  useFocusEffect(revisar); // al montar/enfocar la pantalla (incluye la 1.ª consulta de notificaciones)

  const pedir = useCallback(async () => {
    let r: PermissionResponse;
    if (recurso === "camara") r = await pedirCamara();
    else if (recurso === "ubicacion") r = await pedirUbicacion();
    else {
      r = await pedirNotificaciones();
      setNotificaciones(r);
    }
    return interpretar(r);
  }, [recurso, pedirCamara, pedirUbicacion]);

  const abrirAjustes = useCallback(() => {
    abrirAjustesSistema(recurso);
  }, [recurso]);

  const { estado, parcial, matiz } = interpretar(respuesta);
  return { estado, parcial, matiz, respuesta, pedir, abrirAjustes, revisar };
}
