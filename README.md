# 📝 Lista de Tareas ### **📱 Experiencia de Usuario Moderna**
- **Organización Visual**: Mueve tus tareas entre columnas ("Pendientes", "En Progreso", "Terminadas") para ver tu progreso de un vistazo
- **Interfaz Responsiva**: Optimizada para móviles, tablets y escritorio
- **Drag & Drop Inteligente**: Arrastra tareas en escritorio o usa el menú contextual en móviles
- **Ordenamiento Inteligente**: Las tareas terminadas se ordenan automáticamente por fecha de finalización (más recientes arriba)**🔔 Sistema de Notificaciones Avanzado**
- **Notificaciones Push**: Recibe alertas cuando agregues, completes o elimines tareas
- **Recordatorios Programables**: Configura recordatorios únicos, diarios o semanales para tareas en progreso
- **Feedback Visual**: Notificaciones toast elegantes para confirmaciones inmediatas
- **Notificaciones en Segundo Plano**: Funciona incluso cuando la app está cerrada
- **Gestión Inteligente**: Los recordatorios solo están disponibles para tareas "En Progreso"na - Una Aplicación Inteligente

![Banner de la Aplicación](https://via.placeholder.com/1200x400/6a11cb/FFFFFF?text=Lista+de+Tareas+Moderna)

Bienvenido a la **Lista de Tareas Moderna**. Este no es solo un bloc de notas digital; es una **aplicación web inteligente** diseñada para funcionar en cualquier dispositivo, con o sin internet. Puedes instalarla en tu teléfono o computadora como si fuera una app nativa.

[![Estado del Despliegue](https://github.com/Frederickiribarren/lista-de-tareas/actions/workflows/deploy.yml/badge.svg)](https://github.com/Frederickiribarren/lista-de-tareas/actions/workflows/deploy.yml)

---

## ✨ ¿Qué hace especial a esta aplicación?

### 🔐 **Seguridad y Privacidad**
- **Tu Propia Cuenta Segura**: Crea una cuenta y tus tareas serán solo tuyas, protegidas y privadas
- **Autenticación Robusta**: Sistema de login seguro con Firebase Authentication

### 📱 **Experiencia de Usuario Moderna**
- **Organización Visual**: Mueve tus tareas entre columnas ("Pendientes", "En Progreso", "Terminadas") para ver tu progreso de un vistazo
- **Interfaz Responsiva**: Optimizada para móviles, tablets y escritorio
- **Drag & Drop Inteligente**: Arrastra tareas en escritorio o usa el menú contextual en móviles

### 🔔 **Sistema de Notificaciones Avanzado**
- **Notificaciones Push**: Recibe alertas cuando agregues, completes o elimines tareas
- **Recordatorios Programables**: Configura recordatorios únicos, diarios o semanales para tus tareas
- **Feedback Visual**: Notificaciones toast elegantes para confirmaciones inmediatas
- **Notificaciones en Segundo Plano**: Funciona incluso cuando la app está cerrada

### 🌐 **Conectividad y Sincronización**
- **Sincronización Mágica**: Tus tareas se guardan y actualizan automáticamente en todos tus dispositivos
- **Funciona Sin Internet**: ¿Estás en un avión o en el metro? No hay problema. La aplicación sigue funcionando y se sincronizará cuando vuelvas a tener conexión
- **PWA (Progressive Web App)**: Instálala en la pantalla de inicio como una app nativa

### 🔄 **Actualizaciones Automáticas**
- **Siempre al Día**: La aplicación te avisará discretamente cuando haya una nueva versión con mejoras
- **Actualización Sin Interrupciones**: Actualiza fácilmente sin perder tu trabajo

---

## 🛠️ Tecnologías Utilizadas

Esta aplicación está construida con tecnologías modernas para ofrecer la mejor experiencia posible:

### **Frontend**
- **HTML5 & CSS3**: Estructura semántica y diseño responsivo con CSS Grid y Flexbox
- **JavaScript ES6+**: Lógica de aplicación moderna con módulos y async/await
- **SweetAlert2**: Diálogos y alertas elegantes para mejor UX

### **Backend y Base de Datos**
- **Firebase Authentication**: Sistema de autenticación seguro y escalable
- **Cloud Firestore**: Base de datos NoSQL en tiempo real para sincronización instantánea
- **Reglas de Seguridad**: Protección robusta de datos a nivel de base de datos

### **PWA (Progressive Web App)**
- **Service Worker**: Funcionalidad offline y caché inteligente
- **Web App Manifest**: Instalación como app nativa
- **Notificaciones Push**: Sistema completo de notificaciones del navegador

### **Sistemas Avanzados**
- **Sistema de Notificaciones Personalizado**: Toast notifications y notificaciones push
- **Sistema de Recordatorios**: Programación de alertas con persistencia local
- **Caché Estratégico**: Estrategia "Stale-While-Revalidate" para mejor rendimiento

### **DevOps y Despliegue**
- **GitHub Actions**: CI/CD automatizado para despliegue continuo
- **GitHub Pages**: Hosting gratuito y confiable
- **Versionado Semántico**: Control de versiones para actualizaciones

---

## 🚀 Instalación y Uso

### **Para Usuarios**
1. **Visita la aplicación**: [Lista de Tareas Moderna](https://frederickiribarren.github.io/lista-de-tareas/)
2. **Instala como PWA**: 
   - En **móvil**: Toca "Agregar a pantalla de inicio" en el menú del navegador
   - En **escritorio**: Busca el ícono de instalación en la barra de direcciones

### **Para Desarrolladores**

#### **Requisitos Previos**
- Node.js (opcional, para desarrollo local)
- Una cuenta de Firebase (gratis)
- Visual Studio Code con Live Server (recomendado)

#### **Configuración del Proyecto**

1.  **Clona el repositorio**:
    ```bash
    git clone https://github.com/Frederickiribarren/lista-de-tareas.git
    cd lista-de-tareas
    ```

2.  **Configura Firebase**:
    - Crea un proyecto gratis en [Firebase Console](https://console.firebase.google.com/)
    - Activa **Authentication** (método Correo/Contraseña) y **Firestore Database**
    - Copia la configuración de Firebase y pégala en `js/auth.js`
    - Aplica las reglas de seguridad desde `firestore.rules` a tu base de datos

3.  **Ejecuta la aplicación**:
    - Usa **Live Server** en VS Code
    - Haz clic derecho en `index.html` → "Open with Live Server"
    - O simplemente abre `index.html` en tu navegador

#### **Estructura del Proyecto**
```
lista-de-tareas/
├── 📁 css/
│   └── style.css              # Estilos principales
├── 📁 images/
│   ├── icon-192.png          # Íconos PWA
│   └── icon-512.png
├── 📁 js/
│   ├── app.js               # Lógica principal de tareas
│   ├── auth.js              # Autenticación Firebase
│   ├── notifications.js     # Sistema de notificaciones
│   └── reminders.js         # Sistema de recordatorios
├── index.html               # Página principal
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── firestore.rules         # Reglas de seguridad
└── README.md
```

---

## 🎯 Características Principales

### **🔔 Sistema de Notificaciones**
- **Toast Notifications**: Feedback visual inmediato para todas las acciones
- **Notificaciones Push**: Alertas del navegador para eventos importantes
- **Recordatorios Programables**: Configura alertas para tareas en progreso únicamente
- **Persistencia**: Los recordatorios se guardan localmente
- **Eliminación Automática**: Los recordatorios se eliminan al mover tareas fuera de "En Progreso"

### **📱 Experiencia Móvil Optimizada**
- **Menú Contextual**: Toca una tarea para ver opciones de movimiento
- **Interfaz Responsiva**: Se adapta perfectamente a cualquier pantalla
- **Gestos Intuitivos**: Diseñado para uso táctil
- **Ordenamiento Automático**: Las tareas completadas se organizan por fecha de finalización

### **🔒 Seguridad Avanzada**
- **Autenticación Robusta**: Sistema seguro con Firebase
- **Reglas de Firestore**: Cada usuario solo accede a sus datos
- **Validación de Entrada**: Protección contra XSS y ataques comunes

### **⚡ Rendimiento Optimizado**
- **Caché Inteligente**: Carga rápida y funcionamiento offline
- **Sincronización en Tiempo Real**: Cambios instantáneos entre dispositivos
- **Actualizaciones Automáticas**: Siempre tienes la última versión

---

### **� Hitos Principales**

#### **v1.0 - Base Funcional** 
- ✅ Lista de tareas básica con HTML/CSS/JavaScript
- ✅ Funcionalidad de agregar, mover y eliminar tareas

#### **v2.0 - Autenticación y Nube**
- ✅ Integración con Firebase Authentication
- ✅ Base de datos Firestore para persistencia
- ✅ Cuentas de usuario individuales

#### **v3.0 - Progressive Web App**
- ✅ Service Worker para funcionamiento offline
- ✅ Web App Manifest para instalación
- ✅ Caché inteligente con estrategia "Stale-While-Revalidate"

#### **v4.0 - CI/CD y Despliegue**
- ✅ GitHub Actions para despliegue automático
- ✅ Hosting en GitHub Pages
- ✅ Sistema de versiones automatizado

#### **v5.0 - UX Móvil Mejorada**
- ✅ Menú contextual para dispositivos táctiles
- ✅ Interfaz responsiva optimizada
- ✅ Sistema de notificaciones de actualización

#### **v6.0 - Seguridad Robusta**
- ✅ Reglas de seguridad Firestore implementadas
- ✅ Validación de entrada y protección XSS
- ✅ Acceso restrictivo por usuario

#### **v7.0 - Sistema de Notificaciones** 🆕
- ✅ Notificaciones push del navegador
- ✅ Toast notifications para feedback inmediato
- ✅ Sistema de recordatorios programables
- ✅ Persistencia local de recordatorios

#### **v7.1 - Optimización** 🆕
- ✅ Eliminación de funcionalidad PDF innecesaria
- ✅ Reducción del tamaño de la aplicación
- ✅ Mejor rendimiento y velocidad de carga

#### **v7.2 - Mejoras en UX** 🆕
- ✅ Recordatorios exclusivos para tareas "En Progreso"
- ✅ Ordenamiento automático de tareas terminadas por fecha
- ✅ Eliminación automática de recordatorios al mover tareas
- ✅ Efectos visuales para tareas recién completadas

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una idea para mejorar la aplicación:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- **Firebase** por proporcionar una plataforma backend robusta y gratuita
- **GitHub** por el hosting gratuito y las herramientas de CI/CD
- **SweetAlert2** por los diálogos elegantes
- **La comunidad de desarrolladores** por las librerías y recursos open source

---

## 📞 Contacto

**Desarrollador**: Frederick Iribarren  
**GitHub**: [@Frederickiribarren](https://github.com/Frederickiribarren)  
**Proyecto**: [Lista de Tareas Moderna](https://github.com/Frederickiribarren/lista-de-tareas)

---

<div align="center">

**🌟 Si te gustó este proyecto, ¡dale una estrella! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/Frederickiribarren/lista-de-tareas?style=social)](https://github.com/Frederickiribarren/lista-de-tareas/stargazers)

</div>
