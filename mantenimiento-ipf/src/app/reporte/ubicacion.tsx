import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getCurrentPositionAsync } from "expo-location";
import { router } from "expo-router";
import { usePermiso } from "../../hooks/usePermiso";
import { useState } from "react";

export default function Ubicacion() {
  // Ahora cumple exactamente con la firma requerida: usePermiso('ubicacion')
  const { estado, parcial, pedir, abrirAjustes } = usePermiso("ubicacion");
  const [ubicacion, setUbicacion] = useState<string | null>(null);

  const obtenerCoordenadas = async () => {
    const ubic = await getCurrentPositionAsync({});
    setUbicacion(`${ubic.coords.latitude}, ${ubic.coords.longitude}`);
  };

  if (estado === "cargando") {
    return (
      <ActivityIndicator style={styles.centro} size="large" color="#007AFF" />
    );
  }

  if (estado === "preguntable") {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>
          Usamos tu ubicación para marcar dónde está el problema.
        </Text>
        <Button title="Continuar" onPress={pedir} />
        <Button
          title="Elegir sector a mano"
          color="gray"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  if (estado === "bloqueado") {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>
          Ubicación bloqueada. Habilitala desde los ajustes o elegí el sector a
          mano.
        </Text>
        <Button title="Abrir Ajustes" onPress={abrirAjustes} />
        <Button
          title="Elegir sector a mano"
          color="gray"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>
        {parcial
          ? "Ubicación aproximada detectada"
          : "Ubicación precisa concedida"}
      </Text>

      {ubicacion ? (
        <Text style={styles.coordenadas}>Coords: {ubicacion}</Text>
      ) : (
        <Button title="Obtener coordenadas" onPress={obtenerCoordenadas} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Confirmar y volver"
          color="#28a745"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  texto: { textAlign: "center", marginBottom: 20, fontSize: 16 },
  coordenadas: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
});
