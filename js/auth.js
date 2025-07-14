// PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE. DEBE LUCIR ASÍ:
const firebaseConfig = {
   apiKey: "AIzaSyB6dyvYFWp_KDZW8o7tByAh4JfNlP6c7Rw",
    authDomain: "lista-de-tareas-app-268ad.firebaseapp.com",
    projectId: "lista-de-tareas-app-268ad",
    storageBucket: "lista-de-tareas-app-268ad.firebasestorage.app",
    messagingSenderId: "1075397461524",
    appId: "1:1075397461524:web:f56c0b699ca8e1c6c00901",
    measurementId: "G-1ZSSN400KZ"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('contenido');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// --- LÓGICA DE REGISTRO ---
btnSignup.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, ingresa correo y contraseña.',
      confirmButtonColor: 'var(--color-primary)'
    });
  }
  // Esta función de Firebase crea un nuevo usuario
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Usuario registrado:', userCredential.user);
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Bienvenido/a. Redirigiendo...',
        timer: 1500,
        showConfirmButton: false
      });
    })
    .catch(error => {
      // Muestra un error si algo sale mal (ej: contraseña débil, email ya en uso)
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: 'El correo ya está en uso o la contraseña es muy débil.',
        confirmButtonColor: 'var(--color-danger)'
      });
    });
});

// --- LÓGICA DE INICIO DE SESIÓN ---
btnLogin.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, ingresa correo y contraseña.',
      confirmButtonColor: 'var(--color-primary)'
    });
  }
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Usuario ha iniciado sesión:', userCredential.user);
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'El correo o la contraseña son incorrectos.',
        confirmButtonColor: 'var(--color-danger)'
      });
    });
});

// --- LÓGICA DE CERRAR SESIÓN ---
btnLogout.addEventListener('click', () => {
  auth.signOut();
});


// --- OBSERVADOR DEL ESTADO DE AUTENTICACIÓN ---
// Decide qué pantalla mostrar (login o la app de tareas)
auth.onAuthStateChanged(user => {
  if (user) {
    // Usuario ha iniciado sesión
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    // Avisa a app.js que el usuario está listo para cargar sus tareas
    window.dispatchEvent(new CustomEvent('user-logged-in', { detail: { userId: user.uid } }));
  } else {
    // Usuario ha cerrado sesión
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
  }
});
