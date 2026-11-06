import { Tabs } from "expo-router";
import { Text } from "react-native";

function icono(emoji: string) {
  return function Icono() {
    return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
  };
}

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Reportes", tabBarIcon: icono("🛠️") }} />
      <Tabs.Screen name="avisos" options={{ title: "Avisos", tabBarIcon: icono("📬") }} />
      <Tabs.Screen name="permisos" options={{ title: "Permisos", tabBarIcon: icono("🔐") }} />
    </Tabs>
  );
}
