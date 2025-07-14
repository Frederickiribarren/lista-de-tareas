document.getElementById("btn-pdf").addEventListener("click", () => {
  const elemento = document.getElementById("contenido");

  html2pdf().set({
    margin: 10,
    filename: "lista_tarea.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  }).from(elemento).save();
});