// Bandeja de avisos dentro de la app: la alternativa a las notificaciones.
// Funciona igual con o sin permiso de notificaciones.
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Boton } from "@/components/Boton";
import { colores } from "@/components/tema";
import { useAppStore } from "@/lib/reportes";

export default function Avisos() {
  const { avisos } = useAppStore();

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={avisos}
        keyExtractor={(a) => a.id}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Acá llegan los avisos de tus reportes, tengas o no las notificaciones activadas.
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No hay avisos todavía. Probá «Simular resolución» en el detalle de un reporte.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.tarjeta}
            onPress={() =>
              router.push({ pathname: "/reporte/[id]", params: { id: item.reporteId } })
            }
          >
            <Text style={styles.titulo}>✅ {item.titulo}</Text>
            <Text>{item.cuerpo}</Text>
            <Text style={styles.meta}>
              {new Date(item.fecha).toLocaleTimeString()} ·{" "}
              {item.notificado ? "también se envió como notificación" : "solo en la bandeja"}
            </Text>
          </Pressable>
        )}
      />
      <Boton
        titulo="Configurar notificaciones"
        variante="secundario"
        onPress={() => router.push("/ajustes-app")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 16, backgroundColor: colores.fondo },
  intro: { color: colores.suave, marginBottom: 12 },
  tarjeta: { padding: 14, backgroundColor: colores.tarjeta, borderRadius: 10, marginBottom: 10 },
  titulo: { fontWeight: "700", marginBottom: 4 },
  meta: { color: colores.suave, fontSize: 12, marginTop: 6 },
  vacio: { textAlign: "center", color: colores.suave, marginTop: 40 },
});
