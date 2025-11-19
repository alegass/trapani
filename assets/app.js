(function () {
  const PRICES_VERSION = "2025-11-05";
  const pdfUrl = (id) => `pdfs/${id}.pdf?v=${encodeURIComponent(PRICES_VERSION)}`;

  // Lo dejamos listo para futuras páginas de servicios
  const SERVICES = [
    {
      id: "peinados",
      nombre: "Peinados",
      desc: "Peinados para eventos y ocasiones especiales.",
      img: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "cortes",
      nombre: "Cortes",
      desc: "Cortes clásicos y modernos para todos los estilos.",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "lavado",
      nombre: "Lavado",
      desc: "Lavado + masaje capilar con productos profesionales.",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "coloracion",
      nombre: "Coloración",
      desc: "Técnicas de color, iluminación y corrección de color.",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  function block({ nombre, desc, img, id }, reverse) {
    return `
      <div class="row service-block gy-3 fade-section ${reverse ? "flex-lg-row-reverse" : ""}">
        <div class="col-lg-6">
          <img class="w-100 rounded-4 shadow" loading="lazy" alt="${nombre}" src="${img}" />
        </div>
        <div class="col-lg-6 d-flex">
          <div class="my-auto">
            <h3 class="h2">${nombre}</h3>
            <p class="mb-3">${desc}</p>
            <div class="d-flex gap-2">
              <a class="btn btn-brand" target="_blank" rel="noopener" href="${pdfUrl(id)}">
                <i class="bi bi-filetype-pdf me-2"></i>Más información
              </a>
              <a class="btn btn-outline-light" href="https://web.bewe.co/trapani/services">
                <i class="bi bi-calendar2-check me-2"></i>Reservar turno
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

  // Año del footer
  const yearSpan = document.getElementById("y");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Sólo si en la página existe el contenedor de servicios
  const serviciosAlt = document.getElementById("serviciosAlt");
  if (serviciosAlt) {
    serviciosAlt.innerHTML = SERVICES.map((s, i) => block(s, i % 2 === 1)).join("");
  }

  // Animaciones al hacer scroll para las secciones con .fade-section
  const animatedSections = document.querySelectorAll(".fade-section");
  if (animatedSections.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      animatedSections.forEach((el) => observer.observe(el));
    } else {
      // Fallback: si el navegador es viejo, las mostramos directamente
      animatedSections.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // ======================================================
  //   RESEÑAS DE GOOGLE (Places API v1)
  // ======================================================
  const PLACE_ID = "ChIJX9NCzEart5UR0U9ljTibiXQ";
  // ⚠️ IMPORTANTE: reemplazá este valor por tu API key real
  const GOOGLE_API_KEY = "AIzaSyCJOXtyfqM8_8Pp3nFKZ0ftJLtj_Nus9IQ";

  function buildStars(rating) {
    const r = Math.round(rating || 0);
    const filled = "★".repeat(r);
    const empty = "☆".repeat(5 - r);
    return filled + empty;
  }

  async function loadGoogleReviews() {
    const ratingEl = document.getElementById("google-rating");
    const countEl = document.getElementById("google-review-count");
    const starsEl = document.getElementById("google-rating-stars");
    const container = document.getElementById("google-reviews");

    // Si no estamos en el index (no existe la sección), salimos
    if (!ratingEl || !container) return;

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "TU_API_KEY_AQUI") {
      console.warn("Google Reviews: falta configurar GOOGLE_API_KEY en app.js");
      return;
    }

    try {
      const endpoint = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
      const response = await fetch(endpoint, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews"
        }
      });

      if (!response.ok) {
        console.warn("Google Reviews: respuesta no OK", response.status);
        return;
      }

      const data = await response.json();

      const rating = data.rating || 0;
      const total = data.userRatingCount || 0;
      const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 3) : [];

      ratingEl.textContent = rating ? rating.toFixed(1) : "–";
      if (countEl) countEl.textContent = total ? `(${total} reseñas)` : "";
      if (starsEl) starsEl.textContent = buildStars(rating);

      container.innerHTML = reviews
        .map((r) => {
          const authorAttr = r.authorAttribution || {};
          const name = authorAttr.displayName || "Usuario de Google";
          const revRating = r.rating || 0;
          const textObj = r.text || {};
          const text = textObj.text || "";

          return `
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body d-flex flex-column">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="fw-semibold small">${name}</div>
                    <div class="small text-warning">
                      ${buildStars(revRating)}
                    </div>
                  </div>
                  <p class="small mb-0 flex-grow-1">"${text}"</p>
                </div>
              </div>
            </div>`;
        })
        .join("");
    } catch (err) {
      console.error("Google Reviews: error al cargar reseñas", err);
    }
  }

  // Llamamos cuando termine de cargar todo (HTML + recursos)
  window.addEventListener("load", loadGoogleReviews);
})();