import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AjustesApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configuración Manual</Text>

      <Text style={styles.texto}>
        Tu dispositivo no permite abrir los ajustes automáticamente. Para
        habilitar los permisos, seguí estos pasos:
      </Text>

      <View style={styles.pasos}>
        <Text style={styles.paso}>
          1. Volvé a la pantalla de inicio de tu celular.
        </Text>
        <Text style={styles.paso}>2. Abrí "Ajustes" o "Configuración".</Text>
        <Text style={styles.paso}>
          3. Entrá a "Aplicaciones" y buscá esta app.
        </Text>
        <Text style={styles.paso}>
          4. Tocá en "Permisos" y habilitá los que necesites.
        </Text>
      </View>

      <Button title="Volver atrás" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#d9534f",
  },
  texto: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  pasos: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  paso: { fontSize: 16, marginBottom: 10, fontWeight: "500" },
});
