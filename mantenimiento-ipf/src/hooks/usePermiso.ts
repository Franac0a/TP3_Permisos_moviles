import { useState, useEffect, useRef, useCallback } from "react";
import { AppState, Linking } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";

type EstadoPermiso = "cargando" | "concedido" | "preguntable" | "bloqueado";

// El TP exige explícitamente que el hook reciba el recurso como parámetro
export function usePermiso(recurso: "camara" | "ubicacion") {
  // Obtenemos los tres elementos que devuelve Expo: [estado, funciónParaPedir, funciónParaConsultar]
  const [permisoCamara, pedirCamara, consultarCamara] = useCameraPermissions();
  const [permisoUbic, pedirUbic, consultarUbic] = useForegroundPermissions();

  const solicitar = recurso === "camara" ? pedirCamara : pedirUbic;
  const consultar = recurso === "camara" ? consultarCamara : consultarUbic;

  const [estado, setEstado] = useState<EstadoPermiso>("cargando");
  const [parcial, setParcial] = useState(false);
  const appStateAnterior = useRef(AppState.currentState);

  const evaluarEstado = useCallback(async () => {
    if (!consultar) return;
    const res = await consultar();
    if (!res) return;

    // Le decimos a TypeScript que trate a 'res' como 'any' para evitar el error de propiedades
    const respuestaFlexible = res as any;

    // Detectar permisos parciales requeridos por el TP
    const esParcial =
      respuestaFlexible.accessPrivileges === "limited" ||
      respuestaFlexible.ios?.accuracy === "coarse" ||
      respuestaFlexible.android?.accuracy === "coarse";

    setParcial(esParcial);

    if (res.granted) {
      setEstado("concedido");
    } else if (res.canAskAgain) {
      setEstado("preguntable");
    } else {
      setEstado("bloqueado");
    }
  }, [consultar]);
  useEffect(() => {
    evaluarEstado();

    // Requisito del TP: actualizarse automáticamente al volver de Ajustes
    const subscripcion = AppState.addEventListener("change", (estadoActual) => {
      const estabaEnSegundoPlano =
        appStateAnterior.current.match(/inactive|background/);
      if (estabaEnSegundoPlano && estadoActual === "active") {
        evaluarEstado();
      }
      appStateAnterior.current = estadoActual;
    });

    return () => subscripcion.remove();
  }, [evaluarEstado]);

  const pedir = async () => {
    if (solicitar) {
      await solicitar();
      evaluarEstado();
    }
  };

  const abrirAjustes = () => {
    Linking.openSettings();
  };

  return { estado, parcial, pedir, abrirAjustes };
}
