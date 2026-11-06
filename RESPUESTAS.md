# Parte A. ¿Qué es un permiso y por qué existe?

## A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**
Un permiso es un mecanismo de seguridad que restringe el acceso a funciones sensibles o datos privados del dispositivo.

- La app: Es la interesada que solicita el acceso cuando necesita usar un recurso (por ejemplo, la cámara).
- El sistema operativo (Android/iOS): Actúa como intermediario de seguridad y es quien dibuja el cuadro de diálogo para preguntar.
- La persona usuaria: Es la dueña del teléfono y quien tiene la decisión final para otorgar o denegar el permiso.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**
La "caja de arena" (sandbox) es un entorno aislado y seguro donde se ejecuta cada aplicación para que no interfiera con el resto del teléfono. Su relación con los permisos es que una app está "encerrada" y no puede salir de su caja para acceder a sensores o datos externos sin pedir autorización. Sin ningún permiso, una app solo puede ejecutar su código, mostrar su interfaz gráfica y trabajar con sus propios archivos internos.

**c) Nombrá las cuatro razones por las que existen los permisos y dá un ejemplo concreto de cada una.**

1. Privacidad: Proteger datos personales (ejemplo: evitar que una app lea los contactos).
2. Seguridad: Prevenir acciones malintencionadas (ejemplo: bloquear el envío oculto de mensajes SMS).
3. Recursos y costos: Controlar el consumo del dispositivo (ejemplo: usar el GPS en segundo plano gasta mucha batería).
4. Control y transparencia: Darle la decisión final al usuario (ejemplo: que la persona sepa exactamente cuándo se está activando su micrófono).

**d) En la analogía del portero del edificio, ¿quién es la visita, quién el portero y quién el dueño del departamento? ¿Qué significa que "el portero se acuerda de la respuesta"?**

- La visita: La aplicación.
- El portero: El sistema operativo.
- El dueño del departamento: La persona usuaria.
  Que "el portero se acuerda de la respuesta" significa que el sistema operativo guarda la decisión del usuario (ya sea permitir o bloquear) para no volver a mostrar el diálogo y molestar con la misma pregunta la próxima vez que la app solicite el recurso.

## A2. Declarar y solicitar

| Característica                | Declarar (al compilar)                                                                                                   | Solicitar (al ejecutar)                                                                                                     |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **¿Qué se hace?**             | Se avisa a las tiendas de apps y al sistema operativo qué permisos podría llegar a usar la app.                          | Se le muestra un cuadro de diálogo a la persona usuaria para pedirle autorización en tiempo real.                           |
| **¿Dónde / cómo en Android?** | En el archivo `AndroidManifest.xml` usando la etiqueta `<uses-permission>`.                                              | Mediante código, llamando a funciones nativas del sistema cuando se necesita el recurso.                                    |
| **¿Dónde / cómo en iOS?**     | En el archivo `Info.plist` agregando claves con textos descriptivos (UsageDescription).                                  | Mediante código, llamando a las APIs de Apple.                                                                              |
| **¿Dónde / cómo en Expo?**    | En el archivo `app.json` (o `app.config.ts`), configurando el bloque de `plugins` de cada módulo.                        | En el código (ej. React/TypeScript) usando funciones como `request...PermissionsAsync()` o hooks.                           |
| **¿Qué pasa si se omite?**    | La app se cierra de golpe (crashea) al intentar usar el recurso o es rechazada por las tiendas (App Store / Play Store). | La app no obtiene los datos (ej. la cámara se ve negra), pero el sistema asume que el acceso está denegado silenciosamente. |

## A3. Verdadero o falso

**a) El diálogo de permiso lo dibuja tu app con componentes de React Native.**
**Falso.** El diálogo lo dibuja exclusivamente el sistema operativo (Android o iOS) por razones de seguridad. La app no tiene control sobre el diseño de ese cuadro.

**b) En Expo, la fuente de verdad de los permisos es app.json (o app.config.ts), no el AndroidManifest.xml.**
**Verdadero.**

**c) Agregar un permiso nuevo en el Info.plist se puede publicar con una actualización OTA.**
**Falso.** Modificar archivos nativos como `Info.plist` (iOS) o `AndroidManifest.xml` (Android) requiere compilar y subir una nueva versión completa a las tiendas. Las actualizaciones OTA (Over-The-Air) solo sirven para cambios en el código JavaScript/TypeScript y en los assets.

**d) Si tu código pide un permiso que no está en el manifiesto, Android igual muestra el diálogo.**
**Falso.** Si el permiso no fue declarado previamente en el manifiesto al compilar, el sistema operativo asume que está denegado automáticamente o directamente hace que la aplicación se cierre de golpe (crash) al intentarlo.

**e) El paquete expo-permissions es la forma recomendada de pedir permisos en SDK 57.**
**Falso.** El paquete `expo-permissions` está obsoleto (deprecated). La forma recomendada es usar los métodos y hooks específicos de cada módulo, como `expo-location` o `expo-camera`.

**f) En iOS, las notificaciones no llevan texto de propósito en el Info.plist.**
**Verdadero.**

**g) Con acceso limitado a fotos, status vale 'granted' y el matiz está en accessPrivileges.**
**Verdadero.**

**h) Desinstalar y reinstalar la app es la forma confiable de volver a "sin decidir" en las dos plataformas.**
**Falso.** Reinstalar suele borrar las decisiones, pero no es confiable ni práctico: en Android la copia de seguridad automática puede restaurar datos y estados de la app, y en iOS algunas decisiones pueden sobrevivir a la reinstalación. Además, obliga a perder todos los datos de la app. La forma confiable es usar las herramientas de desarrollo: `adb shell pm clear <paquete>` (o `pm reset-permissions`) en Android y `xcrun simctl privacy booted reset <servicio> <bundleId>` en el simulador de iOS (ver D6 d).

## A4. Los estados de un permiso

**a) Dibujá (o describí) el diagrama de estados de un permiso en Android y en iOS. ¿Cuál es la diferencia central entre las dos plataformas?**

- **Diagrama descriptivo:**
  - Inicio: **Sin decidir** (undetermined).
  - Acción: La app pide el permiso y se muestra el diálogo.
  - Camino A: El usuario acepta → **Concedido** (granted).
  - Camino B: El usuario rechaza → **Denegado** (denied).
- **Diferencia central:** La diferencia principal radica en las oportunidades para volver a preguntar. En **Android**, un primer rechazo deja el permiso en un estado "Denegado pero preguntable"; recién tras múltiples rechazos (dos en Android 11+) pasa a estar bloqueado. En **iOS**, el primer rechazo es definitivo y bloquea el permiso automáticamente; el diálogo no vuelve a aparecer nunca más y la única salida es ir manualmente a los Ajustes del sistema.

**b) Completá qué devuelve Expo en cada estado:**

| Estado                             | `status`         | `canAskAgain` | ¿Puede aparecer el diálogo? |
| :--------------------------------- | :--------------- | :------------ | :-------------------------- |
| Sin decidir                        | `'undetermined'` | `true`        | Sí                          |
| Concedido                          | `'granted'`      | `true`        | No (ya está concedido)      |
| Denegado (se puede volver a pedir) | `'denied'`       | `true`        | Sí (en Android)             |
| Bloqueado                          | `'denied'`       | `false`       | No (hay que abrir Ajustes)  |

# Parte B. Android: tipos de permisos y manifiesto

## B1. Clasificá los permisos

| Permiso                   | Tipo                               | ¿Cómo se obtiene?                                                                   |
| :------------------------ | :--------------------------------- | :---------------------------------------------------------------------------------- |
| `INTERNET`                | De instalación (Normal)            | Se concede automáticamente al instalar la app.                                      |
| `CAMERA`                  | De tiempo de ejecución (Peligroso) | Se solicita a la persona usuaria mediante un cuadro de diálogo mientras usa la app. |
| `VIBRATE`                 | De instalación (Normal)            | Se concede automáticamente al instalar la app.                                      |
| `SYSTEM_ALERT_WINDOW`     | Especial                           | Se redirige a la persona a los Ajustes del sistema ("Mostrar sobre otras apps").    |
| `POST_NOTIFICATIONS`      | De tiempo de ejecución (Peligroso) | Se solicita a la persona usuaria mediante un cuadro de diálogo (desde Android 13).  |
| `ACCESS_NETWORK_STATE`    | De instalación (Normal)            | Se concede automáticamente al instalar la app.                                      |
| `READ_CONTACTS`           | De tiempo de ejecución (Peligroso) | Se solicita a la persona usuaria mediante un cuadro de diálogo mientras usa la app. |
| `SCHEDULE_EXACT_ALARM`    | Especial                           | Se redirige a la persona a los Ajustes del sistema ("Alarmas y recordatorios").     |
| `RECORD_AUDIO`            | De tiempo de ejecución (Peligroso) | Se solicita a la persona usuaria mediante un cuadro de diálogo mientras usa la app. |
| `MANAGE_EXTERNAL_STORAGE` | Especial                           | Se redirige a la persona a los Ajustes del sistema ("Acceso a todos los archivos"). |

## B2. Grupos y nombres

**a) ¿Qué es un grupo de permisos? Si la app pide ACCESS_FINE_LOCATION Y ACCESS_COARSE_LOCATION juntos, ¿cuántos diálogos ve la persona?**
Un grupo de permisos reúne permisos que están relacionados con una misma función del teléfono (por ejemplo, la ubicación precisa y la aproximada pertenecen al mismo grupo llamado "Ubicación"). Si la aplicación pide ambos permisos al mismo tiempo, la persona usuaria ve un solo cuadro de diálogo, no dos.

**b) ¿Qué prefijo lleva el nombre completo de un permiso? Escribí el nombre completo del permiso de cámara.**
El prefijo que usa Android es `android.permission.`. Por lo tanto, el nombre completo del permiso de cámara es `android.permission.CAMERA`.

**c) ¿Qué son los permisos de firma (signature)? ¿Por qué no se usan en apps comunes?**
Los permisos de firma son un tipo de permiso muy estricto que el sistema aprueba de forma automática y silenciosa, pero solo si la aplicación que lo pide fue creada por el mismo desarrollador (o empresa) que creó la función original. No se usan en las aplicaciones comunes que descargamos de la tienda porque están pensados para que aplicaciones de un mismo fabricante se comuniquen entre sí, o para aplicaciones críticas del sistema operativo del celular.

## B3. Leé el manifiesto

**a) ¿Qué permisos se conceden solos al instalar y cuáles hay que pedir además en tiempo de ejecución?**

- **Solo al instalar (Normal):** `INTERNET`.
- **En tiempo de ejecución (Peligrosos):** `CAMERA`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS` y `READ_EXTERNAL_STORAGE`.

**b) ¿Qué significa android:maxSdkVersion="32"? ¿Qué permisos reemplazan a READ_EXTERNAL_STORAGE desde Android 13?**
Significa que la aplicación solo va a solicitar ese permiso en dispositivos que tengan hasta la versión de Android 12L (cuya API es la 32). A partir de Android 13, por razones de privacidad, `READ_EXTERNAL_STORAGE` fue reemplazado por permisos más específicos: `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y `READ_MEDIA_AUDIO`.

**c) ¿Qué hace tools:node="remove"? Escribí el fragmento de app.json que lo genera.**
Le ordena al compilador de Android que elimine ese permiso del código final de forma forzada, incluso si alguna librería de terceros intentaba agregarlo por defecto (en el ejemplo, elimina el acceso al micrófono).
En Expo, esto se genera configurando la lista de permisos bloqueados en el `app.json`:

```json
"android": {
  "blockedPermissions": ["android.permission.RECORD_AUDIO"]
}
```

d) Necesitás agregar SCHEDULE_EXACT_ALARM, que ninguna librería declara. ¿En qué propiedad de app.json va?
Se debe agregar en el arreglo permissions que está dentro de la propiedad android en el app.json:

"android": {
"permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
}

e) ¿Por qué en Expo no conviene editar este archivo a mano? ¿Funciona blockedPermissions en Expo Go?
No conviene editar el archivo AndroidManifest.xml a mano porque Expo lo genera automáticamente cada vez que se compila la app (con npx expo prebuild). Cualquier cambio manual se va a sobrescribir y perder. Toda configuración debe hacerse siempre desde el archivo app.json.
La propiedad blockedPermissions no funciona en la aplicación de Expo Go, ya que Expo Go es una app pre-compilada que ya trae todos los permisos incluidos para facilitar las pruebas. Para probar bloqueos reales de permisos se necesita crear una Development Build (compilación de desarrollo propia).

## B4. Así pregunta Android

**a) ¿Se puede poner texto propio dentro del diálogo de Android? Entonces, ¿dónde tenés que explicar para qué usás el permiso?**
No, no se puede modificar ni agregar texto propio dentro del diálogo nativo del sistema Android. Por lo tanto, tenés que explicar el propósito de usar ese permiso en una pantalla o modal previo (creado por vos en tu app) justo antes de lanzar la solicitud formal al sistema operativo.

**b) ¿Qué diferencia hay entre "Mientras la app está en uso" y "Solo esta vez"? ¿Para qué permisos existe esta última opción?**

- **"Mientras la app está en uso":** Concede el permiso de forma continua siempre que la aplicación esté abierta (en primer plano).
- **"Solo esta vez":** Concede el permiso de forma temporal y únicamente para esa sesión. Si la app se cierra o pasa mucho tiempo en segundo plano, el permiso se revoca y hay que volver a preguntar.
  Esta opción temporal existe desde Android 11 para los permisos más sensibles: Ubicación, Cámara y Micrófono.

**c) En Android 11+, ¿qué pasa si la persona toca "No permitir" dos veces? ¿Qué valor toma canAskAgain?**
Si la persona rechaza el permiso dos veces, el sistema interpreta esa acción como un rechazo definitivo ("No volver a preguntar"). En este punto, el permiso queda bloqueado y el valor de `canAskAgain` pasa a ser `false`.

**d) La ubicación aproximada tiene una precisión de unos 3 km². Dá un ejemplo de función que anda bien con ella y otro de una que no.**

- **Anda bien:** Mostrar el pronóstico del clima de la ciudad o buscar noticias de la región.
- **No anda bien:** Navegación GPS paso a paso (tipo Google Maps o Uber) o registrar la ruta exacta de una carrera deportiva.

**e) Si la persona revoca un permiso desde Ajustes mientras la app está abierta, ¿qué hace Android con el proceso de la app?**
Por razones de seguridad y para evitar inconsistencias con los datos o funciones de la aplicación, Android "mata" (cierra) el proceso de la app inmediatamente. Al intentar volver a la aplicación, esta se reinicia desde cero.

## B5. Android, versión por versión

| Cambio                                                               | Versión (API)        | Qué implica para el código                                                                                                                     |
| :------------------------------------------------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nacen los permisos en tiempo de ejecución**                        | Android 6.0 (API 23) | Hay que solicitar los permisos peligrosos con cuadros de diálogo al ejecutar la app, ya no alcanza con declararlos al compilar.                |
| **La ubicación en segundo plano pasa a ser un permiso aparte**       | Android 10 (API 29)  | Se debe pedir primero el permiso en primer plano y, recién si es concedido, pedir por separado el de segundo plano.                            |
| **Dos rechazos equivalen a "no volver a preguntar"**                 | Android 11 (API 30)  | Si la persona deniega dos veces, el permiso se bloquea automáticamente y el código debe guiar a la persona a los Ajustes del sistema.          |
| **Ubicación precisa o aproximada**                                   | Android 12 (API 31)  | El código debe estar preparado para recibir y funcionar con una ubicación aproximada en lugar de exigir siempre la exacta.                     |
| **Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`)** | Android 13 (API 33)  | Ya no se pueden enviar notificaciones automáticamente al instalar; hay que pedir un permiso explícito a través de un diálogo.                  |
| **Acceso parcial a fotos y videos ("Seleccionar fotos")**            | Android 14 (API 34)  | El permiso puede aparecer como "concedido", pero de forma limitada. El código debe manejar privilegios parciales de acceso a la galería.       |
| **Permiso de red local (`ACCESS_LOCAL_NETWORK`)**                    | Android 17 (API 37)  | Conectarse a dispositivos de la red local (impresoras, Chromecast, servidores en la LAN) pasa a necesitar un permiso de tiempo de ejecución. Si la app apunta a API 37 y no lo pide, esas conexiones fallan. |

**¿Qué es el targetSdkVersion? ¿A qué API apunta Expo SDK 57 y qué exige Google Play desde el 31 de agosto de 2026?**
El `targetSdkVersion` es la versión del sistema de Android (API) para la cual la aplicación fue diseñada y probada. Le indica al teléfono bajo qué reglas modernas de seguridad y permisos debe hacer funcionar la app.
Expo SDK 57 usa por defecto `targetSdkVersion` 36 (Android 16) y `compileSdkVersion` 36. Desde el 31 de agosto de 2026, Google Play exige que las apps nuevas y las actualizaciones apunten a API 36 (Android 16) o superior; si no, no se pueden publicar. Al subir el target, la app queda sujeta a todas las reglas de permisos de esa versión.

# Parte C. iOS: textos de propósito y acceso parcial

## C1. Claves del Info.plist

| Recurso                      | Clave en Info.plist                                                    |
| :--------------------------- | :--------------------------------------------------------------------- |
| **Cámara**                   | `NSCameraUsageDescription`                                             |
| **Micrófono**                | `NSMicrophoneUsageDescription`                                         |
| **Ubicación en uso**         | `NSLocationWhenInUseUsageDescription`                                  |
| **Ubicación siempre**        | `NSLocationAlwaysAndWhenInUseUsageDescription`                         |
| **Fotos (leer)**             | `NSPhotoLibraryUsageDescription`                                       |
| **Fotos (solo guardar)**     | `NSPhotoLibraryAddUsageDescription`                                    |
| **Contactos**                | `NSContactsUsageDescription`                                           |
| **Face ID**                  | `NSFaceIDUsageDescription`                                             |
| **Rastreo entre apps (ATT)** | `NSUserTrackingUsageDescription`                                       |
| **Notificaciones**           | No lleva clave en el Info.plist. Se configura directamente por código. |

## C2. Sin texto, no hay permiso

**a) ¿Qué pasa si falta el texto de propósito y la app intenta usar la cámara? ¿Y al subir la build a App Store Connect? Mencioná el código de error.**
Si falta el texto de propósito en el `Info.plist`, la aplicación se cierra inesperadamente (crashea) en el momento en que intenta abrir la cámara. Si intentás subir esa compilación a App Store Connect, los servidores de Apple la rechazan automáticamente de forma inmediata, generalmente enviando un correo con el código de error `ITMS-90683: Missing Purpose String in Info.plist`.

**b) ¿Cuántas veces muestra iOS el diálogo de un permiso? Si la persona dice que no, ¿qué le queda a la app?**
iOS muestra el diálogo nativo del sistema **exactamente una sola vez**. Si la persona elige "No permitir", el permiso queda bloqueado permanentemente. La única alternativa que le queda a la app es mostrar una pantalla propia invitando a la persona a salir de la aplicación y abrir la app de Ajustes (Configuración) del iPhone para habilitarlo manualmente.

**c) En el diálogo de iOS, ¿qué parte arma el sistema y cuál escribís vos? En Expo, ¿dónde se configura ese texto?**

- **El sistema arma:** El título principal (ej: _"La app quiere acceder a tu cámara"_) y los botones de acción ("OK", "No permitir").
- **Vos escribís:** El texto en letra más chica que va debajo del título, explicando el motivo por el cual solicitás el acceso.
- **En Expo:** Ese texto se configura dentro del archivo `app.json`, específicamente en la sección de `plugins` del módulo correspondiente (por ejemplo, en el plugin de `expo-camera`).

**d) Una librería usa una API protegida que tu app nunca llama y Apple rechaza la build. ¿Por qué pasa y cómo se resuelve?**
Pasa porque los sistemas de revisión de Apple realizan un "análisis estático" de todo el código de la aplicación. Si detectan referencias a APIs protegidas en el código compilado (incluso si tu código JavaScript/TypeScript nunca las ejecuta), exigen que declares el propósito. Se resuelve configurando correctamente los plugins en el `app.json` para excluir explícitamente esos módulos nativos que no se usan, o removiendo la librería si no es estrictamente necesaria.

## C3. Probador de textos de propósito

| Texto propuesto                                                           | ¿Aprobado? | Versión mejorada                                                    |
| :------------------------------------------------------------------------ | :--------- | :------------------------------------------------------------------ |
| "Necesitamos tu ubicación."                                               | No         | Usamos tu ubicación para mostrarte en el mapa dónde está tu pedido. |
| "Para mejorar tu experiencia."                                            | No         | Usamos tu ubicación para ofrecerte locales adheridos cerca tuyo.    |
| "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." | Sí         | (No necesita mejora, cumple con la pauta 5.1.1 de Apple).           |
| "La app no funciona sin ubicación."                                       | No         | Usamos tu ubicación para calcular el costo de envío a tu domicilio. |
| "Ubicación requerida por el sistema."                                     | No         | Usamos tu ubicación para guiarte paso a paso hasta el destino.      |

## C4. Acceso parcial y gradual

| Caso                                                  | iOS      | En Expo                                                                                                              |
| :---------------------------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| Fotos limitadas ("Seleccionar fotos")                 | iOS 14   | La respuesta del permiso devuelve `accessPrivileges: 'limited'`.                                                     |
| Ubicación aproximada (interruptor "Precisa")          | iOS 14   | La respuesta del permiso incluye `ios: { accuracy: 'coarse' }`.                                                      |
| "Permitir una vez" (ubicación)                        | iOS 13   | Si se cierra la app, el permiso se revoca y el `status` vuelve a ser `'undetermined'`.                               |
| Ubicación escalonada: de "al usar la app" a "Siempre" | iOS 13   | Se pide primero `requestForegroundPermissionsAsync()`, y si se concede, luego `requestBackgroundPermissionsAsync()`. |
| Notificaciones provisionales                          | iOS 12   | Se pide pasando el parámetro `{ allowProvisional: true }` a la función de notificación.                              |
| Rastreo entre apps (App Tracking Transparency)        | iOS 14.5 | Se usa el módulo separado `expo-tracking-transparency`.                                                              |

**¿Qué versión mínima de iOS requiere Expo SDK 57? ¿Qué consecuencia práctica tiene eso sobre la tabla anterior?**
Expo SDK 57 requiere como mínimo iOS 15. La consecuencia práctica es que todas las funciones de la tabla anterior (que salieron en iOS 12, 13 y 14) ya vienen incluidas de forma nativa en todos los teléfonos compatibles con nuestra app. Por lo tanto, no hace falta escribir código extra de validación para comprobar si el celular es muy viejo o si la función existe antes de intentar usarla.

## C5. Android vs iOS, lado a lado

| Característica                           | Android                                                                              | iOS                                                                                                  |
| :--------------------------------------- | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **¿Dónde se declara?**                   | En el archivo `AndroidManifest.xml`                                                  | En el archivo `Info.plist`                                                                           |
| **Texto en el diálogo**                  | Es el estándar del sistema, no se puede personalizar ni modificar.                   | Se escribe un texto propio (UsageDescription) para cada permiso solicitado.                          |
| **Oportunidades para preguntar**         | Varias (recién en Android 11+, denegar dos veces seguidas bloquea el permiso).       | Una sola vez. Al primer rechazo por parte de la persona, queda bloqueado para siempre.               |
| **"Solo esta vez" / "Permitir una vez"** | Existe desde Android 11 para Ubicación, Cámara y Micrófono.                          | Existe desde iOS 13 para Ubicación, y para Cámara/Micrófono se reforzó en versiones más recientes.   |
| **Notificaciones**                       | Es un permiso explícito que se pide al ejecutar (desde Android 13).                  | Es un permiso explícito que se pide al ejecutar (siempre fue así en iOS).                            |
| **Ubicación en segundo plano**           | Se pide obligatoriamente por separado después de conceder el primer plano.           | Se puede "escalar" de "al usar la app" a "Siempre" pidiéndolo después.                               |
| **Si falta la declaración**              | La aplicación se cierra (crashea) al intentarlo o el sistema asume que fue denegado. | La aplicación se cierra (crashea) al intentar usar el recurso o Apple rechaza la subida a la tienda. |

# Parte D. Expo: una API, dos plataformas

## D1. Módulos y funciones

| Necesidad                                       | Módulo                       | Hook / función de permiso                          |
| :---------------------------------------------- | :--------------------------- | :------------------------------------------------- |
| **Escanear un QR con la cámara**                | `expo-camera`                | `useCameraPermissions()`                           |
| **Grabar video con sonido**                     | `expo-camera`                | `useMicrophonePermissions()` (además de la cámara) |
| **Mostrar farmacias cercanas**                  | `expo-location`              | `useForegroundPermissions()`                       |
| **Seguir un envío con la app en segundo plano** | `expo-location`              | `requestBackgroundPermissionsAsync()`              |
| **Mostrar un recordatorio**                     | `expo-notifications`         | `usePermissions()` o `requestPermissionsAsync()`   |
| **Grabar una nota de voz**                      | `expo-audio`                 | `requestRecordingPermissionsAsync()`               |
| **Galería propia dentro de la app**             | `expo-media-library`         | `usePermissions()`                                 |
| **Publicidad personalizada entre apps (iOS)**   | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()`                |

**Un tutorial usa `import * as Permissions from 'expo-permissions'`. ¿Qué te dice eso sobre el tutorial?**
Me dice que el tutorial está obsoleto y muy desactualizado. Ese paquete fue deprecado hace tiempo y está prohibido en Expo SDK 57. Ahora cada módulo (cámara, ubicación, etc.) maneja sus propios permisos internamente.

## D2. Consultar, pedir y el hook

**a) ¿Qué diferencia hay entre get...PermissionsAsync() y request...PermissionsAsync()? ¿Cuál puede mostrar un diálogo?**

- `get...PermissionsAsync()`: Solo consulta el estado actual del permiso en silencio, sin molestar al usuario.
- `request...PermissionsAsync()`: Es la que le solicita explícitamente el permiso al usuario y es la única que **puede mostrar un diálogo** (siempre y cuando el estado lo permita).

**b) El hook devuelve tres elementos. ¿Qué es cada uno? ¿Qué vale permiso en el primer render y qué tiene que mostrar la pantalla mientras tanto?**

1. El objeto con el estado actual del permiso.
2. La función para pedir el permiso (`request`).
3. La función para volver a consultar el estado (`get`).
   En el primer render (cuando la app recién abre), el objeto `permiso` vale `null`. Mientras esto pasa, la pantalla tiene que mostrar un indicador de carga (un "spinner" o texto que diga "Cargando...") porque la app todavía no sabe la respuesta del sistema.

**c) Si canAskAgain es false, ¿qué pasa al llamar a request...()? ¿Qué problema aparece si se lo llama en un bucle?**
Si `canAskAgain` es `false`, llamar a `request()` no hace nada visible; el sistema devuelve automáticamente el estado `denied` en milisegundos sin mostrar ningún diálogo. Si se lo llama en un bucle (por ejemplo, dentro de un componente que se renderiza constantemente), la aplicación quedará atrapada en un ciclo infinito de rechazos silenciosos, lo que puede congelar o bloquear la pantalla.

## D3. Leé la respuesta

| Respuesta                                                | Qué hace la app                                                                                                       |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `null`                                                   | Muestra un indicador de carga (spinner).                                                                              |
| `{ status: 'granted', granted: true }`                   | Habilita la función (ej. abre la cámara o muestra el mapa).                                                           |
| `{ status: 'undetermined', canAskAgain: true }`          | Muestra una pantalla previa explicando por qué necesita el permiso con un botón "Continuar" para pedirlo.             |
| `{ status: 'denied', canAskAgain: true }`                | Muestra la pantalla previa (similar a la de arriba) explicando que se necesita el acceso para continuar.              |
| `{ status: 'denied', canAskAgain: false }`               | Muestra un mensaje diciendo que el permiso está bloqueado y un botón que diga "Abrir Ajustes".                        |
| `{ status: 'granted', accessPrivileges: 'limited' }`     | Muestra solo las fotos que la persona seleccionó previamente, y ofrece un botón para "Seleccionar más fotos".         |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Muestra información a nivel general (ej. el barrio o clima de la ciudad) sin dibujar un marcador de ubicación exacto. |

**¿Cuáles son los dos campos que deciden casi todo? ¿Qué pregunta responde cada uno?**
Los dos campos clave son `status` y `canAskAgain`.

- `status` responde a: _¿Tengo acceso al recurso ahora mismo?_
- `canAskAgain` responde a: _¿El sistema operativo me deja mostrarle el cuadro de diálogo a la persona si se lo pido?_

## D4. Simulación del ciclo completo

**Simulación en Android 14 (app recién instalada, `expo-location`):**

| #   | Acción                                                                                       | `status`         | `canAskAgain` | ¿Diálogo?                                                                      |
| :-- | :------------------------------------------------------------------------------------------- | :--------------- | :------------ | :----------------------------------------------------------------------------- |
| 1   | `getForegroundPermissionsAsync()`                                                            | `'undetermined'` | `true`        | No (solo consulta)                                                             |
| 2   | `request...()` → "No permitir"                                                               | `'denied'`       | `true`        | Sí (se mostró el diálogo)                                                      |
| 3   | `request...()` → "No permitir"                                                               | `'denied'`       | `false`       | Sí (segundo y último diálogo)                                                  |
| 4   | `request...()`                                                                               | `'denied'`       | `false`       | No (está bloqueado)                                                            |
| 5   | `Linking.openSettings()` → habilita "Mientras la app está en uso" → vuelve y la app consulta | `'granted'`      | `true`        | No (ya se concedió en Ajustes)                                                 |
| 6   | Igual que el 5, pero la app no vuelve a consultar: ¿qué muestra?                             | `'denied'`       | `false`       | No. Muestra el estado viejo porque la app no se enteró del cambio por sí sola. |

**Repetí los pasos 1 a 4 en iOS. ¿En qué paso cambia el resultado y por qué? ¿Qué pasa en iOS si la persona elige "Permitir una vez" y después cierra y reabre la app?**
En iOS, el resultado cambia drásticamente en el **Paso 2**. Al elegir "No permitir" por primera vez, `canAskAgain` pasa a ser `false` inmediatamente y el permiso queda bloqueado (iOS no da una segunda oportunidad como Android).
Si en iOS la persona elige "Permitir una vez" y luego cierra y reabre la app por completo, el permiso se revoca y el estado vuelve al Paso 1 (`'undetermined'`).

## D5. Configurar app.json

**Bloque de configuración en `app.json`:**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos la cámara para escanear el QR del aula.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje cercanos.",
          "isAndroidBackgroundLocationEnabled": false
        }
      ]
    ],
    "android": {
      "blockedPermissions": ["android.permission.SYSTEM_ALERT_WINDOW"]
    }
  }
}
```

_¿Por qué expo-camera agrega RECORD_AUDIO en Android aunque la app no grabe sonido?_
Porque el módulo nativo de la cámara de Expo incluye por defecto la capacidad de grabar video (que requiere micrófono). Para evitar que Android exija ese permiso al compilar, hay que apagarlo explícitamente en el plugin usando "recordAudioAndroid": false.

## D6. Expo Go no es tu app

**a) ¿Por qué tus textos de propósito no aparecen cuando probás en Expo Go?**
Porque Expo Go es una aplicación genérica que ya fue pre-compilada por el equipo de Expo. Su AndroidManifest.xml y su Info.plist ya están creados con textos estándar en inglés. Para ver tus propios textos nativos, necesitás compilar tu propia app.

**b) ¿Qué se puede probar en Expo Go y qué necesita una development build? Pensá en push en Android y en ubicación en segundo plano.**
En Expo Go se pueden probar funciones básicas como la cámara, ubicación en primer plano o alertas simples. Sin embargo, funciones que requieren configurar profundamente el sistema operativo, como notificaciones push (con credenciales de Firebase/Apple) o ubicación en segundo plano constante, exigen compilar una Development Build propia.

**c) Escribí los comandos para ver los archivos nativos generados y para compilar una development build en Android.**

Para ver los archivos nativos generados (android e ios): npx expo prebuild

Para compilar y correr una development build local en Android: npx expo run:android

**d) ¿Cómo volvés un permiso a "sin decidir" sin reinstalar, en Android (adb) y en el simulador de iOS (xcrun simctl)?**

En Android (adb): `adb shell pm reset-permissions -p com.tu.paquete` (o `adb shell pm clear com.tu.paquete`, que además borra los datos). Ojo: `pm revoke` deja el permiso en "denegado", no en "sin decidir".

En el simulador de iOS: `xcrun simctl privacy booted reset all com.tu.paquete` (o un servicio puntual, por ejemplo `reset camera`).

# Parte E. Recetas: leer y corregir código

## E1. Encontrá los errores (cámara)

**Problemas encontrados:**

1. **`permiso` es `null` en el primer render.** El hook todavía no consultó al sistema, así que `permiso.status` rompe la app con _"Cannot read property 'status' of null"_. Hay que mostrar un estado de carga.
2. **Usa `status === 'granted'` en vez de `granted`.** Funciona, pero lo idiomático es `permiso.granted`.
3. **No distingue "preguntable" de "bloqueado".** Si `canAskAgain` es `false`, el botón "Permitir" llama a `request()`, que vuelve al instante con `denied` sin mostrar ningún diálogo: la persona toca y no pasa nada. En ese caso hay que ofrecer "Abrir Ajustes".
4. **El botón dice "Permitir".** En la pantalla previa debe decir "Continuar": el que permite es el sistema, no nuestro botón (pauta 5.1.1(iv) de Apple).
5. **No hay alternativa.** Si la persona no quiere usar la cámara, no puede escribir el código del aula a mano, así que la función queda bloqueada.
6. **No se entera de los cambios hechos en Ajustes.** Al volver de Ajustes no se vuelve a consultar el permiso.
7. Faltan los imports de `Explicacion`, `Linking` y `ActivityIndicator`.

**Versión corregida (cuatro estados):**

```tsx
// src/app/escanear.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ActivityIndicator, Button, Linking, TextInput, View } from 'react-native';
import { Explicacion } from '@/components/Explicacion';
import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver';

export default function Escanear() {
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  useRevisarAlVolver(consultarPermiso); // vuelve de Ajustes → vuelve a consultar

  // 1) Cargando
  if (!permiso) return <ActivityIndicator size="large" />;

  // 2) Concedido
  if (permiso.granted) {
    return <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={/* ... */} />;
  }

  // 3) Preguntable
  if (permiso.canAskAgain) {
    return (
      <Explicacion texto="Usamos la cámara para leer el QR del aula.">
        <Button title="Continuar" onPress={pedirPermiso} />
        <TextInput placeholder="O escribí el código del aula" />
      </Explicacion>
    );
  }

  // 4) Bloqueado
  return (
    <Explicacion texto="La cámara está desactivada. Podés habilitarla en Ajustes.">
      <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      <TextInput placeholder="O escribí el código del aula" />
    </Explicacion>
  );
}
```

## E2. El orden importa (ubicación)

**a) ¿Qué está mal? ¿Qué ocurre en iOS y qué ocurre en Android 11+?**
Pide primero el permiso de **segundo plano** y después el de **primer plano**, al revés de lo que exigen los dos sistemas. El permiso "siempre" solo se puede pedir **después** de tener el "en uso".

- **iOS:** sin el "en uso" concedido, `requestBackgroundPermissionsAsync()` no muestra el diálogo correcto (o no muestra nada) y devuelve denegado. La función retorna `false` antes de llegar a pedir el primer plano.
- **Android 11+:** el sistema no muestra un diálogo para la ubicación en segundo plano. La única forma es mandar a la persona a Ajustes ("Permitir todo el tiempo"), y eso solo si ya tiene el primer plano. Pedirlo primero da `denied` directamente.

**b) Función corregida:**

```ts
// src/lib/ubicacion.ts
import * as Location from 'expo-location';

export async function activarSeguimiento(): Promise<boolean> {
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

**c) `obtenerUbicacion()`:**

```ts
export type Coordenadas = { latitud: number; longitud: number; aproximada: boolean };

export async function obtenerUbicacion(): Promise<Coordenadas | null> {
  try {
    const permiso = await Location.requestForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const aproximada =
      permiso.android?.accuracy === 'coarse' || // Android 12+
      permiso.ios?.accuracy === 'reduced';      // iOS 14+ con "Precisa" apagado

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: aproximada ? Location.Accuracy.Low : Location.Accuracy.Balanced,
    });

    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
      aproximada,
    };
  } catch {
    // GPS apagado, tiempo de espera, etc.: la app sigue funcionando
    return null;
  }
}
```

(En la app, `src/lib/ubicacion.ts` tiene la versión real, que recibe el permiso ya resuelto por `usePermiso`.)

**d) ¿Hace falta segundo plano para "farmacias cercanas"? ¿Qué exige Google Play si lo pedís?**
No. Solo se necesita la ubicación mientras la persona mira la pantalla, así que alcanza con primer plano (y hasta con aproximada). Si una app pide `ACCESS_BACKGROUND_LOCATION`, Google Play exige completar la **declaración de permisos de ubicación** en Play Console: justificar que es una función central para la persona usuaria, mostrar un aviso destacado dentro de la app antes de pedirlo y enviar un **video** que muestre la función. Si no se justifica, la app se rechaza.

## E3. Notificaciones mudas

**a) ¿Cuál es la causa más probable? ¿Qué hay que hacer antes de pedir el permiso?**
En Android 13+ el diálogo de `POST_NOTIFICATIONS` solo aparece si la app **ya tiene al menos un canal de notificaciones creado**. Antes de pedir hay que crear el canal:

```ts
await Notifications.setNotificationChannelAsync('reportes', {
  name: 'Reportes',
  importance: Notifications.AndroidImportance.HIGH,
});
const permiso = await Notifications.requestPermissionsAsync();
```

Otras causas posibles: el permiso ya está bloqueado (`canAskAgain: false`) o la app se está probando en Expo Go en vez de una development build.

**b) ¿Qué pasa con este permiso en Android 12 o anterior?**
No existe como permiso de tiempo de ejecución. Las notificaciones están **habilitadas por defecto** al instalar, `requestPermissionsAsync()` devuelve `granted` sin mostrar diálogo y la persona solo puede apagarlas desde Ajustes.

**c) ¿Qué opción de iOS permite recibir notificaciones sin diálogo? ¿Cómo detectás en código ese estado?**
Las **notificaciones provisionales** (iOS 12+). Se piden con:

```ts
await Notifications.requestPermissionsAsync({ ios: { allowProvisional: true } });
```

No aparece ningún diálogo: las notificaciones llegan en silencio al Centro de notificaciones y desde ahí la persona decide si las conserva. En código se detecta así:

```ts
const permiso = await Notifications.getPermissionsAsync();
const provisional = permiso.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
```

**d) ¿En qué momento conviene pedir este permiso? Dá un ejemplo de buen y de mal momento.**
Cuando la persona hace algo que **claramente** necesita un aviso, para que entienda el beneficio.

- **Buen momento:** al activar el interruptor "Avisarme cuando se resuelva mi reporte", o justo después de sacar un turno ("¿Querés que te recordemos el turno el día anterior?").
- **Mal momento:** apenas se abre la app por primera vez, antes de que la persona sepa para qué sirve.

## E4. Fotos sin pedir permiso

| Necesidad                          | Herramienta                                                           | Permiso                                                                                                         |
| :--------------------------------- | :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| Elegir una foto de perfil          | `expo-image-picker` → `launchImageLibraryAsync()` (selector del sistema) | **Ninguno.** El selector corre fuera de la app y solo le entrega la foto elegida.                               |
| Sacar una foto en el momento       | `expo-image-picker` → `launchCameraAsync()` (o `expo-camera`)         | **Cámara** (`CAMERA` / `NSCameraUsageDescription`).                                                             |
| Editor que muestra toda la galería | `expo-media-library`                                                  | **Galería** (`READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` en Android, `NSPhotoLibraryUsageDescription` en iOS), con posible acceso limitado. |
| Adjuntar la foto de un comprobante | `expo-image-picker` → `launchImageLibraryAsync()` (o `expo-document-picker`) | **Ninguno.**                                                                                                  |

**¿Por qué Google Play restringe READ_MEDIA_IMAGES y READ_MEDIA_VIDEO? ¿Desde cuándo? ¿Qué es "el mejor permiso"?**
Porque dan acceso a **todas** las fotos y videos de la persona, aunque la app solo necesite una. Desde **2025** (la política de permisos de fotos y videos entró en vigor a principios de 2025), Google Play solo los permite en apps cuya función principal es manejar la galería (editores, galerías, backups). El resto tiene que usar el **Photo Picker** del sistema o declarar y justificar el uso en Play Console. "El mejor permiso" es **el que no se pide**: si existe una herramienta del sistema que resuelve la necesidad sin permiso (selector de fotos, selector de contactos, selector de documentos), se usa esa.

## E5. Volver de Ajustes

```ts
// src/hooks/useRevisarAlVolver.ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = /inactive|background/.test(anterior.current);
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });
    return () => sub.remove();
  }, [revisar]);
}
```

**a) ¿Por qué los hooks de Expo no se enteran solos de que el permiso cambió en Ajustes?**
Porque el hook consulta el permiso **una sola vez al montarse** y cada vez que llamás a `request`/`get`. El sistema operativo no avisa a la app cuando la persona cambia un permiso en Ajustes, así que el estado que guarda el hook queda viejo hasta que la app vuelve a consultar.

**b) ¿Qué función del hook de cámara le pasarías a useRevisarAlVolver?**
La tercera: la función para **consultar** (`getPermission`), es decir `consultarPermiso` en `const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions()`. No se le pasa `pedirPermiso`, porque eso podría mostrar un diálogo sin que la persona lo haya pedido.

**c) ¿Por qué no conviene guardar el estado del permiso en un store global "para siempre"?**
Porque la fuente de verdad es el **sistema operativo**, no la app. La persona puede cambiarlo en Ajustes, un "Solo esta vez" vence al cerrar la app, Android revoca automáticamente los permisos de apps sin usar y una reinstalación los resetea. Un valor guardado "para siempre" queda desactualizado y la app termina mostrando la cámara sin permiso (crash o pantalla negra) o diciendo "bloqueado" cuando ya está habilitado. Hay que consultarlo cada vez que se usa la función y al volver a primer plano.

# Parte F. Buenas prácticas y tiendas

## F1. Pedir en contexto

| App y permiso                     | ¿Cuándo pedirlo?                                                                     | Alternativa si lo deniegan                                                         |
| :-------------------------------- | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| Delivery – ubicación              | Al tocar "Usar mi ubicación actual" en la dirección de entrega.                      | Escribir la dirección a mano o elegirla de las direcciones guardadas.             |
| Billetera virtual – cámara        | Al tocar "Pagar con QR".                                                             | Ingresar a mano el alias/CVU o el código del comercio.                            |
| Red social – contactos            | Al tocar "Buscar amigos de mis contactos".                                           | Buscar personas por nombre de usuario o compartir un link de invitación.          |
| Mensajería – micrófono            | Al mantener apretado por primera vez el botón de nota de voz.                        | Seguir escribiendo mensajes de texto.                                              |
| Turnos médicos – notificaciones   | Después de confirmar un turno: "¿Querés que te recordemos el día anterior?".         | Ver los turnos en "Mis turnos", agregar el turno al calendario o recibir un email. |
| Editor de fotos – galería completa | Al tocar "Abrir galería" dentro del editor (función principal de la app).            | Elegir fotos sueltas con el selector del sistema o trabajar con acceso limitado.   |

**¿Por qué pedir cuatro permisos apenas se abre la app "entrena el No permitir automático"?**
Porque la persona todavía no sabe para qué sirve la app ni qué gana con cada permiso, y recibe una seguidilla de diálogos que interrumpen. Se acostumbra a tocar "No permitir" para sacárselos de encima, y ese hábito se repite en todas las apps. Además, en iOS ese primer "No" es definitivo y en Android dos "No" bloquean el permiso, así que se pierde la oportunidad de pedirlo cuando de verdad hace falta.

## F2. La pantalla previa

**a) ¿Qué tres elementos tiene una buena pantalla previa al diálogo del sistema?**

1. **El beneficio en una frase**, con el molde "Usamos tu [dato] para [beneficio concreto]".
2. **Un único botón "Continuar"** que lleva al diálogo del sistema.
3. **La aclaración de que se puede cambiar después** en Ajustes (y, si corresponde, cuál es la alternativa).

**b) ¿Por qué el botón debe decir "Continuar" y no "Permitir"?**
Porque nuestro botón **no** concede nada: solo abre el diálogo del sistema, que es donde la persona decide. Decir "Permitir" es engañoso: la persona cree que ya aceptó y después aparece otro cuadro con otro "Permitir". Además, Apple pide que el botón previo no presione ni anticipe la decisión.

**c) ¿Qué dice la pauta 5.1.1(iv) de Apple sobre botones como "Ahora no" o "Cerrar" en esa pantalla?**
Que la app debe respetar la decisión de la persona y **no puede manipularla, presionarla ni condicionarla** para que dé el permiso. La pantalla previa no debe tener botones como "Ahora no", "Cerrar" o "Saltar" que lleven a la persona a esquivar el diálogo del sistema. La pantalla explica y lleva al diálogo con "Continuar", y la decisión real (aceptar o rechazar) se toma **siempre en el diálogo del sistema**. Si se rechaza, la app tiene que seguir funcionando con una alternativa.

**d) ¿Cómo cambia la pantalla si el permiso ya está bloqueado?**
Ya no tiene sentido "Continuar", porque `request()` no mostraría ningún diálogo. La pantalla explica que el acceso está desactivado, indica **el camino exacto en Ajustes** (Android: _Ajustes › Apps › Mantenimiento IPF › Permisos › Cámara › Permitir solo mientras la app está en uso_; iOS: _Ajustes › Mantenimiento IPF › Cámara_) y el botón pasa a ser **"Abrir Ajustes"** (`Linking.openSettings()`). También recuerda cuál es la alternativa para seguir usando la app.

## F3. Mínimo privilegio

**a) Ubicación precisa o aproximada para "puntos de reciclaje de tu barrio".**
**Aproximada.** Para listar puntos del barrio alcanza con saber la zona (unos 3 km²). No hace falta saber exactamente en qué casa está la persona.

**b) Ubicación "en uso" o "siempre" para "registrar una carrera con el celular en el bolsillo".**
**"En uso", con un servicio en primer plano.** Mientras se registra la carrera, la app muestra una notificación persistente ("Registrando carrera…") y cuenta como "en uso" aunque la pantalla esté apagada. No necesita rastrear a la persona cuando no está corriendo, así que "siempre" sería excesivo y además Google Play lo exige justificar.

**c) Selector del sistema o permiso de galería para "subir la foto del DNI".**
**Selector del sistema.** Se necesita una sola foto, elegida por la persona. El selector no pide permiso y la app nunca ve el resto de la galería.

**d) expo-camera con o sin micrófono para "escanear el QR del aula".**
**Sin micrófono.** Leer un QR no graba sonido, así que se configura `microphonePermission: false` (iOS) y `recordAudioAndroid: false` (Android) en el plugin de `expo-camera`.

## F4. Tiendas

**a) Nombrá dos requisitos de Google Play y dos de App Store relacionados con permisos y privacidad.**

- **Google Play:**
  1. Completar la sección **Seguridad de los datos** (Data safety) en Play Console, declarando qué datos se recolectan y para qué.
  2. Declarar y justificar los **permisos sensibles o restringidos** (ubicación en segundo plano, SMS/llamadas, `READ_MEDIA_IMAGES`, `MANAGE_EXTERNAL_STORAGE`, alarmas exactas), con video si corresponde. También: tener una política de privacidad publicada y apuntar al `targetSdkVersion` exigido.
- **App Store:**
  1. **Textos de propósito** (`NS...UsageDescription`) claros y específicos en el `Info.plist` para cada recurso protegido (pauta 5.1.1); si faltan, la build se rechaza.
  2. Completar las **Etiquetas de privacidad** (Privacy Nutrition Labels) en App Store Connect e incluir el **manifiesto de privacidad** (`PrivacyInfo.xcprivacy`). Si la app rastrea entre apps, pedir permiso con **App Tracking Transparency**.

**b) ¿Qué es el manifiesto de privacidad (PrivacyInfo.xcprivacy) y dónde se configura en Expo?**
Es un archivo que Apple exige desde mayo de 2024. Declara qué datos recolecta la app, si los usa para rastrear y, sobre todo, **por qué usa ciertas "APIs de motivo requerido"** (por ejemplo `UserDefaults`, fecha de arranque del sistema, espacio en disco), indicando un código de motivo para cada una. En Expo no se edita a mano: se configura en `app.json` en `expo.ios.privacyManifests` (con `NSPrivacyAccessedAPITypes`, `NSPrivacyCollectedDataTypes`, `NSPrivacyTracking`, etc.), y `npx expo prebuild` genera el archivo. Muchas librerías de Expo ya traen su propio manifiesto.

**c) ¿Qué suma Android 17 y qué va a exigir Google Play desde el 27/01/2027 a las apps que hoy piden READ_CONTACTS?**
Android 17 suma un **selector de contactos del sistema** (Contact Picker): la persona elige uno o varios contactos y la app recibe solo esos, **sin pedir `READ_CONTACTS`**, igual que el Photo Picker con las fotos. Desde el 27/01/2027, Google Play va a exigir que las apps que piden `READ_CONTACTS` **justifiquen el acceso completo** en Play Console (que leer toda la agenda sea parte central de la función). Si no lo pueden justificar, tienen que pasar al selector de contactos y dejar de declarar el permiso.

## F5. Errores comunes

**a) La consola de Xcode muestra: "This app has crashed because it attempted to access privacy-sensitive data without a usage description."**

- **Causa:** falta la clave `NS...UsageDescription` del recurso en el `Info.plist`, por ejemplo porque no se configuró el plugin en `app.json` o se lo configuró con `false`.
- **Solución:** agregar el plugin con su texto de propósito en `app.json` (por ejemplo `"cameraPermission": "Usamos tu cámara para…"`), regenerar con `npx expo prebuild` y **volver a compilar** la app. Una actualización OTA no alcanza.

**b) "En Expo Go anda, en la build no": en la development build la cámara se deniega sin mostrar ningún diálogo.**

- **Causa:** Expo Go trae declarados todos los permisos, pero la build propia solo tiene los que configuraste. El permiso no quedó en el `AndroidManifest.xml`: falta el plugin, o está en `blockedPermissions`, o se agregó el plugin y no se recompiló. Sin declaración, Android lo deniega sin preguntar.
- **Solución:** revisar `plugins` y `android.blockedPermissions` en `app.json`, correr `npx expo prebuild --clean` y verificar el manifiesto generado. Después recompilar la development build (`npx expo run:android`).

**c) Después de habilitar la ubicación en Ajustes, la app sigue diciendo "bloqueado".**

- **Causa:** la app no volvió a consultar el permiso al volver a primer plano; muestra el estado viejo guardado en el hook.
- **Solución:** usar `AppState` (hook `useRevisarAlVolver`) para llamar a `get...PermissionsAsync()` o a la función de consulta del hook cuando la app vuelve a estar `active`.

**d) La pantalla queda en "Pidiendo permiso..." para siempre porque el código llama a request...() cada vez que se renderiza.**

- **Causa:** `request()` está en el cuerpo del componente. Cada respuesta cambia el estado, eso provoca un render nuevo, que vuelve a llamar a `request()`, y así sin fin. Si el permiso está bloqueado, vuelve `denied` al instante y el ciclo nunca termina.
- **Solución:** no pedir permisos durante el render. Llamar a `request()` solo **en respuesta a una acción de la persona** (el `onPress` de "Continuar") y usar el estado del hook (`null` → cargando) para decidir qué mostrar.

**e) Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones.**

- **Causa:** se trató un permiso opcional como obligatorio. Eso es mala práctica y Apple lo rechaza (pauta 5.1.1: la app debe funcionar aunque se niegue un permiso que no es imprescindible).
- **Solución:** dejar usar la app igual y ofrecer una alternativa: bandeja de avisos dentro de la app, recordatorio por email o agregar el turno al calendario. El permiso se vuelve a ofrecer solo cuando la persona activa la función de recordatorios.
