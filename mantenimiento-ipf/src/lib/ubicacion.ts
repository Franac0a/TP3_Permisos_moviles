import * as Location from "expo-location";

export type Coordenadas = { latitud: number; longitud: number; aproximada: boolean };

/**
 * Devuelve las coordenadas actuales usando SOLO el permiso de primer plano.
 * Contempla la ubicación aproximada en Android (android.accuracy = 'coarse')
 * y en iOS (ios.accuracy = 'reduced'). Si no hay permiso o falla el GPS,
 * devuelve null sin romper la app.
 */
export async function obtenerUbicacion(): Promise<Coordenadas | null> {
  try {
    // get (no request): el pedido ya lo hizo la pantalla previa.
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const aproximada =
      permiso.android?.accuracy === "coarse" || permiso.ios?.accuracy === "reduced";

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: aproximada ? Location.Accuracy.Low : Location.Accuracy.Balanced,
    });

    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
      aproximada,
    };
  } catch {
    return null;
  }
}
