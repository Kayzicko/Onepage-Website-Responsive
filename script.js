// ========== Burger-Menü Steuerung ==========
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  // Menü öffnen/schließen bei Klick auf Burger
  burger.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  // Menü schließen bei Klick auf Link (nur in mobiler Ansicht)
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// ========== Modalsteuerung ==========
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

// ========== Portfolio Detail-Steuerung ==========
document.addEventListener("DOMContentLoaded", () => {
  const karten = document.querySelectorAll(".portfolio-karte");
  const closeTimers = new Map();

  karten.forEach((karte) => {
    // Klick öffnet oder schließt (ideal für Touch-Geräte)
    karte.addEventListener("click", (e) => {
      e.stopPropagation();
      const istAktiv = karte.classList.contains("active");

      // Alle schließen
      karten.forEach((andere) => {
        andere.classList.remove("active");
        const timer = closeTimers.get(andere);
        if (timer) {
          clearTimeout(timer);
          closeTimers.delete(andere);
        }
      });

      // Nur öffnen, wenn nicht aktiv
      if (!istAktiv) {
        karte.classList.add("active");
      }
    });

    // Desktop: Mausverlassen → schließen
    karte.addEventListener("mouseleave", () => {
      const timer = setTimeout(() => {
        karte.classList.remove("active");
        closeTimers.delete(karte);
      }, 300);
      closeTimers.set(karte, timer);
    });

    // Desktop: Rückkehr → Timer abbrechen
    karte.addEventListener("mouseenter", () => {
      const timer = closeTimers.get(karte);
      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(karte);
      }
    });
  });
});

// ========== Dark-/Light-Mode Umschalten + Speichern ==========
const toggleBtn = document.getElementById("mode-toggle");
const body = document.body;

const gespeicherterModus = localStorage.getItem("design-modus");
if (gespeicherterModus === "light") {
  body.classList.add("light-mode");
  toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");

  const istLight = body.classList.contains("light-mode");
  toggleBtn.textContent = istLight ? "🌙" : "☀️";
  localStorage.setItem("design-modus", istLight ? "light" : "dark");
});

// Portfolio-Filter
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const karten = document.querySelectorAll(".portfolio-karte");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Aktiven Button visuell markieren
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      karten.forEach((karte) => {
        const kategorie = karte.getAttribute("data-kategorie");

        const sichtbar = filter === "alle" || filter === kategorie;

        // Sichtbarkeit steuern
        karte.style.display = sichtbar ? "block" : "none";

        // Animation resetten
        if (sichtbar) {
          karte.classList.remove("animate-in");
          void karte.offsetWidth; // ← Browser zwingt Repaint
          karte.classList.add("animate-in");
        }

        // Bei Wechsel: Details sicher schließen
        if (!sichtbar) {
          karte.classList.remove("active");
          karten.forEach((karte) => karte.classList.add("animate-in"));
        }
      });
    });
  });
});

      
// ========== Sichtbarkeits-Animation: Jedes Mal beim Reinscrollen ==========
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Wenn sichtbar → "visible" hinzufügen
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        // Wenn NICHT sichtbar → "visible" entfernen
        entry.target.classList.remove("visible");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

// Alle Elemente mit scroll-fade animieren
document.querySelectorAll(".scroll-fade").forEach((el) => {
  observer.observe(el);

  // Alle .scroll-fade-left-Elemente beobachten
document.querySelectorAll(".scroll-fade-left").forEach((el, index) => {
  // Optional: Verzögerung je nach Reihenfolge
  el.style.transitionDelay = `${index * 0.2}s`;
  observer.observe(el);
});
});

