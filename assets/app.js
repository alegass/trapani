(function () {
  // --- Precios y servicios ---
  const PRICES_VERSION = "2025-11-05";
  const pdfUrl = (id) => `pdfs/${id}.pdf?v=${encodeURIComponent(PRICES_VERSION)}`;

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
      <div class="row service-block gy-3 ${reverse ? "flex-lg-row-reverse" : ""}">
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
              <a class="btn btn-outline-light" href="#contacto">
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

  // Servicios (sólo en la página de servicios)
  const serviciosAlt = document.getElementById("serviciosAlt");
  if (serviciosAlt) {
    serviciosAlt.innerHTML = SERVICES.map((s, i) => block(s, i % 2 === 1)).join("");
  }

  // --- Reseñas de Google ---
  const PLACE_ID = "ChIJX9NCzEart5UR0U9ljTibiXQ";

  function buildStars(rating) {
    const r = Math.round(rating || 0);
    const filled = "★".repeat(r);
    const empty = "☆".repeat(5 - r);
    return filled + empty;
  }

  function initGoogleReviews() {
    const ratingEl = document.getElementById("google-rating");
    const countEl = document.getElementById("google-review-count");
    const starsEl = document.getElementById("google-rating-stars");
    const reviewsContainer = document.getElementById("google-reviews");

    // Si no estamos en el index (no existe la sección), no hacemos nada
    if (!reviewsContainer || !ratingEl) return;

    if (!window.google || !google.maps || !google.maps.places) {
      console.warn("Google Places no está disponible en esta página.");
      return;
    }

    const service = new google.maps.places.PlacesService(document.createElement("div"));

    service.getDetails(
      {
        placeId: PLACE_ID,
        fields: ["rating", "user_ratings_total", "reviews"],
      },
      function (place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          console.warn("No se pudieron obtener reseñas de Google:", status);
          return;
        }

        const rating = place.rating || 0;
        const total = place.user_ratings_total || 0;

        ratingEl.textContent = rating ? rating.toFixed(1) : "–";
        if (countEl) {
          countEl.textContent = total ? `(${total} reseñas)` : "";
        }
        if (starsEl) {
          starsEl.textContent = buildStars(rating);
        }

        const reviews = Array.isArray(place.reviews) ? place.reviews.slice(0, 3) : [];

        reviewsContainer.innerHTML = reviews
          .map((r) => {
            const name = r.author_name || "Usuario de Google";
            const text = r.text || "";
            const revRating = r.rating || 0;

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
      }
    );
  }

  // Esperamos a que cargue todo (incluyendo el script de Google)
  window.addEventListener("load", initGoogleReviews);
})();