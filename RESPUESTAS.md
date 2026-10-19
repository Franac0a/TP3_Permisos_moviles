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
**Verdadero.**

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
| **Permiso de red local (`ACCESS_LOCAL_NETWORK`)**                    | No aplica (Trampa)   | Este permiso no existe en Android, es exclusivo de iOS 14. En Android, para buscar dispositivos locales se usa `NEARBY_WIFI_DEVICES` (API 33). |

**¿Qué es el targetSdkVersion? ¿A qué API apunta Expo SDK 57 y qué exige Google Play desde el 31 de agosto de 2026?**
El `targetSdkVersion` es la versión del sistema de Android (API) para la cual la aplicación fue diseñada y probada. Le indica al teléfono bajo qué reglas modernas de seguridad y permisos debe hacer funcionar la app.
Expo SDK 57 apunta de forma predeterminada a un nivel de API reciente, y Google Play exige desde finales de agosto de 2026 que todas las actualizaciones y aplicaciones nuevas apunten obligatoriamente a las últimas APIs (API 35/36 o superior) para no quedar ocultas en la tienda y obligar a los desarrolladores a cumplir con los nuevos estándares de privacidad.

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
          "locationAlwaysAndWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje cercanos."
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

En Android (adb): adb shell pm revoke com.tu.paquete android.permission.CAMERA (o borrando el almacenamiento/caché de la app desde los ajustes del celular).

En el simulador de iOS: xcrun simctl privacy booted reset all com.tu.paquete (o reseteando la privacidad desde el menú Device > Erase All Content and Settings).
