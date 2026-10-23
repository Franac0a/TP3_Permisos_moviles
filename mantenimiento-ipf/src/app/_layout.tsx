import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Reportes" }} />
      <Tabs.Screen name="avisos" options={{ title: "Avisos" }} />
      <Tabs.Screen name="permisos" options={{ title: "Permisos" }} />

      {/* Ocultamos las rutas secundarias para que no aparezcan como pestañas */}
      <Tabs.Screen name="ajustes-app" options={{ href: null }} />
      <Tabs.Screen name="reporte/nuevo" options={{ href: null }} />
      <Tabs.Screen name="reporte/escanear" options={{ href: null }} />
      <Tabs.Screen name="reporte/foto" options={{ href: null }} />
      <Tabs.Screen name="reporte/ubicacion" options={{ href: null }} />
      <Tabs.Screen name="reporte/[id]" options={{ href: null }} />
      <Tabs.Screen name="permisos/[recurso]" options={{ href: null }} />
    </Tabs>
  );
}
