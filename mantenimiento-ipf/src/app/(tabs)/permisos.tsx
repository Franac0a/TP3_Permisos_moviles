import { View, Text, Button, StyleSheet, Linking } from "react-native";
import { usePermiso } from "../hooks/usePermiso";
import * as Notifications from "expo-notifications";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

export default function PanelPermisos() {
  const permisoCamara = usePermiso("camara");
  const permisoUbicacion = usePermiso("ubicacion");

  const [estadoNotif, setEstadoNotif] = useState<string>("cargando...");

  // useFocusEffect se ejecuta automáticamente cada vez que entrás a esta pestaña
  useFocusEffect(
    useCallback(() => {
      Notifications.getPermissionsAsync().then((res) => {
        setEstadoNotif(res.status);
      });
    }, []),
  );

  const abrirAjustes = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumen de Accesos</Text>
      <Text style={styles.subtitulo}>
        Verificá qué permisos tiene la aplicación.
      </Text>

      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.item}>📷 Cámara:</Text>
          <Text
            style={[
              styles.valor,
              { color: permisoCamara.estado === "concedido" ? "green" : "red" },
            ]}
          >
            {permisoCamara.estado}
          </Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.item}>📍 Ubicación:</Text>
          <Text
            style={[
              styles.valor,
              {
                color:
                  permisoUbicacion.estado === "concedido" ? "green" : "red",
              },
            ]}
          >
            {permisoUbicacion.estado}
          </Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.item}>🔔 Notificaciones:</Text>
          <Text
            style={[
              styles.valor,
              { color: estadoNotif === "granted" ? "green" : "red" },
            ]}
          >
            {estadoNotif === "granted" ? "concedido" : estadoNotif}
          </Text>
        </View>
      </View>

      <View style={styles.botonera}>
        <Button title="Gestionar en Ajustes" onPress={abrirAjustes} />
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
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "gray",
  },
  tarjeta: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  item: { fontSize: 18, fontWeight: "500" },
  valor: { fontSize: 18, fontWeight: "bold", textTransform: "uppercase" },
  botonera: { marginTop: 10 },
});
