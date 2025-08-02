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

// --- ELEMENTOS DEL DOM ---
const authWrapper = document.getElementById('auth-wrapper');
const appContainer = document.getElementById('contenido');
const authContainer = document.getElementById('auth-container');

// Botones para el slider (escritorio)
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

// Formularios
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup'); // Botón del form de registro de escritorio
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

// Enlace de registro (móvil)
const registerLink = document.getElementById('register-link'); 

const btnLogout = document.getElementById('btn-logout');
const forgotPasswordLink = document.getElementById('forgot-password-link');


// --- LÓGICA DEL SLIDER (ESCRITORIO) ---
if (signUpButton && signInButton) {
    signUpButton.addEventListener('click', () => {
        authContainer.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        authContainer.classList.remove("right-panel-active");
    });
}

// --- LÓGICA DE REGISTRO CON MODAL (MÓVIL) ---
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        ...window.SweetAlertMobile.signupModal(),
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#email').value;
            const password = Swal.getPopup().querySelector('#password').value;
            const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;
            
            if (!email || !password || !confirmPassword) {
                Swal.showValidationMessage(`Por favor, completa todos los campos`);
                return false;
            }
            
            if (password !== confirmPassword) {
                Swal.showValidationMessage(`Las contraseñas no coinciden`);
                return false;
            }
            
            if (password.length < 6) {
                Swal.showValidationMessage(`La contraseña debe tener al menos 6 caracteres`);
                return false;
            }
            
            return auth.createUserWithEmailAndPassword(email, password)
                .catch(error => {
                    Swal.showValidationMessage(`Error: El correo ya está en uso o la contraseña es muy débil.`);
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora serás redirigido.',
                timer: 1500,
                showConfirmButton: false,
                position: window.innerWidth <= 768 ? 'top' : 'center'
            });
        }
    });
});


// --- LÓGICA DE OLVIDÉ MI CONTRASEÑA ---
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        ...window.SweetAlertMobile.forgotPasswordModal(),
        showLoaderOnConfirm: true,
        preConfirm: (email) => {
            if (!email) {
                Swal.showValidationMessage('Por favor, ingresa un correo electrónico.');
                return false;
            }
            return auth.sendPasswordResetEmail(email)
                .catch(error => {
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'No se encontró ningún usuario con este correo electrónico.';
                            break;
                        default:
                            errorMessage = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
                    }
                    Swal.showValidationMessage(`Error: ${errorMessage}`);
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: '¡Enlace enviado!',
                text: 'Revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.',
                confirmButtonColor: 'var(--color-primary)',
                position: window.innerWidth <= 768 ? 'top' : 'center'
            });
        }
    });
});


// --- LÓGICA DE REGISTRO (ESCRITORIO) ---
btnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    if (!email || !password) {
        return Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, ingresa correo y contraseña.',
            confirmButtonColor: 'var(--color-primary)'
        });
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('Usuario registrado:', userCredential.user);
            // El observador se encargará del resto
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrarse',
                text: 'El correo ya está en uso o la contraseña es muy débil.',
                confirmButtonColor: 'var(--color-danger)'
            });
        });
});

// --- LÓGICA DE INICIO DE SESIÓN ---
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
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
    authWrapper.style.display = 'none';
    appContainer.style.display = 'block';
    // Avisa a app.js que el usuario está listo para cargar sus tareas
    window.dispatchEvent(new CustomEvent('user-logged-in', { detail: { userId: user.uid } }));
  } else {
    // Usuario ha cerrado sesión
    authWrapper.style.display = 'flex';
    appContainer.style.display = 'none';
  }
});
// Decide qué pantalla mostrar (login o la app de tareas)
auth.onAuthStateChanged(user => {
  if (user) {
    // Usuario ha iniciado sesión
    authWrapper.style.display = 'none';
    appContainer.style.display = 'block';
    // Avisa a app.js que el usuario está listo para cargar sus tareas
    window.dispatchEvent(new CustomEvent('user-logged-in', { detail: { userId: user.uid } }));
  } else {
    // Usuario ha cerrado sesión
    authWrapper.style.display = 'flex';
    appContainer.style.display = 'none';
  }
});
