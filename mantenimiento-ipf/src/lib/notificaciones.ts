import * as Notifications from "expo-notifications";
import { CANAL_REPORTES, crearCanalReportes, interpretar } from "./permisos";
import {
  agregarAviso,
  buscarReporte,
  cambiarEstadoReporte,
  obtenerEstado,
} from "./reportes";

const SEGUNDOS_SIMULACION = 10;

/** Muestra las notificaciones aunque la app esté abierta. */
export function configurarNotificaciones() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Botón de prueba "Simular resolución": a los 10 s el reporte pasa a "resuelto".
 * - Si el interruptor está activo y hay permiso → notificación local del sistema.
 * - Siempre → el aviso queda en la bandeja /avisos (alternativa si se denegó).
 * Devuelve true si se programó una notificación del sistema.
 */
export async function simularResolucion(id: string): Promise<boolean> {
  const reporte = buscarReporte(id);
  if (!reporte) return false;

  cambiarEstadoReporte(id, "en curso");

  let notificado = false;
  if (obtenerEstado().avisarAlResolver) {
    // Se consulta al sistema en el momento: el permiso pudo cambiar en Ajustes.
    const permiso = interpretar(await Notifications.getPermissionsAsync());
    if (permiso.estado === "concedido") {
      const hayCanal = await crearCanalReportes();
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Reporte resuelto ✅",
            body: `"${reporte.titulo}" ya fue solucionado. ¡Gracias por avisar!`,
            data: { reporteId: id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: SEGUNDOS_SIMULACION,
            // Si no se pudo crear el canal (Expo Go), se usa el canal por defecto.
            ...(hayCanal ? { channelId: CANAL_REPORTES } : {}),
          },
        });
        notificado = true;
      } catch (error) {
        // Si falla, el aviso igual llega a la bandeja /avisos.
        console.log("No se pudo programar la notificación:", error);
      }
    }
  }

  setTimeout(() => {
    cambiarEstadoReporte(id, "resuelto");
    agregarAviso({
      reporteId: id,
      titulo: "Reporte resuelto",
      cuerpo: `"${reporte.titulo}" ya fue solucionado.`,
      notificado,
    });
  }, SEGUNDOS_SIMULACION * 1000);

  return notificado;
}
