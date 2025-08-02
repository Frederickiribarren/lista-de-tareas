document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar');
    const nuevaTareaInput = document.getElementById('nuevaTarea');
    const columnas = document.querySelectorAll('.tareas-container');

    let userId = null;
    let tareasCollection;
    let unsubscribe; // Variable para guardar la función que detiene el listener
    const isMobile = window.matchMedia("(max-width: 768px)").matches; // Detección de móvil más robusta

    // Escuchar el evento de inicio de sesión desde auth.js
    window.addEventListener('user-logged-in', (event) => {
        userId = event.detail.userId;
        tareasCollection = db.collection('usuarios').doc(userId).collection('tareas');
        cargarTareas();
    });
    
    // Escuchar el evento de cierre de sesión
    auth.onAuthStateChanged(user => {
        if (!user && unsubscribe) {
            unsubscribe(); // Detener el listener de Firestore para evitar errores
            columnas.forEach(col => col.innerHTML = ''); // Limpiar la UI
        }
    });

    // Función para cargar tareas desde Firestore
    const cargarTareas = () => {
        if (!tareasCollection) return;

        // Limpiar columnas antes de empezar a escuchar
        columnas.forEach(col => col.innerHTML = '');

        // onSnapshot escucha cambios en tiempo real.
        unsubscribe = tareasCollection.onSnapshot(snapshot => {
            // Procesar todos los cambios
            snapshot.docChanges().forEach(change => {
                const tarea = change.doc.data();
                const id = change.doc.id;
                const tareaElemento = document.getElementById(id);

                if (change.type === 'added') {
                    // Solo renderizar si no existe ya en el DOM
                    if (!tareaElemento) {
                        renderizarTarea(id, tarea.texto, tarea.columna, tarea.fechaFinalizacion);
                    }
                }
                if (change.type === 'modified') {
                    // Si la tarea existe, la eliminamos y la volvemos a renderizar en su nueva posición
                    if (tareaElemento) {
                        tareaElemento.remove();
                    }
                    renderizarTarea(id, tarea.texto, tarea.columna, tarea.fechaFinalizacion);
                }
                if (change.type === 'removed') {
                    // Si la tarea existe, la eliminamos
                    if (tareaElemento) {
                        tareaElemento.remove();
                    }
                }
            });
            
            // Después de procesar todos los cambios, ordenar las tareas terminadas
            ordenarTareasTerminadas();
        });
    };

    // Función para agregar una nueva tarea
    const agregarTarea = () => {
        let textoTarea = nuevaTareaInput.value.trim();
        if (textoTarea === '' || !tareasCollection) {
            // Mostrar mensaje de error si el campo está vacío
            if (window.notificationManager) {
                window.notificationManager.showWarningMessage('Por favor, escribe una tarea antes de agregarla');
            }
            return;
        }

        // Sanitización: Elimina cualquier etiqueta HTML para prevenir XSS almacenado.
        const sanitizedText = textoTarea.replace(/<[^>]*>?/gm, '');

        const nuevaTarea = {
            texto: sanitizedText,
            columna: 'pendientes', // Todas las tareas nuevas van a pendientes
            fechaCreacion: new Date().toISOString(),
            fechaFinalizacion: null
        };

        tareasCollection.add(nuevaTarea)
            .then(() => {
                nuevaTareaInput.value = '';
                // Notificación de éxito
                if (window.notificationManager) {
                    window.notificationManager.showSuccessMessage('Tarea agregada exitosamente');
                    // Notificación push si están habilitadas
                    if (window.notificationManager.areNotificationsEnabled()) {
                        window.notificationManager.notifyTaskAdded(sanitizedText);
                    }
                }
            })
            .catch(error => {
                console.error("Error al agregar tarea: ", error);
                if (window.notificationManager) {
                    window.notificationManager.showErrorMessage('Error al agregar la tarea');
                }
            });
    };

    // Función para renderizar una tarea en el DOM
    const renderizarTarea = (id, texto, columnaId, fechaFinalizacion = null) => {
        const columna = document.getElementById(columnaId);
        if (!columna) return;

        const elementoTarea = document.createElement('div');
        elementoTarea.classList.add('tarea');
        elementoTarea.setAttribute('draggable', 'true');
        elementoTarea.id = id;
        
        // Agregar fecha de finalización como atributo para ordenar
        if (fechaFinalizacion) {
            elementoTarea.dataset.fechaFinalizacion = fechaFinalizacion;
        }

        const p = document.createElement('p');
        p.textContent = texto;
        elementoTarea.appendChild(p);

        // AQUÍ ESTÁ LA LÓGICA: Añadir icono de eliminar solo a las terminadas
        if (columnaId === 'terminadas') {
            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '✖';
            deleteIcon.classList.add('delete-icon');
            deleteIcon.onclick = (event) => {
                event.stopPropagation(); // Evita que el clic se propague a la tarea
                eliminarTarea(id);
            };
            elementoTarea.appendChild(deleteIcon);
        }

        columna.appendChild(elementoTarea);
        
        // Actualizar botones de recordatorio después de renderizar
        if (typeof addReminderButtons === 'function') {
            // Pequeño delay para asegurar que el DOM esté actualizado
            setTimeout(() => {
                addReminderButtons();
            }, 10);
        }
        
        // Lógica condicional para interacción
        if (isMobile) {
            elementoTarea.setAttribute('draggable', 'false');
            elementoTarea.addEventListener('click', () => mostrarOpcionesDeMovimiento(id, columnaId));
        } else {
            addDragEvents(elementoTarea);
        }
    };

    // Función para ordenar tareas terminadas por fecha de finalización (más recientes arriba)
    const ordenarTareasTerminadas = () => {
        const columnaTerminadas = document.getElementById('terminadas');
        if (!columnaTerminadas) return;

        const tareas = Array.from(columnaTerminadas.querySelectorAll('.tarea'));
        
        // Ordenar por fecha de finalización (más recientes primero)
        tareas.sort((a, b) => {
            const fechaA = a.dataset.fechaFinalizacion;
            const fechaB = b.dataset.fechaFinalizacion;
            
            if (!fechaA && !fechaB) return 0;
            if (!fechaA) return 1;
            if (!fechaB) return -1;
            
            return new Date(fechaB) - new Date(fechaA);
        });

        // Reordenar en el DOM
        tareas.forEach(tarea => {
            columnaTerminadas.appendChild(tarea);
        });
    };

    // Función para mostrar opciones de movimiento en móvil
    const mostrarOpcionesDeMovimiento = (id, columnaActual) => {
        const opciones = [
            { id: 'pendientes', texto: 'Mover a Pendientes', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' },
            { id: 'en-progreso', texto: 'Mover a En Progreso', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' },
            { id: 'terminadas', texto: 'Mover a Terminadas', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' }
        ];

        const opcionesFiltradas = opciones.filter(op => op.id !== columnaActual);

        let buttonsHtml = '';
        opcionesFiltradas.forEach(op => {
            buttonsHtml += `<button class="swal-move-button" data-columna="${op.id}">${op.icon}<span>${op.texto}</span></button>`;
        });

        Swal.fire({
            title: 'Mover Tarea',
            html: `<div class="swal-button-container">${buttonsHtml}</div>`,
            showConfirmButton: false,
            showCancelButton: false, // El cierre se maneja con el overlay
            customClass: {
                popup: 'swal-move-menu'
            },
            didOpen: () => {
                // Añade listeners a los botones personalizados una vez que el modal está abierto
                const container = Swal.getHtmlContainer();
                if (container) {
                    container.querySelectorAll('.swal-move-button').forEach(button => {
                        button.addEventListener('click', () => {
                            const nuevaColumnaId = button.dataset.columna;
                            const tareaElement = document.getElementById(id);
                            const tareaTexto = tareaElement ? tareaElement.querySelector('p').textContent : '';
                            const columnaAnteriorId = tareaElement ? tareaElement.parentElement.id : '';
                            
                            if (tareasCollection) {
                                // Preparar datos de actualización
                                const updateData = { columna: nuevaColumnaId };
                                
                                // Si se mueve a terminadas, agregar fecha de finalización
                                if (nuevaColumnaId === 'terminadas') {
                                    updateData.fechaFinalizacion = new Date().toISOString();
                                } else if (columnaAnteriorId === 'terminadas') {
                                    // Si se saca de terminadas, quitar fecha de finalización
                                    updateData.fechaFinalizacion = null;
                                }
                                
                                tareasCollection.doc(id).update(updateData)
                                .then(() => {
                                    // Notificar cuando se completa una tarea
                                    if (nuevaColumnaId === 'terminadas' && window.notificationManager) {
                                        window.notificationManager.showSuccessMessage('¡Tarea completada!');
                                        if (window.notificationManager.areNotificationsEnabled()) {
                                            window.notificationManager.notifyTaskCompleted(tareaTexto);
                                        }
                                    }
                                    
                                    // Manejar recordatorios cuando se mueve la tarea
                                    if (window.taskReminder) {
                                        window.taskReminder.removeReminderWhenTaskMoved(id, columnaAnteriorId, nuevaColumnaId);
                                    }
                                })
                                .catch(error => {
                                    console.error("Error al mover tarea: ", error);
                                    if (window.notificationManager) {
                                        window.notificationManager.showErrorMessage('Error al mover la tarea');
                                    }
                                });
                            }
                            Swal.close();
                        });
                    });
                }
            }
        });
    };

    // Función para eliminar una tarea
    const eliminarTarea = (id) => {
        if (!tareasCollection) return;
        
        // Obtener el texto de la tarea antes de eliminarla
        const tareaElement = document.getElementById(id);
        const tareaTexto = tareaElement ? tareaElement.querySelector('p').textContent : '';
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-danger)',
            cancelButtonColor: 'var(--color-text-secondary)',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                tareasCollection.doc(id).delete().then(() => {
                    Swal.fire({
                        title: '¡Eliminada!',
                        text: 'La tarea ha sido eliminada.',
                        icon: 'success',
                        confirmButtonColor: 'var(--color-primary)'
                    });
                    
                    // Eliminar recordatorio asociado si existe
                    if (window.taskReminder) {
                        window.taskReminder.removeReminder(id);
                    }
                    
                    // Notificación de tarea eliminada
                    if (window.notificationManager) {
                        window.notificationManager.showSuccessMessage('Tarea eliminada correctamente');
                        if (window.notificationManager.areNotificationsEnabled()) {
                            window.notificationManager.notifyTaskDeleted(tareaTexto);
                        }
                    }
                }).catch(error => {
                    console.error("Error al eliminar tarea: ", error);
                    if (window.notificationManager) {
                        window.notificationManager.showErrorMessage('Error al eliminar la tarea');
                    }
                });
            }
        });
    };

    // Lógica de arrastrar y soltar (Drag and Drop)
    let tareaArrastrada = null;

    const addDragEvents = (tarea) => {
        tarea.addEventListener('dragstart', () => {
            tareaArrastrada = tarea;
            setTimeout(() => tarea.classList.add('dragging'), 0);
        });

        tarea.addEventListener('dragend', () => {
            tarea.classList.remove('dragging');
        });
    };

    columnas.forEach(columna => {
        columna.addEventListener('dragover', e => {
            e.preventDefault();
        });

        columna.addEventListener('drop', e => {
            e.preventDefault();
            if (tareaArrastrada) {
                const id = tareaArrastrada.id;
                const nuevaColumnaId = columna.id;
                const tareaTexto = tareaArrastrada.querySelector('p').textContent;
                const columnaAnteriorId = tareaArrastrada.parentElement.id;
                
                // Actualizamos el documento en Firestore.
                // El listener onSnapshot se encargará de mover el elemento en la UI.
                if (tareasCollection) {
                    // Preparar datos de actualización
                    const updateData = { columna: nuevaColumnaId };
                    
                    // Si se mueve a terminadas, agregar fecha de finalización
                    if (nuevaColumnaId === 'terminadas') {
                        updateData.fechaFinalizacion = new Date().toISOString();
                    } else if (columnaAnteriorId === 'terminadas') {
                        // Si se saca de terminadas, quitar fecha de finalización
                        updateData.fechaFinalizacion = null;
                    }
                    
                    tareasCollection.doc(id).update(updateData)
                    .then(() => {
                        // Notificar cuando se completa una tarea por drag & drop
                        if (nuevaColumnaId === 'terminadas' && columnaAnteriorId !== 'terminadas' && window.notificationManager) {
                            window.notificationManager.showSuccessMessage('¡Tarea completada!');
                            if (window.notificationManager.areNotificationsEnabled()) {
                                window.notificationManager.notifyTaskCompleted(tareaTexto);
                            }
                        }
                        
                        // Manejar recordatorios cuando se mueve la tarea por drag & drop
                        if (window.taskReminder) {
                            window.taskReminder.removeReminderWhenTaskMoved(id, columnaAnteriorId, nuevaColumnaId);
                        }
                    })
                    .catch(error => {
                        console.error("Error al mover tarea: ", error);
                        if (window.notificationManager) {
                            window.notificationManager.showErrorMessage('Error al mover la tarea');
                        }
                    });
                }
            }
        });
    });

    btnAgregar.addEventListener('click', agregarTarea);
    nuevaTareaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarTarea();
        }
    });
});

