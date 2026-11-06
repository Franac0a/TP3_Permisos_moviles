// Ubicación respetuosa: solo primer plano. Si es aproximada no se muestran
// coordenadas exactas. Si se deniega, se elige el sector a mano.
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AvisoBloqueado } from "@/components/AvisoBloqueado";
import { Boton } from "@/components/Boton";
import { Chips } from "@/components/Chips";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import {
  SECTORES,
  actualizarBorrador,
  describirUbicacion,
  useAppStore,
  type UbicacionReporte,
} from "@/lib/reportes";
import { obtenerUbicacion } from "@/lib/ubicacion";

export default function Ubicacion() {
  const { borrador } = useAppStore();
  const { estado, parcial, abrirAjustes } = usePermiso("ubicacion");
  const [elegida, setElegida] = useState<UbicacionReporte | null>(borrador.ubicacion);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usarMiUbicacion = async () => {
    // Pide en contexto: solo al tocar el botón, y con pantalla previa.
    if (!usarFuncion("ubicacion", estado)) return;
    setBuscando(true);
    setError(null);
    const coords = await obtenerUbicacion();
    setBuscando(false);
    if (coords) setElegida({ tipo: "gps", ...coords });
    else setError("No pudimos obtener tu ubicación. Elegí el sector a mano.");
  };

  const sectorActual = elegida?.tipo === "sector" ? elegida.sector : null;

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.label}>Con tu ubicación actual</Text>
      {estado === "bloqueado" ? (
        <AvisoBloqueado recurso="ubicacion" onAbrirAjustes={abrirAjustes} />
      ) : (
        <>
          <Boton
            titulo="📍 Usar mi ubicación actual"
            onPress={usarMiUbicacion}
            deshabilitado={estado === "cargando" || buscando}
          />
          {estado === "concedido" && parcial && (
            <Text style={styles.nota}>
              Compartiste la ubicación aproximada: no vamos a guardar coordenadas exactas.
            </Text>
          )}
        </>
      )}
      {buscando && <ActivityIndicator color={colores.primario} style={{ marginTop: 8 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={[styles.label, { marginTop: 24 }]}>O elegí el sector a mano</Text>
      <Chips
        opciones={SECTORES}
        valor={sectorActual as (typeof SECTORES)[number] | null}
        onCambiar={(sector) => setElegida({ tipo: "sector", sector })}
      />

      <View style={styles.resumen}>
        <Text style={styles.resumenTitulo}>Se va a guardar:</Text>
        <Text style={styles.resumenValor}>{describirUbicacion(elegida)}</Text>
      </View>

      <Boton
        titulo="Confirmar"
        variante="exito"
        deshabilitado={!elegida}
        onPress={() => {
          actualizarBorrador({ ubicacion: elegida });
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 20, backgroundColor: colores.fondo },
  label: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  nota: { color: colores.advertencia, marginTop: 6 },
  error: { color: colores.peligro, marginTop: 8 },
  resumen: { padding: 14, backgroundColor: colores.tarjeta, borderRadius: 10, marginVertical: 12 },
  resumenTitulo: { color: colores.suave },
  resumenValor: { fontSize: 18, fontWeight: "700", marginTop: 4 },
});
