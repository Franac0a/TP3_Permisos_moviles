import { Platform, StyleSheet, Text, View } from "react-native";
import { INFO_RECURSO, caminoEnAjustes, type Recurso } from "@/lib/permisos";
import { Boton } from "./Boton";
import { colores } from "./tema";

/** Permiso bloqueado: explica el camino exacto en Ajustes según la plataforma. */
export function AvisoBloqueado({
  recurso,
  onAbrirAjustes,
}: {
  recurso: Recurso;
  onAbrirAjustes: () => void;
}) {
  const info = INFO_RECURSO[recurso];
  return (
    <View style={styles.caja}>
      <Text style={styles.titulo}>
        {info.icono} {info.nombre} desactivada
      </Text>
      <Text style={styles.texto}>
        {Platform.OS === "ios"
          ? "Ya respondiste que no, e iOS no vuelve a mostrar el diálogo."
          : "Android ya no muestra el diálogo para este permiso."}{" "}
        Para habilitarlo andá a:
      </Text>
      <Text style={styles.camino}>{caminoEnAjustes(recurso)}</Text>
      <Boton titulo="Abrir Ajustes" onPress={onAbrirAjustes} />
      <Text style={styles.alternativa}>{info.alternativa}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: { padding: 20, backgroundColor: colores.tarjeta, borderRadius: 12, width: "100%" },
  titulo: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: colores.peligro },
  texto: { fontSize: 15, color: colores.texto, marginBottom: 8 },
  camino: {
    fontSize: 15,
    fontWeight: "600",
    color: colores.texto,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativa: { fontSize: 14, color: colores.suave, marginTop: 8 },
});
