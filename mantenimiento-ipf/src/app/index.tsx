import { View, Text, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";

// Datos de prueba para simular los reportes cargados
const REPORTES_PRUEBA = [
  { id: "1", titulo: "Luz quemada en pasillo", estado: "pendiente" },
  { id: "2", titulo: "Canilla perdiendo", estado: "en curso" },
  { id: "3", titulo: "Proyector sin imagen", estado: "resuelto" },
];

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Reportes</Text>

      <FlatList
        data={REPORTES_PRUEBA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
            <Text>Estado: {item.estado}</Text>
            {/* Este Link nos lleva a la pantalla de detalle del reporte */}
            <Link href={`/reporte/${item.id}`} style={styles.linkDetalle}>
              Ver detalle
            </Link>
          </View>
        )}
      />

      {/* Botón para ir a crear un reporte nuevo */}
      <Link href="/reporte/nuevo" style={styles.botonNuevo}>
        <Text style={styles.textoBoton}>+ Nuevo reporte</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  tarjeta: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  tarjetaTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  linkDetalle: { color: "#007AFF", marginTop: 10, fontWeight: "500" },
  botonNuevo: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    textAlign: "center",
  },
  textoBoton: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
