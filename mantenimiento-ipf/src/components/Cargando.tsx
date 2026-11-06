import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colores } from "./tema";

export function Cargando({ texto = "Consultando permiso…" }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={colores.primario} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  texto: { marginTop: 12, color: colores.suave },
});
