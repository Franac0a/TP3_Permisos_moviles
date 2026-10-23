import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function NuevoReporte() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título del reporte:</Text>
      <TextInput style={styles.input} placeholder="Ej: Luz quemada" />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Detalles del desperfecto"
        multiline
      />

      <Text style={styles.label}>Categoría:</Text>
      <TextInput
        style={styles.input}
        placeholder="Electricidad, agua, mobiliario, equipos"
      />

      <Text style={styles.label}>Aula:</Text>
      <View style={styles.fila}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10, marginBottom: 0 }]}
          placeholder="Escribir o escanear..."
        />
        <Button
          title="Escanear QR"
          onPress={() => router.push("/reporte/escanear")}
        />
      </View>

      <View style={styles.acciones}>
        <Button
          title="Adjuntar Foto"
          onPress={() => router.push("/reporte/foto")}
        />
        <View style={{ width: 10 }} />
        <Button
          title="Marcar Ubicación"
          onPress={() => router.push("/reporte/ubicacion")}
        />
      </View>

      <View style={styles.guardar}>
        <Button
          title="Guardar Reporte"
          color="#28a745"
          onPress={() => router.push("/")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  fila: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  acciones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  guardar: { marginTop: 20 },
});
