import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Boton } from "@/components/Boton";
import { COLOR_REPORTE, colores } from "@/components/tema";
import { simularResolucion } from "@/lib/notificaciones";
import { describirUbicacion, useAppStore } from "@/lib/reportes";

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reportes, avisarAlResolver } = useAppStore();
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Validar el id: solo dígitos y que exista.
  const reporte = /^\d+$/.test(id ?? "") ? reportes.find((r) => r.id === id) : undefined;

  if (!reporte) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Reporte no encontrado</Text>
        <Text style={styles.texto}>No existe ningún reporte con el id «{id}».</Text>
        <Boton titulo="Ir a mis reportes" onPress={() => router.replace("/")} />
      </View>
    );
  }

  const simular = async () => {
    const notificado = await simularResolucion(reporte.id);
    setMensaje(
      notificado
        ? "En 10 segundos vas a recibir una notificación (y el aviso queda en la pestaña Avisos)."
        : avisarAlResolver
          ? "Las notificaciones están desactivadas: en 10 segundos el aviso aparece en la pestaña Avisos."
          : "En 10 segundos el aviso aparece en la pestaña Avisos. Activá «Avisarme cuando se resuelva» en Ajustes de la app para recibir una notificación.",
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>{reporte.titulo}</Text>
      <Text style={[styles.estado, { backgroundColor: COLOR_REPORTE[reporte.estado] }]}>
        {reporte.estado}
      </Text>

      <Dato etiqueta="Categoría" valor={reporte.categoria ?? "—"} />
      <Dato etiqueta="Aula" valor={reporte.aula || "—"} />
      <Dato etiqueta="Ubicación" valor={describirUbicacion(reporte.ubicacion)} />
      <Dato etiqueta="Descripción" valor={reporte.descripcion || "—"} />
      <Dato etiqueta="Creado" valor={new Date(reporte.creado).toLocaleString()} />

      {reporte.fotoUri ? (
        <Image source={{ uri: reporte.fotoUri }} style={styles.foto} />
      ) : (
        <Text style={styles.texto}>Sin foto adjunta.</Text>
      )}

      <Boton
        titulo="Simular resolución"
        variante="exito"
        deshabilitado={reporte.estado === "resuelto"}
        onPress={simular}
      />
      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}
    </ScrollView>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 20, backgroundColor: colores.fondo },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  estado: {
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
    textTransform: "uppercase",
    overflow: "hidden",
  },
  dato: { marginBottom: 12 },
  etiqueta: { fontSize: 13, color: colores.suave },
  valor: { fontSize: 16, color: colores.texto, textTransform: "none" },
  foto: { width: "100%", height: 240, borderRadius: 10, marginVertical: 12 },
  texto: { fontSize: 15, color: colores.suave, marginVertical: 12, textAlign: "center" },
  mensaje: { marginTop: 12, fontSize: 15, color: colores.texto },
});
