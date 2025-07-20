// Burger-Menü Steuerung
const burger = document.getElementById("burger");
if (burger) {
  burger.addEventListener("click", function () {
    document.getElementById("nav").classList.toggle("open");
  });
}

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

// Portfolio Detail-Steuerung
document.addEventListener("DOMContentLoaded", () => {
  const karten = document.querySelectorAll(".portfolio-karte");

  // Globale Timer-Liste
  let closeTimers = new Map();

  karten.forEach((karte) => {
    // Klick: Nur diese Karte öffnen, andere schließen
    karte.addEventListener("click", (e) => {
      e.stopPropagation();

      // Abbrechen, wenn diese Karte bereits aktiv ist
      if (karte.classList.contains("active")) return;

      // Alle anderen Karten schließen + Timer abbrechen
      karten.forEach((andere) => {
        if (andere !== karte) {
          andere.classList.remove("active");

          const otherTimer = closeTimers.get(andere);
          if (otherTimer) {
            clearTimeout(otherTimer);
            closeTimers.delete(andere);
          }
        }
      });

      // Aktuelle Karte aktivieren
      karte.classList.add("active");
    });

    // Maus verlässt Karte → nach 300ms schließen
    karte.addEventListener("mouseleave", () => {
      const timer = setTimeout(() => {
        karte.classList.remove("active");
        closeTimers.delete(karte);
      }, 300);
      closeTimers.set(karte, timer);
    });

    // Maus kehrt zurück → Schließen abbrechen
    karte.addEventListener("mouseenter", () => {
      const timer = closeTimers.get(karte);
      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(karte);
      }
    });
  });
});
