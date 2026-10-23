import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function AdjuntarFoto() {
  const [imagen, setImagen] = useState<string | null>(null);

  const elegirFoto = async () => {
    // Esto abre el selector del sistema sin pedir permisos extra
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Adjuntar foto del desperfecto</Text>

      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

      <View style={styles.botonera}>
        <Button title="Elegir de la galería" onPress={elegirFoto} />
      </View>

      <Button
        title={imagen ? "Guardar y volver" : "Volver sin foto"}
        color={imagen ? "#28a745" : "gray"}
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  texto: { fontSize: 18, marginBottom: 20 },
  imagen: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 },
  botonera: { marginBottom: 20, width: "100%" },
});
