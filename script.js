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

  // Klick außerhalb schließt alle Karten
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

// =========================
// HERO Slideshow
// =========================
(function initHeroSlideshow() {
  const container = document.getElementById("hero-slides");
  if (!container) return;

  const slides = Array.from(container.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const dotsWrap = document.getElementById("slide-dots");

  let index = 0;
  let autoTimer = null;
  const AUTOPLAY_MS = 5000;

  // Dots erzeugen
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) =>
      d.setAttribute("aria-selected", i === index ? "true" : "false")
    );
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Controls
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause bei Hover/Fokus
  const slideshow = document.querySelector(".hero-slideshow");
  if (slideshow) {
    slideshow.addEventListener("mouseenter", stopAutoplay);
    slideshow.addEventListener("mouseleave", startAutoplay);
    slideshow.addEventListener("focusin", stopAutoplay);
    slideshow.addEventListener("focusout", startAutoplay);
  }

  // Tastatursteuerung (links/rechts)
  window.addEventListener("keydown", (e) => {
    if (!slideshow) return;
    const inView =
      slideshow.getBoundingClientRect().top < window.innerHeight &&
      slideshow.getBoundingClientRect().bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Initial
  render();
  startAutoplay();
})();

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioContent = document.querySelector(".portfolio-content");

  // Daten für jede Kategorie
  const data = {
    designs: [
      { img: "Journal-Bild-1.png", title: "Dankbarkeits-Journal", desc: "Ein täglicher Begleiter für Achtsamkeit & Fokus" },
      { img: "Journal-Bild-2.png", title: "Index", desc: "Übersicht aller Inhalte" },
      { img: "Journal-Bild-3.png", title: "Anleitung", desc: "So nutzt du das Journal" },
      { img: "Journal-Bild-4.png", title: "Woche 1", desc: "Deine tägliche Dankbarkeitsroutine" },
      { img: "Journal-Bild-5.png", title: "Monat 1 Übersicht", desc: "Fokus & Habit-Tracker" }
    ],
    shops: [
      { img: "Journal-Bild-1.png", title: "E-Book Beispiel", desc: "Ein tolles Shop-Produkt" }
    ],
    websites: [
      { img: "https://via.placeholder.com/600x400", title: "Website Projekt", desc: "Ein modernes Webdesign" }
    ]
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      const slides = data[filter];

      // Button active markieren
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (!slides) {
        portfolioContent.innerHTML = "<p>Keine Inhalte vorhanden.</p>";
        return;
      }

      // Slideshow-HTML generieren
      portfolioContent.innerHTML = `
        <div class="portfolio-slideshow">
          ${slides.map((s, i) => `
            <div class="portfolio-slide" style="display:${i===0?'block':'none'}">
              <img src="${s.img}" alt="${s.title}">
              <h3>${s.title}</h3>
              <p>${s.desc}</p>
            </div>
          `).join("")}
          <button class="portfolio-prev">‹</button>
          <button class="portfolio-next">›</button>
        </div>
      `;

      initSlideshow();
    });
  });

  function initSlideshow() {
    const slides = document.querySelectorAll(".portfolio-slide");
    const prev = document.querySelector(".portfolio-prev");
    const next = document.querySelector(".portfolio-next");
    let idx = 0;

    function showSlide(i) {
      slides.forEach((s, j) => s.style.display = j === i ? "block" : "none");
    }
    showSlide(idx);

    prev.addEventListener("click", () => {
      idx = (idx - 1 + slides.length) % slides.length;
      showSlide(idx);
    });
    next.addEventListener("click", () => {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    });
  }
});
