import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { useState, useEffect } from "react";

/// Configuración obligatoria para que las notificaciones se muestren incluso si la app está abierta y en uso
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Avisos() {
  const [estado, setEstado] = useState<string>("cargando");

  useEffect(() => {
    verificarPermiso();
  }, []);

  const verificarPermiso = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setEstado(status);
  };

  const pedirPermiso = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setEstado(status);
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Habilitá las notificaciones desde los ajustes de tu teléfono.",
      );
    }
  };

  const simularNotificacion = async () => {
    if (estado !== "granted") {
      Alert.alert("Atención", "Primero tenés que habilitar los permisos.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Reporte Actualizado! 🛠️",
        body: "El problema 'Luz quemada en pasillo' ahora está 'En curso'.",
      },
      trigger: null, // null hace que se dispare inmediatamente
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Avisos y Notificaciones</Text>

      <View style={styles.tarjeta}>
        <Text style={styles.texto}>
          Estado del permiso:{" "}
          <Text style={{ fontWeight: "bold" }}>{estado}</Text>
        </Text>

        {estado !== "granted" && (
          <View style={styles.botonera}>
            <Button title="Activar Notificaciones" onPress={pedirPermiso} />
          </View>
        )}

        <View style={styles.botonera}>
          <Button
            title="Simular un aviso"
            color="#28a745"
            onPress={simularNotificacion}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tarjeta: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  texto: { fontSize: 16, marginBottom: 20 },
  botonera: { marginVertical: 10, width: "100%" },
});
