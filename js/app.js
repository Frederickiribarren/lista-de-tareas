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
            snapshot.docChanges().forEach(change => {
                const tarea = change.doc.data();
                const id = change.doc.id;
                const tareaElemento = document.getElementById(id);

                if (change.type === 'added') {
                    // Solo renderizar si no existe ya en el DOM
                    if (!tareaElemento) {
                        renderizarTarea(id, tarea.texto, tarea.columna);
                    }
                }
                if (change.type === 'modified') {
                    // Si la tarea existe, la eliminamos y la volvemos a renderizar en su nueva posición
                    if (tareaElemento) {
                        tareaElemento.remove();
                    }
                    renderizarTarea(id, tarea.texto, tarea.columna);
                }
                if (change.type === 'removed') {
                    // Si la tarea existe, la eliminamos
                    if (tareaElemento) {
                        tareaElemento.remove();
                    }
                }
            });
        });
    };

    // Función para agregar una nueva tarea
    const agregarTarea = () => {
        let textoTarea = nuevaTareaInput.value.trim();
        if (textoTarea === '' || !tareasCollection) {
            return;
        }

        // Sanitización: Elimina cualquier etiqueta HTML para prevenir XSS almacenado.
        const sanitizedText = textoTarea.replace(/<[^>]*>?/gm, '');

        const nuevaTarea = {
            texto: sanitizedText,
            columna: 'pendientes' // Todas las tareas nuevas van a pendientes
        };

        tareasCollection.add(nuevaTarea)
            .then(() => {
                nuevaTareaInput.value = '';
            })
            .catch(error => console.error("Error al agregar tarea: ", error));
    };

    // Función para renderizar una tarea en el DOM
    const renderizarTarea = (id, texto, columnaId) => {
        const columna = document.getElementById(columnaId);
        if (!columna) return;

        const elementoTarea = document.createElement('div');
        elementoTarea.classList.add('tarea');
        elementoTarea.setAttribute('draggable', 'true');
        elementoTarea.id = id;

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
        
        // Lógica condicional para interacción
        if (isMobile) {
            elementoTarea.setAttribute('draggable', 'false');
            elementoTarea.addEventListener('click', () => mostrarOpcionesDeMovimiento(id, columnaId));
        } else {
            addDragEvents(elementoTarea);
        }
    };

    // Función para mostrar opciones de movimiento en móvil
    const mostrarOpcionesDeMovimiento = (id, columnaActual) => {
        const opciones = {
            'pendientes': 'Mover a Pendientes',
            'en-progreso': 'Mover a En Progreso',
            'terminadas': 'Mover a Terminadas'
        };
        delete opciones[columnaActual]; // Elimina la columna actual de las opciones

        // Genera el HTML para los botones de acción
        let buttonsHtml = '';
        for (const [columnaId, textoBoton] of Object.entries(opciones)) {
            buttonsHtml += `<button class="swal-move-button" data-columna="${columnaId}">${textoBoton}</button>`;
        }

        Swal.fire({
            title: 'Mover Tarea',
            html: `
                <p class="swal-text">Selecciona el nuevo estado para esta tarea:</p>
                <div class="swal-button-container">
                    ${buttonsHtml}
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                // Añade listeners a los botones personalizados
                const container = Swal.getHtmlContainer();
                container.querySelectorAll('.swal-move-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const nuevaColumnaId = button.dataset.columna;
                        if (tareasCollection) {
                            tareasCollection.doc(id).update({ columna: nuevaColumnaId });
                        }
                        Swal.close();
                    });
                });
            }
        });
    };

    // Función para eliminar una tarea
    const eliminarTarea = (id) => {
        if (!tareasCollection) return;
        
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
                
                // Actualizamos el documento en Firestore.
                // El listener onSnapshot se encargará de mover el elemento en la UI.
                if (tareasCollection) {
                    tareasCollection.doc(id).update({ columna: nuevaColumnaId });
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
