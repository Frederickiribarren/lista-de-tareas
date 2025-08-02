/**
 * Utilidades para mejorar la experiencia móvil
 * Maneja el teclado virtual y posicionamiento de modales
 */

class MobileUtils {
    constructor() {
        this.initialViewportHeight = window.innerHeight;
        this.isKeyboardVisible = false;
        this.init();
    }

    init() {
        this.detectKeyboard();
        this.setupSweetAlertConfig();
    }

    /**
     * Detecta cuando aparece/desaparece el teclado virtual
     */
    detectKeyboard() {
        const threshold = 150; // pixels

        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = this.initialViewportHeight - currentHeight;

            if (heightDifference > threshold && !this.isKeyboardVisible) {
                this.isKeyboardVisible = true;
                this.onKeyboardShow();
            } else if (heightDifference <= threshold && this.isKeyboardVisible) {
                this.isKeyboardVisible = false;
                this.onKeyboardHide();
            }
        });

        // También detectar usando visualViewport si está disponible
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                const heightDifference = window.innerHeight - window.visualViewport.height;
                
                if (heightDifference > threshold && !this.isKeyboardVisible) {
                    this.isKeyboardVisible = true;
                    this.onKeyboardShow();
                } else if (heightDifference <= threshold && this.isKeyboardVisible) {
                    this.isKeyboardVisible = false;
                    this.onKeyboardHide();
                }
            });
        }
    }

    /**
     * Cuando aparece el teclado
     */
    onKeyboardShow() {
        document.body.classList.add('keyboard-visible');
        
        // Ajustar SweetAlert si está abierto
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
            swalContainer.classList.add('keyboard-visible');
            this.adjustSweetAlertPosition();
        }
    }

    /**
     * Cuando se oculta el teclado
     */
    onKeyboardHide() {
        document.body.classList.remove('keyboard-visible');
        
        // Restaurar SweetAlert si está abierto
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
            swalContainer.classList.remove('keyboard-visible');
        }
    }

    /**
     * Ajusta la posición de SweetAlert cuando aparece el teclado
     */
    adjustSweetAlertPosition() {
        const swalPopup = document.querySelector('.swal2-popup');
        if (!swalPopup) return;

        // Scroll al popup si es necesario
        setTimeout(() => {
            const rect = swalPopup.getBoundingClientRect();
            const visibleHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            
            if (rect.bottom > visibleHeight) {
                swalPopup.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }
        }, 100);
    }

    /**
     * Configuración global para SweetAlert2
     */
    setupSweetAlertConfig() {
        // Configuración por defecto para móviles
        if (window.Swal) {
            const originalFire = window.Swal.fire;
            
            window.Swal.fire = function(options) {
                // Si es móvil, aplicar configuraciones específicas
                if (window.innerWidth <= 768) {
                    const mobileOptions = {
                        ...options,
                        position: 'top',
                        grow: false,
                        width: 'auto',
                        customClass: {
                            container: 'swal2-mobile-container',
                            popup: 'swal2-mobile-popup',
                            ...options.customClass
                        },
                        didOpen: (popup) => {
                            // Ejecutar callback original si existe
                            if (options.didOpen) {
                                options.didOpen(popup);
                            }
                            
                            // Configuraciones adicionales para móvil
                            this.configureMobileModal(popup);
                        }
                    };
                    
                    return originalFire.call(this, mobileOptions);
                }
                
                return originalFire.call(this, options);
            }.bind(this);
        }
    }

    /**
     * Configura el modal para móvil
     */
    configureMobileModal(popup) {
        // Evitar zoom en iOS al hacer focus en inputs
        const inputs = popup.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.fontSize = '16px';
            
            input.addEventListener('focus', () => {
                // Scroll suave al input
                setTimeout(() => {
                    input.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center'
                    });
                }, 100);
            });
        });

        // Manejar el scroll del body
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        // Restaurar cuando se cierre
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('swal2-container')) {
                            document.body.style.overflow = originalOverflow;
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true });
    }
}

// Configuraciones específicas para diferentes tipos de modal
window.SweetAlertMobile = {
    /**
     * Modal de login optimizado para móvil
     */
    loginModal: () => {
        return {
            title: 'Iniciar Sesión',
            html: `
                <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico" style="font-size: 16px;">
                <input type="password" id="password" class="swal2-input" placeholder="Contraseña" style="font-size: 16px;">
            `,
            showCancelButton: true,
            confirmButtonText: 'Iniciar Sesión',
            cancelButtonText: 'Cancelar',
            position: window.innerWidth <= 768 ? 'top' : 'center',
            customClass: {
                container: 'swal2-mobile-friendly'
            },
            didOpen: () => {
                // Focus en el primer input después de un pequeño delay
                setTimeout(() => {
                    document.getElementById('email').focus();
                }, 100);
            }
        };
    },

    /**
     * Modal de registro optimizado para móvil
     */
    signupModal: () => {
        return {
            title: 'Crear Cuenta',
            html: `
                <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico" style="font-size: 16px;">
                <input type="password" id="password" class="swal2-input" placeholder="Contraseña" style="font-size: 16px;">
                <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña" style="font-size: 16px;">
            `,
            showCancelButton: true,
            confirmButtonText: 'Crear Cuenta',
            cancelButtonText: 'Cancelar',
            position: window.innerWidth <= 768 ? 'top' : 'center',
            customClass: {
                container: 'swal2-mobile-friendly'
            },
            didOpen: () => {
                setTimeout(() => {
                    document.getElementById('email').focus();
                }, 100);
            }
        };
    },

    /**
     * Modal de cambio de contraseña (ya optimizado)
     */
    forgotPasswordModal: () => {
        return {
            title: 'Recuperar Contraseña',
            text: 'Ingresa tu correo electrónico para recibir un enlace de recuperación',
            input: 'email',
            inputPlaceholder: 'Correo electrónico',
            inputAttributes: {
                style: 'font-size: 16px;'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            position: 'top', // Ya está optimizado
            customClass: {
                container: 'swal2-mobile-friendly'
            }
        };
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileUtils();
    });
} else {
    new MobileUtils();
}
