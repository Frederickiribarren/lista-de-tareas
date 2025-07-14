const ingresar = document.getElementById("nuevaTarea");
const agregar = document.getElementById("btn-agregar");
const lista = document.getElementById("listaTareas1");
const lista2 = document.getElementById("listaTareas2");
const lista3 = document.getElementById("listaTareas3");

agregar.addEventListener("click", function ingreso() {
  const textoIngresar = ingresar.value.trim();
  if (textoIngresar === "") {
    alert("Texto vacio");
  } else {
    agregarTarea(textoIngresar);
  }
});

function agregarTarea(texto) {
  const nuevaTarea = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("inputCheckbox");

  checkbox.addEventListener('change', MoverTarea)

  nuevaTarea.appendChild(checkbox);

  const textoSpan = document.createElement("span");
  textoSpan.textContent = texto;
  nuevaTarea.appendChild(textoSpan);

  lista.appendChild(nuevaTarea);

  ingresar.value = "";
}

function MoverTarea(event) {
    const checkbox = event.target;
    const tarea = checkbox.parentElement;
    const listaActual = tarea.parentElement;

    if (checkbox.checked) {

        if (listaActual.id === 'listaTareas1') {
            lista2.appendChild(tarea);
        } else if (listaActual.id === 'listaTareas2') {
            checkbox.remove(); 
            lista3.appendChild(tarea);

        }

        checkbox.checked = false;
    }
}