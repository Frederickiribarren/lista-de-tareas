# Lista de Tareas Moderna - Una Aplicación Inteligente

![Banner de la Aplicación](https://via.placeholder.com/1200x400/6a11cb/FFFFFF?text=Lista+de+Tareas+Moderna)

Bienvenido a la Lista de Tareas Moderna. Este no es solo un bloc de notas digital; es una **aplicación web inteligente** diseñada para funcionar en cualquier dispositivo, con o sin internet. Puedes instalarla en tu teléfono o computadora como si fuera una app nativa.

[![Estado del Despliegue](https://github.com/Frederickiribarren/lista-de-tareas/actions/workflows/deploy.yml/badge.svg)](https://github.com/Frederickiribarren/lista-de-tareas/actions/workflows/deploy.yml)

## ✨ ¿Qué hace especial a esta aplicación?

- **Tu Propia Cuenta Segura**: Crea una cuenta y tus tareas serán solo tuyas, protegidas y privadas.
- **Organización Visual**: Mueve tus tareas entre columnas ("Pendientes", "En Progreso", "Terminadas") para ver tu progreso de un vistazo.
- **Sincronización Mágica**: Tus tareas se guardan y actualizan automáticamente en todos tus dispositivos.
- **Funciona Sin Internet**: ¿Estás en un avión o en el metro? No hay problema. La aplicación sigue funcionando y se sincronizará cuando vuelvas a tener conexión.
- **Instálala en tus Dispositivos**: Añádela a la pantalla de inicio de tu teléfono o al escritorio de tu computadora con un solo clic.
- **Siempre al Día**: La aplicación te avisará discretamente cuando haya una nueva versión con mejoras, para que puedas actualizarla fácilmente.
- **Guarda tus Tareas en PDF**: ¿Necesitas un reporte? Descarga tu lista de tareas actual en un archivo PDF.

## 🛠️ ¿Cómo se construyó? (La tecnología detrás de la magia)

Para que una aplicación sea tan flexible, se necesitan varias herramientas modernas. Aquí te explico qué se usó y para qué sirve cada una:

- **La Estructura (HTML y CSS)**: Son como los cimientos y la pintura de una casa. Definen qué elementos hay en la página (botones, texto) y cómo se ven (colores, tamaños).
- **El Cerebro (JavaScript)**: Es el motor que hace que todo funcione. Se encarga de la lógica, como añadir una tarea nueva o moverla de una columna a otra.
- **La Nube (Firebase)**:
    - **El Guardián (Firebase Authentication)**: Es el sistema de seguridad que protege tu cuenta con un usuario y contraseña.
    - **La Memoria Infinita (Firestore)**: Es una base de datos en la nube donde se guardan tus tareas. Es "infinita" porque crece según tus necesidades y es súper rápida.
- **Las Alertas Bonitas (SweetAlert2)**: Es una herramienta que permite mostrar mensajes y diálogos elegantes, en lugar de las aburridas alertas del navegador.
- **El Impresor Digital (html2pdf.js)**: Es una librería que toma una parte de la página y la convierte en un archivo PDF listo para descargar.
- **El Robot de Despliegue (GitHub Actions)**: Cada vez que se mejora el código, este robot se encarga de empaquetar la nueva versión y publicarla en internet automáticamente, sin intervención manual.

## 🚀 ¿Cómo probar la aplicación?

Si eres un desarrollador y quieres experimentar con el código, aquí tienes los pasos:

1.  **Obtén una copia del proyecto**:
    ```bash
    git clone https://github.com/Frederickiribarren/lista-de-tareas.git
    cd lista-de-tareas
    ```

2.  **Conéctalo a tu propia "nube" de Firebase**:
    - Crea un proyecto gratis en la [Consola de Firebase](https://console.firebase.google.com/).
    - Activa los servicios de **Authentication** (con el método de Correo/Contraseña) y **Firestore Database**.
    - Firebase te dará un "código de conexión". Cópialo y pégalo al principio del archivo `js/auth.js`.
    - Para proteger los datos, copia las reglas del archivo `firestore.rules` y pégalas en la sección "Reglas" de tu base de datos Firestore.

3.  **Inicia la aplicación**:
    - La forma más fácil es usar la extensión **Live Server** en el editor de código Visual Studio Code.
    - Haz clic derecho sobre el archivo `index.html` y selecciona "Open with Live Server".

## 📈 El Viaje del Desarrollo

Este proyecto creció paso a paso, enfrentando desafíos y encontrando soluciones creativas.

- **El Comienzo**: Se empezó con una simple lista de tareas que solo funcionaba en una computadora.
- **La Necesidad de Cuentas**: Se añadió Firebase para que cada persona pudiera tener sus propias tareas privadas.
- **El Salto a "Aplicación"**: Se transformó en una PWA, lo que permitió que se pudiera instalar y funcionar sin internet.
- **La Automatización**: Se configuró un robot (GitHub Actions) para que cada mejora se publicara en internet automáticamente.
- **Pulido Final**: Se mejoró la experiencia en móviles, se añadió el sistema de notificaciones de actualización y se reforzó la seguridad.
    - **Descripción**: Se añadieron el `manifest.json` y un `sw.js` (Service Worker) para hacer la aplicación instalable y funcional sin conexión.
    - **Desafío y Solución**: Se corrigieron errores de rutas de iconos y de `fetch` en modo offline mejorando la estrategia de caché a "Stale-While-Revalidate".

- **`ci: Add GitHub Actions workflow for automatic deployment`**:
    - **Descripción**: Creación de un flujo de trabajo (`deploy.yml`) para automatizar el despliegue a GitHub Pages.
    - **Desafío y Solución**: Se solucionó un error de permisos (`Permission denied`) otorgando permisos de escritura a la acción de despliegue.

- **`feat: Add PWA update notification system`**:
    - **Descripción**: Implementación de un sistema de notificación no intrusivo que avisa al usuario cuando hay una nueva versión de la aplicación disponible, con opciones para actualizar o descartar.

- **`refactor: Improve mobile UX for task movement`**:
    - **Descripción**: Se reemplazó el "arrastrar y soltar" en móviles por un menú de acción contextual más intuitivo y rápido, que aparece al tocar una tarea.

- **`fix: Implement Firestore security rules`**:
    - **Descripción**: Se añadieron reglas de seguridad en `firestore.rules` para garantizar que cada usuario solo pueda acceder y modificar sus propias tareas, solucionando una vulnerabilidad crítica.
