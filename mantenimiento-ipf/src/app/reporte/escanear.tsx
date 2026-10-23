import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { usePermiso } from "../../hooks/usePermiso";
import { useState } from "react";

export default function Escanear() {
  // Ahora cumple exactamente con la firma requerida: usePermiso('camara')
  const { estado, pedir, abrirAjustes } = usePermiso("camara");

  const [escaneado, setEscaneado] = useState(false);

  if (estado === "cargando") {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.texto}>Cargando cámara...</Text>
      </View>
    );
  }

  if (estado === "preguntable") {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>
          Usamos la cámara para leer el QR del aula.
        </Text>
        <View style={styles.botonera}>
          <Button title="Continuar" onPress={pedir} />
        </View>
        <Button
          title="Escribir a mano (Cancelar)"
          color="gray"
          onPress={() => router.push("/reporte/nuevo")}
        />
      </View>
    );
  }

  if (estado === "bloqueado") {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>
          La cámara está bloqueada. Habilitala desde los ajustes de tu teléfono.
        </Text>
        <View style={styles.botonera}>
          <Button title="Abrir Ajustes" onPress={abrirAjustes} />
        </View>
        <Button
          title="Escribir a mano (Cancelar)"
          color="gray"
          onPress={() => router.push("/reporte/nuevo")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camara}
        facing="back"
        //  Si ya escaneó, apagamos la lectura (undefined), sino, leemos los datos
        onBarcodeScanned={
          escaneado
            ? undefined
            : ({ data }) => {
                setEscaneado(true); // Bajamos el interruptor
                alert(`Aula detectada: ${data}`);
                router.push("/reporte/nuevo");
              }
        }
      />
      <View style={styles.botonFlotante}>
        <Button
          title="Volver al formulario"
          color="red"
          onPress={() => router.push("/reporte/nuevo")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camara: { flex: 1 },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  texto: { textAlign: "center", marginBottom: 20, fontSize: 16 },
  botonera: { marginBottom: 15 },
  botonFlotante: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },
});
