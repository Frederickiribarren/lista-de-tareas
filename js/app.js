document.getElementById('btn-agregar').addEventListener('click', function() {
    const valorTarea = document.getElementById('nuevaTarea').value;
    if (valorTarea) {
        crearTarea(valorTarea);
        document.getElementById('nuevaTarea').value = '';
    }
});

function crearTarea(texto) {
    const id = 'tarea-' + Date.now();
    const tarea = document.createElement('div');
    tarea.id = id;
    tarea.className = 'tarea';
    // No hacemos la tarea 'draggable' para el ratón, pero los eventos táctiles funcionarán
    
    // Eventos táctiles para móviles
    tarea.addEventListener('touchstart', touchStart, { passive: false });
    tarea.addEventListener('touchmove', touchMove, { passive: false });
    tarea.addEventListener('touchend', touchEnd);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = function() {
        cambiarEstado(this);
    };

    const parrafo = document.createElement('p');
    parrafo.textContent = texto;

    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.innerHTML = '&#10006;'; // Caracter de cruz (X)
    deleteIcon.style.display = 'none'; // Ocultar el icono por defecto
    deleteIcon.onclick = function() {
        borrarTarea(id);
    };

    tarea.appendChild(checkbox);
    tarea.appendChild(parrafo);
    tarea.appendChild(deleteIcon);

    document.getElementById('pendientes').appendChild(tarea);
}

function cambiarEstado(checkbox) {
    const tarea = checkbox.closest('.tarea');
    const columnaActual = tarea.parentElement;
    const deleteIcon = tarea.querySelector('.delete-icon');

    if (columnaActual.id === 'pendientes') {
        document.getElementById('en-progreso').appendChild(tarea);
        deleteIcon.style.display = 'none';
        checkbox.checked = false; // Limpiar el checkbox
    } else if (columnaActual.id === 'en-progreso') {
        document.getElementById('terminadas').appendChild(tarea);
        deleteIcon.style.display = 'inline';
        checkbox.style.display = 'none'; // Ocultar checkbox en 'Terminadas'
    }
}

function borrarTarea(id) {
    const tarea = document.getElementById(id);
    if (tarea) {
        tarea.remove();
    }
}

let draggedItem = null;

// --- Funciones para eventos táctiles (Móvil) ---

function touchStart(event) {
    if (event.target.closest('.tarea')) {
        // Prevenir el scroll de la página mientras se arrastra
        event.preventDefault();
        draggedItem = event.target.closest('.tarea');
        draggedItem.classList.add('dragging');
    }
}

function touchMove(event) {
    event.preventDefault();
    if (!draggedItem) return;

    const touch = event.targetTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (!elementUnder) return;

    const dropzone = elementUnder.closest('.tareas-container');
    if (dropzone) {
        // Lógica para previsualizar el drop si se desea
    }
}

function touchEnd(event) {
    if (!draggedItem) return;

    draggedItem.classList.remove('dragging');
    
    const touch = event.changedTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!elementUnder) {
        draggedItem = null;
        return;
    }

    const dropzone = elementUnder.closest('.tareas-container');
    if (dropzone) {
        dropzone.appendChild(draggedItem);
        // Mostrar u ocultar el icono de borrar y gestionar checkbox
        const deleteIcon = draggedItem.querySelector('.delete-icon');
        const checkbox = draggedItem.querySelector('input[type="checkbox"]');
        if (dropzone.id === 'terminadas') {
            deleteIcon.style.display = 'inline';
            if(checkbox) checkbox.style.display = 'none'; // Ocultar checkbox
        } else {
            deleteIcon.style.display = 'none';
            if(checkbox) {
                checkbox.style.display = 'inline'; // Asegurarse que el checkbox es visible
                checkbox.disabled = false;
                checkbox.checked = false; // Limpiar checkbox si no está en terminadas
            }
        }
    }
    
    draggedItem = null;
}
