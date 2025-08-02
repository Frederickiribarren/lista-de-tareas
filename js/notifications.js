// Sistema de Notificaciones para Lista de Tareas
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    // Inicializar el sistema de notificaciones
    async init() {
        // Verificar soporte para notificaciones
        if (!('Notification' in window)) {
            console.log('Este navegador no soporta notificaciones');
            return;
        }

        // Verificar si ya tenemos permisos
        this.permission = Notification.permission;
        
        // Si no tenemos permisos, mostrar un botón para solicitarlos
        if (this.permission === 'default') {
            this.showPermissionRequest();
        }
    }

    // Mostrar solicitud de permisos de forma amigable
    showPermissionRequest() {
        const permissionBanner = document.createElement('div');
        permissionBanner.className = 'notification-permission-banner';
        permissionBanner.innerHTML = `
            <div class="permission-content">
                <span>🔔 Permite las notificaciones para recibir recordatorios de tus tareas</span>
                <button id="enable-notifications" class="btn-enable-notifications">Habilitar</button>
                <button id="dismiss-notifications" class="btn-dismiss-notifications">×</button>
            </div>
        `;

        document.body.appendChild(permissionBanner);

        // Event listeners para los botones
        document.getElementById('enable-notifications').addEventListener('click', () => {
            this.requestPermission();
            permissionBanner.remove();
        });

        document.getElementById('dismiss-notifications').addEventListener('click', () => {
            permissionBanner.remove();
        });
    }

    // Solicitar permisos de notificación
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                this.showSuccessMessage('¡Notificaciones habilitadas! Ahora recibirás recordatorios.');
                this.sendWelcomeNotification();
            } else {
                this.showErrorMessage('Sin notificaciones, no podrás recibir recordatorios.');
            }
        } catch (error) {
            console.error('Error al solicitar permisos:', error);
        }
    }

    // Enviar notificación de bienvenida
    sendWelcomeNotification() {
        this.sendNotification(
            'Lista de Tareas',
            '¡Notificaciones habilitadas! Te recordaremos sobre tus tareas.',
            'images/icon-192.png'
        );
    }

    // Enviar notificación básica
    sendNotification(title, body, icon = 'images/icon-192.png', tag = null) {
        if (this.permission !== 'granted') {
            console.log('Permisos de notificación no otorgados');
            return;
        }

        const options = {
            body: body,
            icon: icon,
            badge: 'images/icon-192.png',
            tag: tag,
            requireInteraction: false,
            silent: false
        };

        const notification = new Notification(title, options);

        // Auto cerrar después de 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Event listeners para la notificación
        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    }

    // Notificación cuando se agrega una tarea
    notifyTaskAdded(taskText) {
        this.sendNotification(
            'Nueva tarea agregada',
            `"${taskText}" se ha añadido a tus tareas pendientes`,
            'images/icon-192.png',
            'task-added'
        );
    }

    // Notificación cuando se completa una tarea
    notifyTaskCompleted(taskText) {
        this.sendNotification(
            '¡Tarea completada!',
            `Has terminado: "${taskText}"`,
            'images/icon-192.png',
            'task-completed'
        );
    }

    // Notificación cuando se elimina una tarea
    notifyTaskDeleted(taskText) {
        this.sendNotification(
            'Tarea eliminada',
            `"${taskText}" ha sido eliminada`,
            'images/icon-192.png',
            'task-deleted'
        );
    }

    // Notificación de recordatorio
    notifyReminder(taskText, reminderTime) {
        this.sendNotification(
            '⏰ Recordatorio de tarea',
            `No olvides: "${taskText}"`,
            'images/icon-192.png',
            'task-reminder'
        );
    }

    // Notificaciones en la interfaz (toast notifications)
    showToast(message, type = 'info', duration = 3000) {
        // Crear contenedor de toasts si no existe
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">×</button>
        `;

        // Agregar al contenedor
        toastContainer.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('toast-show'), 100);

        // Event listener para cerrar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });

        // Auto remover
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }

    // Remover toast con animación
    removeToast(toast) {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Obtener icono para toast según tipo
    getToastIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons['info'];
    }

    // Métodos de conveniencia para toasts
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showWarningMessage(message) {
        this.showToast(message, 'warning');
    }

    showInfoMessage(message) {
        this.showToast(message, 'info');
    }

    // Programar recordatorio para una tarea
    scheduleReminder(taskText, reminderDate) {
        const now = new Date().getTime();
        const reminderTime = new Date(reminderDate).getTime();
        const delay = reminderTime - now;

        if (delay > 0) {
            setTimeout(() => {
                this.notifyReminder(taskText, reminderDate);
            }, delay);
            
            this.showSuccessMessage(`Recordatorio programado para ${new Date(reminderDate).toLocaleString()}`);
        } else {
            this.showErrorMessage('La fecha del recordatorio debe ser en el futuro');
        }
    }

    // Verificar si las notificaciones están habilitadas
    areNotificationsEnabled() {
        return this.permission === 'granted';
    }
}

// Crear instancia global del manager de notificaciones
window.notificationManager = new NotificationManager();
