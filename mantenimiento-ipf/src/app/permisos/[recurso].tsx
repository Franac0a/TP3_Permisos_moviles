// Pantalla previa al diálogo del sistema (presentation: "modal").
// - Beneficio en una frase + un único botón "Continuar" + aclaración de Ajustes.
// - Sin "Ahora no" ni "Cerrar" (pauta 5.1.1(iv) de Apple).
// - Si el permiso está bloqueado, explica el camino y el botón es "Abrir Ajustes".
import { router, useLocalSearchParams, type Href } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AvisoBloqueado } from "@/components/AvisoBloqueado";
import { Boton } from "@/components/Boton";
import { Cargando } from "@/components/Cargando";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { INFO_RECURSO, esRecurso, type Recurso } from "@/lib/permisos";
import { setAvisarAlResolver } from "@/lib/reportes";

export default function PantallaPrevia() {
  const { recurso, siguiente } = useLocalSearchParams<{ recurso: string; siguiente?: string }>();

  if (!esRecurso(recurso)) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Permiso desconocido</Text>
        <Text style={styles.texto}>«{recurso}» no es un recurso que use la app.</Text>
        <Boton titulo="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  return <Contenido recurso={recurso} siguiente={siguiente} />;
}

function Contenido({ recurso, siguiente }: { recurso: Recurso; siguiente?: string }) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const info = INFO_RECURSO[recurso];

  const salir = (concedido: boolean) => {
    if (concedido && recurso === "notificaciones") setAvisarAlResolver(true);
    // Concedido → seguimos a la función. Denegado → volvemos a donde estaba,
    // que siempre tiene una alternativa. No se insiste.
    if (concedido && siguiente) router.replace(siguiente as Href);
    else router.back();
  };

  const continuar = async () => {
    const lectura = await pedir(); // acá aparece el diálogo del sistema
    salir(lectura.estado === "concedido");
  };

  if (estado === "cargando") return <Cargando />;

  if (estado === "bloqueado") {
    return (
      <View style={styles.contenedor}>
        <AvisoBloqueado recurso={recurso} onAbrirAjustes={abrirAjustes} />
      </View>
    );
  }

  if (estado === "concedido") {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.icono}>{info.icono}</Text>
        <Text style={styles.titulo}>{info.nombre}: permiso concedido</Text>
        <Boton titulo="Continuar" onPress={() => salir(true)} />
      </View>
    );
  }

  // preguntable
  return (
    <View style={styles.contenedor}>
      <Text style={styles.icono}>{info.icono}</Text>
      <Text style={styles.titulo}>{info.nombre}</Text>
      <Text style={styles.beneficio}>{info.beneficio}</Text>
      <Boton titulo="Continuar" onPress={continuar} estilo={styles.boton} />
      <Text style={styles.aclaracion}>
        Podés cambiar esta decisión cuando quieras desde los Ajustes del teléfono.{" "}
        {info.alternativa}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colores.fondo,
  },
  icono: { fontSize: 56, marginBottom: 12 },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  beneficio: { fontSize: 17, textAlign: "center", marginBottom: 24, color: colores.texto },
  texto: { fontSize: 16, textAlign: "center", marginBottom: 16 },
  boton: { alignSelf: "stretch" },
  aclaracion: { fontSize: 14, color: colores.suave, textAlign: "center", marginTop: 16 },
});
