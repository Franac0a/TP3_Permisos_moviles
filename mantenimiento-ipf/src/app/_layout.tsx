import { Stack } from "expo-router";
import { configurarNotificaciones } from "@/lib/notificaciones";

configurarNotificaciones();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="reporte/nuevo" options={{ title: "Nuevo reporte" }} />
      <Stack.Screen name="reporte/escanear" options={{ title: "Escanear QR del aula" }} />
      <Stack.Screen name="reporte/foto" options={{ title: "Foto del desperfecto" }} />
      <Stack.Screen name="reporte/ubicacion" options={{ title: "Ubicación del problema" }} />
      <Stack.Screen name="reporte/[id]" options={{ title: "Detalle del reporte" }} />
      <Stack.Screen name="ajustes-app" options={{ title: "Ajustes de la app" }} />
      {/* Pantalla previa al diálogo del sistema: modal, sin "Cerrar" ni "Ahora no". */}
      <Stack.Screen
        name="permisos/[recurso]"
        options={{ presentation: "modal", title: "Antes de continuar", headerBackVisible: false }}
      />
    </Stack>
  );
}
