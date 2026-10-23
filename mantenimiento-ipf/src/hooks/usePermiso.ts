import { useState, useEffect, useRef, useCallback } from "react";
import { AppState, Linking, Platform } from "react-native";

type EstadoPermiso = "cargando" | "concedido" | "preguntable" | "bloqueado";

interface PropsHook {
  consultar: () => Promise<any>;
  solicitar: () => Promise<any>;
}

export function usePermiso({ consultar, solicitar }: PropsHook) {
  const [estado, setEstado] = useState<EstadoPermiso>("cargando");
  const [parcial, setParcial] = useState(false);
  const appStateAnterior = useRef(AppState.currentState);

  const revisarPermiso = useCallback(async () => {
    try {
      const respuesta = await consultar();

      // Detectar permisos parciales (ubicación aproximada en Android/iOS o fotos limitadas en iOS)
      const esParcial =
        respuesta.accessPrivileges === "limited" ||
        respuesta.ios?.accuracy === "coarse" ||
        respuesta.android?.accuracy === "coarse";

      setParcial(esParcial);

      if (respuesta.granted) {
        setEstado("concedido");
      } else if (respuesta.canAskAgain) {
        setEstado("preguntable");
      } else {
        setEstado("bloqueado");
      }
    } catch (error) {
      console.error("Error al consultar permiso:", error);
      setEstado("bloqueado");
    }
  }, [consultar]);

  useEffect(() => {
    // Revisar apenas carga la pantalla
    revisarPermiso();

    // Suscribirse a los cambios de estado de la app (para detectar cuando vuelve de Ajustes)
    const subscripcion = AppState.addEventListener("change", (estadoActual) => {
      const estabaEnSegundoPlano =
        appStateAnterior.current.match(/inactive|background/);
      if (estabaEnSegundoPlano && estadoActual === "active") {
        revisarPermiso();
      }
      appStateAnterior.current = estadoActual;
    });

    return () => {
      subscripcion.remove();
    };
  }, [revisarPermiso]);

  const pedir = async () => {
    const respuesta = await solicitar();
    revisarPermiso(); // Actualizar el estado interno luego de pedir
    return respuesta;
  };

  const abrirAjustes = () => {
    Linking.openSettings();
  };

  return { estado, parcial, pedir, abrirAjustes };
}
