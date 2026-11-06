// Formulario: no pide ningún permiso al abrir. Cada permiso se pide recién
// cuando la persona toca su función, y cada función tiene una alternativa.
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { Boton } from "@/components/Boton";
import { Chips } from "@/components/Chips";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import {
  CATEGORIAS,
  actualizarBorrador,
  describirUbicacion,
  guardarBorrador,
  useAppStore,
} from "@/lib/reportes";

export default function NuevoReporte() {
  const { borrador } = useAppStore();
  const camara = usePermiso("camara");

  const guardar = () => {
    const resultado = guardarBorrador();
    if (!resultado.ok) {
      Alert.alert("Falta completar", resultado.error);
      return;
    }
    router.replace({ pathname: "/reporte/[id]", params: { id: resultado.reporte.id } });
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Luz quemada"
        value={borrador.titulo}
        onChangeText={(titulo) => actualizarBorrador({ titulo })}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Detalles del desperfecto"
        multiline
        value={borrador.descripcion}
        onChangeText={(descripcion) => actualizarBorrador({ descripcion })}
      />

      <Text style={styles.label}>Categoría</Text>
      <Chips
        opciones={CATEGORIAS}
        valor={borrador.categoria}
        onCambiar={(categoria) => actualizarBorrador({ categoria })}
      />

      <Text style={styles.label}>Aula</Text>
      {/* Alternativa a la cámara: se puede escribir el código a mano. */}
      <TextInput
        style={styles.input}
        placeholder="Escribí el código (ej: A-12) o escaneá el QR"
        autoCapitalize="characters"
        value={borrador.aula}
        onChangeText={(aula) => actualizarBorrador({ aula })}
      />
      <Boton
        titulo="📷 Escanear QR del aula"
        variante="secundario"
        onPress={() => usarFuncion("camara", camara.estado, "/reporte/escanear")}
      />

      <Text style={styles.label}>Foto</Text>
      {borrador.fotoUri && <Image source={{ uri: borrador.fotoUri }} style={styles.foto} />}
      <Boton
        titulo={borrador.fotoUri ? "Cambiar foto" : "🖼️ Adjuntar foto"}
        variante="secundario"
        onPress={() => router.push("/reporte/foto")}
      />

      <Text style={styles.label}>Ubicación</Text>
      <Text style={styles.valor}>{describirUbicacion(borrador.ubicacion)}</Text>
      <Boton
        titulo="📍 Marcar ubicación"
        variante="secundario"
        onPress={() => router.push("/reporte/ubicacion")}
      />

      <Boton titulo="Guardar reporte" variante="exito" onPress={guardar} estilo={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 20, backgroundColor: colores.fondo },
  label: { fontWeight: "700", marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  valor: { color: colores.suave, marginBottom: 4 },
  foto: { width: "100%", height: 180, borderRadius: 10, marginBottom: 6 },
});
