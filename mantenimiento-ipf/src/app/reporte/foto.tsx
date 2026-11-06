// "Sacar foto" necesita la cámara. "Elegir de la galería" usa el selector del
// sistema y NO pide permiso de galería (la app no declara READ_MEDIA_IMAGES).
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Boton } from "@/components/Boton";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import { actualizarBorrador, useAppStore } from "@/lib/reportes";

export default function AdjuntarFoto() {
  const { borrador } = useAppStore();
  const camara = usePermiso("camara");
  const [uri, setUri] = useState<string | null>(borrador.fotoUri);

  const sacarFoto = async () => {
    // Si no está concedida, primero la pantalla previa; al volver se toca otra vez.
    if (!usarFuncion("camara", camara.estado)) return;
    try {
      const r = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.7 });
      if (!r.canceled) setUri(r.assets[0].uri);
    } catch {
      Alert.alert("No se pudo abrir la cámara", "Probá elegir una foto de la galería.");
    }
  };

  const elegirDeGaleria = async () => {
    // Selector del sistema: sin permiso. La persona elige y la app recibe solo esa foto.
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!r.canceled) setUri(r.assets[0].uri);
  };

  return (
    <View style={styles.contenedor}>
      {uri ? (
        <Image source={{ uri }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.vacia]}>
          <Text style={{ color: colores.suave }}>Sin foto</Text>
        </View>
      )}

      <Boton titulo="📷 Sacar foto" onPress={sacarFoto} />
      <Boton titulo="🖼️ Elegir de la galería" variante="secundario" onPress={elegirDeGaleria} />
      <Text style={styles.nota}>
        Para elegir de la galería no hace falta ningún permiso: se abre el selector del sistema.
      </Text>

      <Boton
        titulo={uri ? "Usar esta foto" : "Volver sin foto"}
        variante={uri ? "exito" : "secundario"}
        onPress={() => {
          actualizarBorrador({ fotoUri: uri });
          router.back();
        }}
        estilo={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: colores.fondo },
  foto: { width: "100%", height: 260, borderRadius: 12, marginBottom: 16 },
  vacia: { backgroundColor: colores.tarjeta, justifyContent: "center", alignItems: "center" },
  nota: { color: colores.suave, fontSize: 13, textAlign: "center", marginTop: 4 },
});
