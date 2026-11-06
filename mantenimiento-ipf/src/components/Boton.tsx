import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { colores } from "./tema";

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "exito" | "peligro";
  deshabilitado?: boolean;
  estilo?: ViewStyle;
};

export function Boton({ titulo, onPress, variante = "primario", deshabilitado, estilo }: Props) {
  const fondo = {
    primario: colores.primario,
    secundario: "transparent",
    exito: colores.exito,
    peligro: colores.peligro,
  }[variante];
  const esSecundario = variante === "secundario";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: fondo, opacity: deshabilitado ? 0.4 : pressed ? 0.7 : 1 },
        esSecundario && styles.secundario,
        estilo,
      ]}
    >
      <Text style={[styles.texto, esSecundario && { color: colores.primario }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
  },
  secundario: { borderWidth: 1, borderColor: colores.primario },
  texto: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
