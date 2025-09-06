// =========================
// Initial-Setup (CSS-Fallback steuern)
// =========================
document.documentElement.classList.add("js-enabled");

// =========================
// Burger-Menü
// =========================
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  const toggleNav = () => {
    const opened = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", opened ? "true" : "false");
  };

  burger.addEventListener("click", toggleNav);

  // Menü bei Link-Klick schließen (mobil)
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// =========================
// Modals (Impressum/Datenschutz)
// =========================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "block";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// Klick außerhalb schließt Modal
window.addEventListener("click", (event) => {
  ["modal-impressum", "modal-datenschutz"].forEach((id) => {
    const modal = document.getElementById(id);
    if (modal && event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// ESC-Taste schließt offenes Modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    ["modal-impressum", "modal-datenschutz"].forEach((id) => {
      const modal = document.getElementById(id);
      if (modal && modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

// =========================
// Portfolio: Detail-Toggle pro Karte
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const karten = document.querySelectorAll(".portfolio-karte");
  const closeTimers = new Map();

  karten.forEach((karte) => {
    karte.addEventListener("click", (e) => {
      e.stopPropagation();

      const warAktiv = karte.classList.contains("active");

      // Alle schließen
      karten.forEach((andere) => {
        andere.classList.remove("active");
        const timer = closeTimers.get(andere);
        if (timer) {
          clearTimeout(timer);
          closeTimers.delete(andere);
        }
      });

      // Diese öffnen, wenn sie vorher zu war
      if (!warAktiv) {
        karte.classList.add("active");
      }
    });

    karte.addEventListener("mouseleave", () => {
      const timer = setTimeout(() => {
        karte.classList.remove("active");
        closeTimers.delete(karte);
      }, 300);
      closeTimers.set(karte, timer);
    });

    karte.addEventListener("mouseenter", () => {
      const timer = closeTimers.get(karte);
      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(karte);
      }
    });
  });

  document.addEventListener("click", () => {
    karten.forEach((k) => k.classList.remove("active"));
  });
});

// =========================
// Portfolio-Filter
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const karten = document.querySelectorAll(".portfolio-karte");

  if (!filterButtons.length || !karten.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Aktiven Button markieren
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      karten.forEach((karte, idx) => {
        const kategorie = karte.getAttribute("data-kategorie");
        const sichtbar = filter === "alle" || filter === kategorie;

        karte.style.display = sichtbar ? "" : "none";

        if (sichtbar) {
          karte.classList.remove("animate-in");
          void karte.offsetWidth; // Reflow erzwingen
          karte.style.animationDelay = `${idx * 0.03}s`;
          karte.classList.add("animate-in");
        } else {
          karte.classList.remove("active");
        }
      });
    });
  });
});

// =========================
// Scroll-Animationen
// =========================
(function initScrollAnimations() {
  const fadeEls = document.querySelectorAll(".scroll-fade, .scroll-fade-left");

  if (!fadeEls.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const leftEls = document.querySelectorAll(".scroll-fade-left");
    leftEls.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.1}s`;
    });

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
