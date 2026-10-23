import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Reportes" }} />
      <Tabs.Screen name="avisos" options={{ title: "Avisos" }} />
      <Tabs.Screen name="permisos" options={{ title: "Permisos" }} />

      {/* Ocultamos las rutas internas de la barra de pestañas */}
      <Tabs.Screen
        name="reporte"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="ajustes-app"
        options={{ href: null, title: "Ajustes" }}
      />
    </Tabs>
  );
}
