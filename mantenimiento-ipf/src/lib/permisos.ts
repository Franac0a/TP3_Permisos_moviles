// Lógica de permisos independiente de la UI.
// La fuente de verdad SIEMPRE es el sistema operativo: acá solo se consulta,
// se pide y se traduce la respuesta de Expo a los cuatro estados de la app.
import * as Notifications from "expo-notifications";
import type { PermissionResponse } from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export type Recurso = "camara" | "ubicacion" | "notificaciones";
export type EstadoPermiso = "cargando" | "concedido" | "preguntable" | "bloqueado";

export const RECURSOS: Recurso[] = ["camara", "ubicacion", "notificaciones"];

export function esRecurso(valor: unknown): valor is Recurso {
  return typeof valor === "string" && (RECURSOS as string[]).includes(valor);
}

type InfoRecurso = {
  nombre: string;
  icono: string;
  /** Beneficio en una frase, con el molde "Usamos tu [dato] para [beneficio]". */
  beneficio: string;
  /** Qué puede hacer la persona si no da el permiso. */
  alternativa: string;
  /** Camino exacto en Ajustes para habilitarlo si quedó bloqueado. */
  caminoAndroid: string;
  caminoIOS: string;
};

export const INFO_RECURSO: Record<Recurso, InfoRecurso> = {
  camara: {
    nombre: "Cámara",
    icono: "📷",
    beneficio:
      "Usamos tu cámara para leer el QR de la puerta del aula y sacar la foto del desperfecto.",
    alternativa:
      "Si no querés usarla, podés escribir el código del aula a mano y elegir una foto de la galería.",
    caminoAndroid:
      "Ajustes › Aplicaciones › Mantenimiento IPF › Permisos › Cámara › Permitir solo mientras la app está en uso",
    caminoIOS: "Ajustes › Mantenimiento IPF › activar Cámara",
  },
  ubicacion: {
    nombre: "Ubicación",
    icono: "📍",
    beneficio:
      "Usamos tu ubicación para marcar en el reporte dónde está el desperfecto dentro del Instituto.",
    alternativa:
      "Si no querés compartirla, podés elegir el sector (patio, pasillo, estacionamiento…) a mano.",
    caminoAndroid:
      "Ajustes › Aplicaciones › Mantenimiento IPF › Permisos › Ubicación › Permitir solo mientras la app está en uso",
    caminoIOS: "Ajustes › Mantenimiento IPF › Ubicación › Mientras se usa la app",
  },
  notificaciones: {
    nombre: "Notificaciones",
    icono: "🔔",
    beneficio:
      "Usamos las notificaciones para avisarte en cuanto se resuelva tu reporte.",
    alternativa:
      "Si no las activás, igual vas a ver cada aviso en la pestaña Avisos.",
    caminoAndroid:
      "Ajustes › Aplicaciones › Mantenimiento IPF › Notificaciones › activar Todas las notificaciones",
    caminoIOS: "Ajustes › Mantenimiento IPF › Notificaciones › Permitir notificaciones",
  },
};

export const CANAL_REPORTES = "reportes";

/**
 * En Android 13+ el diálogo de POST_NOTIFICATIONS solo aparece si ya existe
 * al menos un canal. Por eso se crea ANTES de pedir el permiso.
 */
export async function crearCanalReportes(): Promise<boolean> {
  if (Platform.OS !== "android") return false;
  try {
    await Notifications.setNotificationChannelAsync(CANAL_REPORTES, {
      name: "Reportes",
      description: "Avisos cuando cambia el estado de tus reportes",
      importance: Notifications.AndroidImportance.HIGH,
    });
    return true;
  } catch (error) {
    // Expo Go en Android (SDK 57) no permite crear canales propios
    // (NullPointerException en NotificationsChannelsProvider). En una
    // development build funciona. Seguimos con el canal por defecto.
    console.log("No se pudo crear el canal 'reportes':", error);
    return false;
  }
}

export async function pedirNotificaciones() {
  await crearCanalReportes();
  return Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
}

export type Lectura = {
  estado: EstadoPermiso;
  /** Fotos limitadas, ubicación aproximada o notificaciones provisionales. */
  parcial: boolean;
  /** Texto con el matiz técnico para el panel (accuracy, ios.status…). */
  matiz: string | null;
};

type RespuestaConDetalles = PermissionResponse & {
  accessPrivileges?: "all" | "limited" | "none";
  android?: { accuracy?: "fine" | "coarse" | "none" };
  ios?: {
    accuracy?: "full" | "reduced";
    status?: Notifications.IosAuthorizationStatus;
  };
};

/** Traduce la PermissionResponse de Expo a los estados de la app. */
export function interpretar(respuesta: PermissionResponse | null): Lectura {
  if (!respuesta) return { estado: "cargando", parcial: false, matiz: null };

  const r = respuesta as RespuestaConDetalles;
  const matices: string[] = [];
  let parcial = false;

  if (r.accessPrivileges) {
    matices.push(`accessPrivileges: ${r.accessPrivileges}`);
    if (r.accessPrivileges === "limited") parcial = true;
  }
  if (r.android?.accuracy) {
    matices.push(`android.accuracy: ${r.android.accuracy}`);
    if (r.android.accuracy === "coarse") parcial = true;
  }
  if (r.ios?.accuracy) {
    matices.push(`ios.accuracy: ${r.ios.accuracy}`);
    if (r.ios.accuracy === "reduced") parcial = true;
  }
  const provisional =
    r.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (provisional) {
    matices.push("ios.status: provisional");
    parcial = true;
  }

  // status y canAskAgain son los dos campos que deciden casi todo.
  let estado: EstadoPermiso;
  if (r.granted || provisional) estado = "concedido";
  else if (r.canAskAgain) estado = "preguntable";
  else estado = "bloqueado";

  return { estado, parcial, matiz: matices.length ? matices.join(" · ") : null };
}

export function caminoEnAjustes(recurso: Recurso) {
  const info = INFO_RECURSO[recurso];
  return Platform.OS === "ios" ? info.caminoIOS : info.caminoAndroid;
}

/** Abre los Ajustes de la app; si el sistema no lo permite, muestra el camino. */
export async function abrirAjustes(recurso?: Recurso) {
  try {
    await Linking.openSettings();
  } catch {
    Alert.alert(
      "Abrí los Ajustes manualmente",
      recurso
        ? caminoEnAjustes(recurso)
        : "Ajustes › Aplicaciones › Mantenimiento IPF › Permisos",
    );
  }
}
