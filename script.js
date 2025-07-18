// Burger-Menü Steuerung
document.getElementById("burger").addEventListener("click", function () {
  document.getElementById("nav").classList.toggle("open");
});

// Modalsteuerung
function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = function (event) {
  ["modal-impressum", "modal-datenschutz"].forEach((id) => {
    const modal = document.getElementById(id);
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
