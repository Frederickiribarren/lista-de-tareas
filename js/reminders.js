// Funciones avanzadas para recordatorios de tareas
class TaskReminder {
    constructor() {
        this.reminders = new Map();
        this.init();
    }

    init() {
        // Cargar recordatorios guardados del localStorage
        this.loadReminders();
        
        // Verificar recordatorios cada minuto
        setInterval(() => {
            this.checkReminders();
        }, 60000);
    }

    // Guardar recordatorios en localStorage
    saveReminders() {
        const remindersArray = Array.from(this.reminders.entries());
        localStorage.setItem('taskReminders', JSON.stringify(remindersArray));
    }

    // Cargar recordatorios desde localStorage
    loadReminders() {
        const saved = localStorage.getItem('taskReminders');
        if (saved) {
            const remindersArray = JSON.parse(saved);
            this.reminders = new Map(remindersArray);
        }
    }

    // Agregar recordatorio para una tarea
    addReminder(taskId, taskText, reminderDate, reminderType = 'once') {
        const reminder = {
            taskId,
            taskText,
            reminderDate: new Date(reminderDate),
            reminderType, // 'once', 'daily', 'weekly'
            created: new Date(),
            triggered: false
        };

        this.reminders.set(taskId, reminder);
        this.saveReminders();

        if (window.notificationManager) {
            window.notificationManager.showSuccessMessage(
                `Recordatorio configurado para ${new Date(reminderDate).toLocaleString()}`
            );
        }
    }

    // Eliminar recordatorio
    removeReminder(taskId) {
        this.reminders.delete(taskId);
        this.saveReminders();
    }

    // Verificar y disparar recordatorios
    checkReminders() {
        const now = new Date();
        
        this.reminders.forEach((reminder, taskId) => {
            if (!reminder.triggered && now >= reminder.reminderDate) {
                this.triggerReminder(reminder);
                
                // Marcar como disparado o reprogramar según el tipo
                if (reminder.reminderType === 'once') {
                    reminder.triggered = true;
                } else if (reminder.reminderType === 'daily') {
                    // Reprogramar para el día siguiente
                    reminder.reminderDate.setDate(reminder.reminderDate.getDate() + 1);
                } else if (reminder.reminderType === 'weekly') {
                    // Reprogramar para la semana siguiente
                    reminder.reminderDate.setDate(reminder.reminderDate.getDate() + 7);
                }
            }
        });

        this.saveReminders();
    }

    // Disparar recordatorio
    triggerReminder(reminder) {
        if (window.notificationManager) {
            window.notificationManager.notifyReminder(reminder.taskText, reminder.reminderDate);
        }

        // También mostrar modal si la app está activa
        if (document.visibilityState === 'visible') {
            this.showReminderModal(reminder);
        }
    }

    // Mostrar modal de recordatorio
    showReminderModal(reminder) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '⏰ Recordatorio',
                text: `No olvides: "${reminder.taskText}"`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Marcar como completada',
                cancelButtonText: 'Recordar más tarde',
                confirmButtonColor: 'var(--color-primary)',
                cancelButtonColor: 'var(--color-text-secondary)'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí podrías integrar con el sistema de tareas para marcarla como completada
                    this.markTaskCompleted(reminder.taskId);
                } else if (result.isDismissed) {
                    // Reprogramar para 1 hora más tarde
                    this.snoozeReminder(reminder.taskId, 60);
                }
            });
        }
    }

    // Posponer recordatorio
    snoozeReminder(taskId, minutes) {
        const reminder = this.reminders.get(taskId);
        if (reminder) {
            reminder.reminderDate = new Date(Date.now() + minutes * 60000);
            reminder.triggered = false;
            this.saveReminders();
            
            if (window.notificationManager) {
                window.notificationManager.showInfoMessage(
                    `Recordatorio pospuesto por ${minutes} minutos`
                );
            }
        }
    }

    // Marcar tarea como completada (integración con el sistema principal)
    markTaskCompleted(taskId) {
        // Esta función debería integrarse con tu sistema principal de tareas
        // Por ahora solo removemos el recordatorio
        this.removeReminder(taskId);
        
        if (window.notificationManager) {
            window.notificationManager.showSuccessMessage('Tarea marcada como completada');
        }
    }

    // Obtener recordatorios activos
    getActiveReminders() {
        return Array.from(this.reminders.values()).filter(r => !r.triggered);
    }

    // Limpiar recordatorios antiguos y completados
    cleanupReminders() {
        const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás
        
        this.reminders.forEach((reminder, taskId) => {
            if (reminder.triggered && reminder.reminderDate < cutoffDate) {
                this.reminders.delete(taskId);
            }
        });
        
        this.saveReminders();
    }
}

// Función para agregar botón de recordatorio a las tareas existentes
function addReminderButtons() {
    const tareas = document.querySelectorAll('.tarea');
    
    tareas.forEach(tarea => {
        // Verificar si ya tiene botón de recordatorio
        if (tarea.querySelector('.reminder-btn')) return;
        
        const reminderBtn = document.createElement('button');
        reminderBtn.className = 'reminder-btn';
        reminderBtn.innerHTML = '⏰';
        reminderBtn.title = 'Configurar recordatorio';
        
        reminderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showReminderDialog(tarea.id, tarea.querySelector('p').textContent);
        });
        
        tarea.appendChild(reminderBtn);
    });
}

// Mostrar diálogo para configurar recordatorio
function showReminderDialog(taskId, taskText) {
    if (typeof Swal === 'undefined') return;
    
    const now = new Date();
    const defaultDate = new Date(now.getTime() + 60 * 60000); // 1 hora después
    const defaultDateString = defaultDate.toISOString().slice(0, 16);
    
    Swal.fire({
        title: 'Configurar Recordatorio',
        html: `
            <div style="text-align: left; margin: 20px 0;">
                <label for="reminder-date" style="display: block; margin-bottom: 8px; font-weight: 600;">
                    Fecha y hora del recordatorio:
                </label>
                <input 
                    type="datetime-local" 
                    id="reminder-date" 
                    value="${defaultDateString}"
                    min="${now.toISOString().slice(0, 16)}"
                    style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;"
                />
                
                <label for="reminder-type" style="display: block; margin: 16px 0 8px 0; font-weight: 600;">
                    Tipo de recordatorio:
                </label>
                <select 
                    id="reminder-type" 
                    style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;"
                >
                    <option value="once">Una vez</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                </select>
                
                <div style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 13px; color: #666;">
                    <strong>Tarea:</strong> "${taskText}"
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Configurar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'var(--color-primary)',
        cancelButtonColor: 'var(--color-text-secondary)',
        preConfirm: () => {
            const date = document.getElementById('reminder-date').value;
            const type = document.getElementById('reminder-type').value;
            
            if (!date) {
                Swal.showValidationMessage('Por favor, selecciona una fecha y hora');
                return false;
            }
            
            const reminderDate = new Date(date);
            if (reminderDate <= new Date()) {
                Swal.showValidationMessage('La fecha debe ser en el futuro');
                return false;
            }
            
            return { date: reminderDate, type };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.taskReminder.addReminder(
                taskId, 
                taskText, 
                result.value.date, 
                result.value.type
            );
        }
    });
}

// Inicializar sistema de recordatorios
document.addEventListener('DOMContentLoaded', () => {
    window.taskReminder = new TaskReminder();
    
    // Agregar botones de recordatorio a tareas existentes cada vez que se cargan
    const observer = new MutationObserver(() => {
        addReminderButtons();
    });
    
    // Observar cambios en las columnas de tareas
    const tareasContainers = document.querySelectorAll('.tareas-container');
    tareasContainers.forEach(container => {
        observer.observe(container, { childList: true, subtree: true });
    });
    
    // Agregar botones iniciales
    setTimeout(addReminderButtons, 1000);
});
