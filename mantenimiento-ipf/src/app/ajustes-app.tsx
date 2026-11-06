// Interruptor "Avisarme cuando se resuelva mi reporte".
// El permiso de notificaciones se pide ÚNICAMENTE al activar este interruptor.
import { StyleSheet, Switch, Text, View } from "react-native";
import { Boton } from "@/components/Boton";
import { colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import { setAvisarAlResolver, useAppStore } from "@/lib/reportes";

export default function AjustesApp() {
  const { avisarAlResolver } = useAppStore();
  const { estado, abrirAjustes } = usePermiso("notificaciones");

  const cambiar = (activar: boolean) => {
    if (!activar) {
      setAvisarAlResolver(false);
      return;
    }
    // Concedido → se activa. Si no, pantalla previa; si allí se concede,
    // la pantalla previa activa el interruptor.
    if (usarFuncion("notificaciones", estado)) setAvisarAlResolver(true);
  };

  const activoSinPermiso = avisarAlResolver && estado !== "concedido" && estado !== "cargando";

  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <Text style={styles.texto}>Avisarme cuando se resuelva mi reporte</Text>
        <Switch
          value={avisarAlResolver && estado === "concedido"}
          onValueChange={cambiar}
          disabled={estado === "cargando"}
        />
      </View>
      <Text style={styles.nota}>
        Aunque no actives las notificaciones, todos los avisos aparecen en la pestaña Avisos.
      </Text>

      {(estado === "bloqueado" || activoSinPermiso) && (
        <View style={styles.caja}>
          <Text style={styles.cajaTexto}>
            Las notificaciones están desactivadas en el sistema. Si querés recibirlas, habilitalas
            desde Ajustes.
          </Text>
          <Boton titulo="Abrir Ajustes" variante="secundario" onPress={abrirAjustes} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: colores.fondo },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
  },
  texto: { fontSize: 16, flex: 1, marginRight: 12 },
  nota: { color: colores.suave, marginTop: 12 },
  caja: { marginTop: 20, padding: 16, backgroundColor: colores.tarjeta, borderRadius: 12 },
  cajaTexto: { marginBottom: 8 },
});
