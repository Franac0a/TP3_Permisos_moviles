import { Pressable, StyleSheet, Text, View } from "react-native";
import { colores } from "./tema";

type Props<T extends string> = {
  opciones: readonly T[];
  valor: T | null;
  onCambiar: (valor: T) => void;
};

/** Selector de una opción con "chips" (categoría, sector…). */
export function Chips<T extends string>({ opciones, valor, onCambiar }: Props<T>) {
  return (
    <View style={styles.fila}>
      {opciones.map((opcion) => {
        const activo = opcion === valor;
        return (
          <Pressable
            key={opcion}
            accessibilityRole="radio"
            accessibilityState={{ selected: activo }}
            onPress={() => onCambiar(opcion)}
            style={[styles.chip, activo && styles.activo]}
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>{opcion}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: "#fff",
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario },
  texto: { color: colores.texto, textTransform: "capitalize" },
  textoActivo: { color: "#fff", fontWeight: "600" },
});
