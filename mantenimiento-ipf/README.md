# Mantenimiento IPF

App para que alumnos y docentes del Instituto Politécnico Formosa reporten desperfectos del edificio y reciban un aviso cuando se resuelven.

Trabajo Práctico N.º 3 — Permisos móviles (Taller Complementario React Native II). Expo SDK 57, TypeScript y Expo Router.

La app usa **cámara**, **ubicación en primer plano** y **notificaciones**. Las fotos se eligen con el **selector del sistema, sin pedir permiso de galería**.

## Cómo correrla

```bash
npm install
npx expo start            # Expo Go
npx expo run:android      # development build (Android)
npx expo prebuild --clean # ver los archivos nativos generados
```

> En Expo Go los diálogos muestran los textos genéricos de Expo Go. Los textos de propósito propios solo aparecen en una development build.

## Árbol de carpetas

```
src/
├── app/                         # Rutas (Expo Router)
│   ├── _layout.tsx              # Stack raíz (+ handler de notificaciones)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tabs: Reportes · Avisos · Permisos
│   │   ├── index.tsx            # /                    Lista de reportes (sin permisos)
│   │   ├── avisos.tsx           # /avisos              Bandeja de avisos (alternativa a notificaciones)
│   │   └── permisos.tsx         # /permisos            Panel de estado de cada permiso
│   ├── reporte/
│   │   ├── nuevo.tsx            # /reporte/nuevo       Formulario (no pide nada al abrir)
│   │   ├── escanear.tsx         # /reporte/escanear    QR del aula, 4 estados + código a mano
│   │   ├── foto.tsx             # /reporte/foto        Sacar foto (cámara) o elegir (selector sin permiso)
│   │   ├── ubicacion.tsx        # /reporte/ubicacion   Ubicación en primer plano o sector a mano
│   │   └── [id].tsx             # /reporte/[id]        Detalle + "Simular resolución"
│   ├── permisos/
│   │   └── [recurso].tsx        # /permisos/[recurso]  Pantalla previa (presentation: "modal")
│   └── ajustes-app.tsx          # /ajustes-app         Interruptor "Avisarme cuando se resuelva"
├── components/                  # Boton, Chips, Cargando, AvisoBloqueado, tema
├── hooks/
│   ├── usePermiso.ts            # Hook unificado: cargando | concedido | preguntable | bloqueado
│   └── useRevisarAlVolver.ts    # Re-consulta al volver de Ajustes (AppState)
└── lib/
    ├── permisos.ts              # Interpretar la respuesta de Expo, canal "reportes", textos, Ajustes
    ├── navegacion.ts            # usarFuncion(): pedir en contexto con pantalla previa
    ├── ubicacion.ts             # obtenerUbicacion() con soporte de ubicación aproximada
    ├── notificaciones.ts        # Simular resolución: notificación local a los 10 s + bandeja
    └── reportes.ts              # Store en memoria: reportes, borrador, avisos, preferencia
```

El grupo `(tabs)` no aparece en la URL, así que `(tabs)/permisos.tsx` es `/permisos` y `permisos/[recurso].tsx` es `/permisos/camara`, `/permisos/ubicacion` y `/permisos/notificaciones`.

## Bloque `plugins` de `app.json` (comentado)

JSON no admite comentarios; esta es una copia explicada del bloque real.

```jsonc
"plugins": [
  "expo-router",
  [
    "expo-camera",
    {
      // NSCameraUsageDescription (iOS). Molde "Usamos tu [dato] para [beneficio]".
      "cameraPermission": "Usamos tu cámara para leer el QR de la puerta del aula y sacar la foto del desperfecto.",
      // Solo leemos QR: no grabamos video con sonido.
      "microphonePermission": false, // sin NSMicrophoneUsageDescription en iOS
      "recordAudioAndroid": false    // sin RECORD_AUDIO en Android
    }
  ],
  [
    "expo-location",
    {
      // NSLocationWhenInUseUsageDescription. Solo primer plano.
      "locationWhenInUsePermission": "Usamos tu ubicación para marcar en el reporte dónde está el desperfecto dentro del Instituto.",
      "isAndroidBackgroundLocationEnabled": false, // no agrega ACCESS_BACKGROUND_LOCATION
      "isAndroidForegroundServiceEnabled": false   // no hay seguimiento continuo
    }
  ],
  [
    "expo-image-picker",
    {
      // Elegimos fotos con el selector del sistema (PHPicker / Photo Picker): no hace falta
      // NSPhotoLibraryUsageDescription ni READ_MEDIA_IMAGES.
      "photosPermission": false,
      // launchCameraAsync usa la misma cámara: mismo texto que expo-camera.
      "cameraPermission": "Usamos tu cámara para leer el QR de la puerta del aula y sacar la foto del desperfecto.",
      "microphonePermission": false
    }
  ],
  // Notificaciones locales. En iOS no llevan texto de propósito.
  "expo-notifications"
]
```

### `android.blockedPermissions` y por qué se bloquea cada uno

| Permiso bloqueado                | Quién lo agregaría                             | Por qué lo bloqueamos                                                                                     |
| :------------------------------- | :--------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `RECORD_AUDIO`                   | `expo-camera` (grabación de video)             | Solo leemos QR y sacamos fotos; nunca grabamos sonido. Lo bloqueamos además de poner `recordAudioAndroid: false`, por las dudas. |
| `SYSTEM_ALERT_WINDOW`            | `expo` / React Native (menú de desarrollo)     | La app no dibuja sobre otras apps. Es un permiso especial que alarma a la persona usuaria y a las tiendas. |
| `READ_MEDIA_IMAGES`              | librerías de galería                           | Usamos el selector del sistema. Google Play restringe este permiso a apps de galería.                     |
| `READ_MEDIA_VIDEO`               | librerías de galería                           | No trabajamos con videos.                                                                                  |
| `READ_MEDIA_VISUAL_USER_SELECTED` | librerías de galería (Android 14)             | Acceso parcial a la galería: no lo necesitamos, porque el selector ya entrega solo la foto elegida.       |
| `READ_EXTERNAL_STORAGE`          | `expo-image-picker`, `expo-file-system`        | Permiso viejo (Android ≤ 12) de lectura de almacenamiento. El selector no lo requiere.                     |
| `WRITE_EXTERNAL_STORAGE`         | `expo-image-picker`, `expo-file-system`        | No guardamos archivos en el almacenamiento compartido.                                                     |
| `ACCESS_BACKGROUND_LOCATION`     | `expo-location`                                | Solo usamos la ubicación mientras se carga el reporte (mínimo privilegio, y Google Play exige justificarlo). |

## Tabla de permisos

| Recurso        | Módulo                                                          | ¿Cuándo se pide?                                                                                                | Alternativa si se deniega                                                  |
| :------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| Cámara         | `expo-camera` (`useCameraPermissions`), `expo-image-picker` (`launchCameraAsync`) | Al tocar "Escanear QR del aula" en el formulario o "Sacar foto". Antes se muestra `/permisos/camara`.            | Escribir el código del aula a mano y elegir la foto de la galería.        |
| Ubicación      | `expo-location` (`useForegroundPermissions`), solo primer plano | Al tocar "Usar mi ubicación actual" en `/reporte/ubicacion`. Antes se muestra `/permisos/ubicacion`.             | Elegir el sector a mano (patio, estacionamiento, pasillo…).                |
| Notificaciones | `expo-notifications` (`requestPermissionsAsync`)                | Solo al activar el interruptor de `/ajustes-app`. En Android se crea el canal `reportes` antes de pedir.          | La bandeja `/avisos` dentro de la app (recibe todos los avisos igual).    |
| Fotos          | `expo-image-picker` (`launchImageLibraryAsync`)                 | **Nunca**: es el selector del sistema.                                                                           | —                                                                          |

### Cómo se cumplen los requisitos funcionales (G2)

1. **Hook unificado:** `usePermiso(recurso)` en [`src/hooks/usePermiso.ts`](src/hooks/usePermiso.ts) devuelve `estado` (`'cargando' | 'concedido' | 'preguntable' | 'bloqueado'`), `parcial`, `matiz`, `pedir()` y `abrirAjustes()`. Se actualiza al volver de Ajustes con `useRevisarAlVolver` (AppState) y al enfocar la pantalla.
2. **Escáner con cuatro estados:** [`reporte/escanear.tsx`](src/app/reporte/escanear.tsx) muestra el spinner, la cámara, la explicación con "Continuar" o el aviso de bloqueado con "Abrir Ajustes". Siempre se puede escribir el código a mano.
3. **Foto sin permiso de galería:** `launchImageLibraryAsync` y `photosPermission: false`. Además, `READ_MEDIA_*` está bloqueado.
4. **Ubicación respetuosa:** solo primer plano. Si la ubicación es aproximada (`android.accuracy === 'coarse'` o `ios.accuracy === 'reduced'`), el reporte muestra "Ubicación aproximada" sin coordenadas. Si se deniega, se elige el sector.
5. **Notificaciones en contexto:** se piden solo desde el interruptor. Primero se crea el canal `reportes`. "Simular resolución" programa una notificación local a los 10 s; si no hay permiso, el aviso aparece en `/avisos` (y aparece ahí también aunque haya permiso).
6. **Pantallas previas:** `/permisos/[recurso]` tiene un único botón "Continuar", sin "Ahora no" ni "Cerrar". Si el permiso está bloqueado, muestra el camino exacto en Ajustes según la plataforma y el botón "Abrir Ajustes".
7. **La app nunca se bloquea:** el reporte se puede guardar con el aula escrita a mano, una foto del selector (o sin foto) y el sector elegido a mano.
8. **No insistir:** la pantalla previa solo se abre desde `usarFuncion()` ([`src/lib/navegacion.ts`](src/lib/navegacion.ts)), que se llama en el `onPress` de cada función. Si la persona dice que no, se vuelve a la pantalla anterior y la previa no reaparece sola.
9. **Panel de permisos:** `/permisos` muestra cada recurso con su estado (incluido "parcial"), `Platform.OS` y `Platform.Version`, y el matiz (`android.accuracy`, `ios.accuracy`, `accessPrivileges`, `ios.status: provisional`).

## Auditoría del manifiesto (desafío opcional)

Resultado de `npx expo prebuild --platform android --clean` sobre `android/app/src/main/AndroidManifest.xml`, más los permisos que declaran las librerías y que se combinan al compilar:

| Permiso                           | Quién lo agrega                                 | ¿Queda?                       |
| :-------------------------------- | :---------------------------------------------- | :---------------------------- |
| `INTERNET`                        | Plantilla de Expo / `expo-file-system`          | Sí (instalación)              |
| `VIBRATE`                         | Plantilla de Expo                               | Sí (instalación)              |
| `CAMERA`                          | `expo-camera`, `expo-image-picker`              | Sí (tiempo de ejecución)      |
| `ACCESS_COARSE_LOCATION`          | `expo-location`                                 | Sí (tiempo de ejecución)      |
| `ACCESS_FINE_LOCATION`            | `expo-location`                                 | Sí (tiempo de ejecución)      |
| `POST_NOTIFICATIONS`              | `expo-notifications`                            | Sí (tiempo de ejecución, Android 13+) |
| `RECEIVE_BOOT_COMPLETED`          | `expo-notifications`                            | Sí (instalación: reprograma notificaciones al reiniciar) |
| `ACCESS_BACKGROUND_LOCATION`      | `expo-location`                                 | **Quitado** (`tools:node="remove"`) |
| `READ_EXTERNAL_STORAGE`           | `expo-image-picker`, `expo-file-system`         | **Quitado**                   |
| `WRITE_EXTERNAL_STORAGE`          | `expo-image-picker`, `expo-file-system`         | **Quitado**                   |
| `READ_MEDIA_IMAGES`               | —                                               | **Quitado**                   |
| `READ_MEDIA_VIDEO`                | —                                               | **Quitado**                   |
| `READ_MEDIA_VISUAL_USER_SELECTED` | —                                               | **Quitado**                   |
| `RECORD_AUDIO`                    | `expo-camera`                                   | **Quitado**                   |
| `SYSTEM_ALERT_WINDOW`             | `expo` (manifiesto de debug / menú de desarrollo) | **Quitado**                 |

## Capturas

> Agregar las capturas en `docs/capturas/` y enlazarlas acá.

| Qué                                                         | Captura                                                        |
| :---------------------------------------------------------- | :------------------------------------------------------------- |
| Escáner: cargando                                           | ![](docs/capturas/escaner-cargando.png)                        |
| Escáner: cámara (concedido)                                 | ![](docs/capturas/escaner-concedido.png)                       |
| Escáner: explicación con "Continuar" (preguntable)          | ![](docs/capturas/escaner-preguntable.png)                     |
| Escáner: bloqueado con "Abrir Ajustes"                      | ![](docs/capturas/escaner-bloqueado.png)                       |
| Ubicación concedida                                         | ![](docs/capturas/ubicacion-concedida.png)                     |
| Ubicación denegada (sector a mano)                          | ![](docs/capturas/ubicacion-denegada.png)                      |
| Foto desde el selector del sistema                          | ![](docs/capturas/foto-selector.png)                           |
| Notificación recibida                                       | ![](docs/capturas/notificacion.png)                            |
| Panel de permisos antes de ir a Ajustes                     | ![](docs/capturas/panel-antes.png)                             |
| Panel de permisos después de volver de Ajustes              | ![](docs/capturas/panel-despues.png)                           |
| Diálogo del sistema con el texto de propósito (dev build)   | ![](docs/capturas/dialogo-dev-build.png)                       |

## Guía rápida para la defensa oral

1. **"Continuar" o "Abrir Ajustes":** lo decide `interpretar()` en [`src/lib/permisos.ts`](src/lib/permisos.ts) con el campo **`canAskAgain`**: si es `true`, el estado es `preguntable` ("Continuar"); si es `false`, es `bloqueado` ("Abrir Ajustes"). La pantalla está en [`permisos/[recurso].tsx`](src/app/permisos/[recurso].tsx).
2. **Revocar la cámara con la app abierta:** Android **mata el proceso** de la app. Al volver, la app se reinicia y el hook consulta de nuevo. Si el proceso sigue vivo (por ejemplo cuando se concede), `useRevisarAlVolver` detecta el paso `background → active` y vuelve a consultar.
3. **Elegir una foto sin permiso:** el selector del sistema corre fuera de la app y solo le entrega la foto elegida. Para sacar una foto la app usa la cámara directamente, y eso sí requiere permiso.
4. **Ubicación aproximada o denegada:** si es aproximada, se guarda pero se muestra "Ubicación aproximada", sin coordenadas. Si se deniega, se elige el sector a mano y el reporte se guarda igual.
5. **Expo Go:** es una app ya compilada con su propio `Info.plist` y `AndroidManifest.xml`. Nuestros textos se aplican recién al compilar nuestra app (development build).
6. **Nota de voz con OTA:** no alcanza. Hace falta agregar `expo-audio` (código nativo), `NSMicrophoneUsageDescription` y sacar `RECORD_AUDIO` de `blockedPermissions`. Son cambios nativos que requieren una build nueva y pasar por las tiendas.
