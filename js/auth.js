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
if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Crear una Cuenta',
            html: `
                <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico" style="font-size: 16px;">
                <input type="password" id="password" class="swal2-input" placeholder="Contraseña (mín. 6 caracteres)" style="font-size: 16px;">
                <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña" style="font-size: 16px;">
            `,
            showCancelButton: true,
            confirmButtonText: 'Crear Cuenta',
            cancelButtonText: 'Cancelar',
            position: window.innerWidth <= 768 ? 'top' : 'center',
            confirmButtonColor: '#6a11cb',
            focusConfirm: false,
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
}

// --- LÓGICA DE OLVIDÉ MI CONTRASEÑA ---
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Restablecer Contraseña',
            text: 'Ingresa tu correo electrónico para recibir un enlace de restablecimiento.',
            input: 'email',
            inputPlaceholder: 'tu.correo@ejemplo.com',
            inputAttributes: {
                style: 'font-size: 16px;'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar enlace',
            cancelButtonText: 'Cancelar',
            position: 'top',
            confirmButtonColor: '#6a11cb',
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
                    confirmButtonColor: '#6a11cb',
                    position: window.innerWidth <= 768 ? 'top' : 'center'
                });
            }
        });
    });
}

// --- LÓGICA DE REGISTRO (ESCRITORIO) ---
if (btnSignup) {
    btnSignup.addEventListener('click', (e) => {
        e.preventDefault();
        const email = signupEmailInput.value;
        const password = signupPasswordInput.value;
        
        if (!email || !password) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa correo y contraseña.',
                confirmButtonColor: '#6a11cb'
            });
        }
        
        if (password.length < 6) {
            return Swal.fire({
                icon: 'warning',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener al menos 6 caracteres.',
                confirmButtonColor: '#6a11cb'
            });
        }
        
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Usuario registrado:', userCredential.user);
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Bienvenido a la aplicación.',
                    confirmButtonColor: '#6a11cb'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrarse',
                    text: 'El correo ya está en uso o la contraseña es muy débil.',
                    confirmButtonColor: '#dc3545'
                });
            });
    });
}

// --- LÓGICA DE LOGIN (ESCRITORIO) ---
if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        
        if (!email || !password) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa correo y contraseña.',
                confirmButtonColor: '#6a11cb'
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
                    confirmButtonColor: '#dc3545'
                });
            });
    });
}

// --- LÓGICA DE LOGOUT ---
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        auth.signOut().then(() => {
            console.log('Usuario ha cerrado sesión');
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    });
}

// --- OBSERVADOR DE ESTADO DE AUTENTICACIÓN ---
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario autenticado
        console.log('Usuario autenticado:', user);
        authWrapper.style.display = 'none';
        appContainer.style.display = 'block';
        
        // Limpiar formularios
        if (loginEmailInput) loginEmailInput.value = '';
        if (loginPasswordInput) loginPasswordInput.value = '';
        if (signupEmailInput) signupEmailInput.value = '';
        if (signupPasswordInput) signupPasswordInput.value = '';
        
        // Cargar tareas del usuario
        cargarTareas();
    } else {
        // Usuario no autenticado
        console.log('Usuario no autenticado');
        authWrapper.style.display = 'flex';
        appContainer.style.display = 'none';
    }
});
