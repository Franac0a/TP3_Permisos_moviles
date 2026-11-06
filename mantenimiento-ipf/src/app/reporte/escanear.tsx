// Escáner con los cuatro estados: cargando → concedido → preguntable → bloqueado.
// Si la cámara se deniega, se puede escribir el código del aula a mano.
import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { AvisoBloqueado } from "@/components/AvisoBloqueado";
import { Boton } from "@/components/Boton";
import { Cargando } from "@/components/Cargando";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import { INFO_RECURSO } from "@/lib/permisos";
import { actualizarBorrador, useAppStore } from "@/lib/reportes";

export default function Escanear() {
  // usePermiso('camara') envuelve useCameraPermissions de expo-camera.
  const { estado, abrirAjustes } = usePermiso("camara");

  // 1) Cargando: el hook todavía no tiene la respuesta del sistema (null).
  if (estado === "cargando") return <Cargando texto="Consultando permiso de cámara…" />;

  // 2) Concedido
  if (estado === "concedido") return <Camara />;

  // 3) Preguntable: explicación con "Continuar" (lleva a la pantalla previa).
  // 4) Bloqueado: aviso con "Abrir Ajustes".
  return (
    <View style={styles.centro}>
      {estado === "preguntable" ? (
        <View style={styles.caja}>
          <Text style={styles.texto}>{INFO_RECURSO.camara.beneficio}</Text>
          <Boton titulo="Continuar" onPress={() => usarFuncion("camara", estado)} />
        </View>
      ) : (
        <AvisoBloqueado recurso="camara" onAbrirAjustes={abrirAjustes} />
      )}
      <CodigoManual />
    </View>
  );
}

function Camara() {
  const leido = useRef(false);
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => {
          if (leido.current) return; // evita leer el mismo QR varias veces
          leido.current = true;
          actualizarBorrador({ aula: data.trim() });
          router.back();
        }}
      />
      <View style={styles.flotante}>
        <Text style={styles.guia}>Apuntá al QR pegado en la puerta del aula</Text>
        <Boton titulo="Escribir el código a mano" variante="secundario" onPress={() => router.back()} />
      </View>
    </View>
  );
}

function CodigoManual() {
  const { borrador } = useAppStore();
  const [codigo, setCodigo] = useState(borrador.aula);
  return (
    <View style={[styles.caja, { marginTop: 16 }]}>
      <Text style={styles.label}>O escribí el código del aula</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: A-12"
        autoCapitalize="characters"
        value={codigo}
        onChangeText={setCodigo}
      />
      <Boton
        titulo="Usar este código"
        variante="exito"
        deshabilitado={!codigo.trim()}
        onPress={() => {
          actualizarBorrador({ aula: codigo.trim() });
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: colores.fondo },
  caja: { padding: 20, backgroundColor: colores.tarjeta, borderRadius: 12 },
  texto: { fontSize: 16, textAlign: "center", marginBottom: 12 },
  label: { fontWeight: "700", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  flotante: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 12,
  },
  guia: { textAlign: "center", fontWeight: "600", marginBottom: 4 },
});
