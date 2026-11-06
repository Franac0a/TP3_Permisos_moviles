import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Boton } from "@/components/Boton";
import { COLOR_REPORTE, colores } from "@/components/tema";
import { useAppStore } from "@/lib/reportes";

// Inicio: no pide ningún permiso.
export default function Inicio() {
  const { reportes } = useAppStore();

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={reportes}
        keyExtractor={(r) => r.id}
        ListEmptyComponent={<Text style={styles.vacio}>Todavía no cargaste reportes.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.tarjeta}
            onPress={() => router.push({ pathname: "/reporte/[id]", params: { id: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.sub}>
                {item.categoria ?? "sin categoría"}
                {item.aula ? ` · Aula ${item.aula}` : ""}
              </Text>
            </View>
            <Text style={[styles.estado, { backgroundColor: COLOR_REPORTE[item.estado] }]}>
              {item.estado}
            </Text>
          </Pressable>
        )}
      />
      <Boton titulo="+ Nuevo reporte" onPress={() => router.push("/reporte/nuevo")} />
      <Boton
        titulo="🔔 Configurar avisos"
        variante="secundario"
        onPress={() => router.push("/ajustes-app")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 16, backgroundColor: colores.fondo },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: colores.tarjeta,
    borderRadius: 10,
    marginBottom: 10,
  },
  titulo: { fontSize: 16, fontWeight: "700" },
  sub: { color: colores.suave, marginTop: 2, textTransform: "capitalize" },
  estado: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    textTransform: "uppercase",
  },
  vacio: { textAlign: "center", color: colores.suave, marginTop: 40 },
});
