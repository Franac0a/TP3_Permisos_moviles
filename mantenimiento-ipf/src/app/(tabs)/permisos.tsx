// Panel de permisos: estado de cada recurso, plataforma y matiz.
// Se actualiza al volver de Ajustes (AppState dentro de usePermiso) y al
// enfocar la pestaña.
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Boton } from "@/components/Boton";
import { COLOR_ESTADO, colores } from "@/components/tema";
import { usePermiso } from "@/hooks/usePermiso";
import { usarFuncion } from "@/lib/navegacion";
import { INFO_RECURSO, RECURSOS, abrirAjustes, type Recurso } from "@/lib/permisos";

export default function PanelPermisos() {
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.plataforma}>
        Plataforma: {Platform.OS} {String(Platform.Version)}
      </Text>
      {RECURSOS.map((r) => (
        <TarjetaPermiso key={r} recurso={r} />
      ))}
      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>🖼️ Fotos de la galería</Text>
        <Text style={[styles.estado, { color: colores.exito }]}>no requiere permiso</Text>
        <Text style={styles.matiz}>
          La app usa el selector del sistema (launchImageLibraryAsync): la persona elige una foto
          y la app nunca ve el resto de la galería.
        </Text>
      </View>
      <Boton titulo="⚙️ Abrir Ajustes del sistema" onPress={() => abrirAjustes()} />
      <Text style={styles.matiz}>
        Abre los permisos de la app en el teléfono (en Expo Go, los de Expo Go). Al volver, el
        panel se actualiza solo.
      </Text>
    </ScrollView>
  );
}

function TarjetaPermiso({ recurso }: { recurso: Recurso }) {
  const { estado, parcial, matiz, abrirAjustes } = usePermiso(recurso);
  const info = INFO_RECURSO[recurso];
  const etiqueta = estado === "concedido" && parcial ? "parcial" : estado;

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.nombre}>
        {info.icono} {info.nombre}
      </Text>
      <Text style={[styles.estado, { color: COLOR_ESTADO[estado] }]}>{etiqueta}</Text>
      {matiz && <Text style={styles.matiz}>{matiz}</Text>}

      {estado === "preguntable" && (
        <Boton titulo="Pedir permiso" onPress={() => usarFuncion(recurso, estado)} />
      )}
      {estado === "bloqueado" && <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />}
      {estado === "concedido" && (
        <Boton
          titulo={parcial ? "Abrir Ajustes (dar acceso completo)" : "Cambiar en Ajustes"}
          variante="secundario"
          onPress={abrirAjustes}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 16, backgroundColor: colores.fondo },
  plataforma: { color: colores.suave, marginBottom: 12 },
  tarjeta: { padding: 16, backgroundColor: colores.tarjeta, borderRadius: 12, marginBottom: 12 },
  nombre: { fontSize: 18, fontWeight: "600" },
  estado: { fontSize: 16, fontWeight: "700", textTransform: "uppercase", marginVertical: 6 },
  matiz: { fontSize: 13, color: colores.suave, marginBottom: 6 },
});
