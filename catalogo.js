(function () {
  "use strict";

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* ─── Lenis ─── */
  let lenis = null;
  const LenisClass = window.Lenis || (typeof Lenis !== "undefined" ? Lenis : null);
  if (LenisClass) {
    lenis = new LenisClass({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
  }

  /* ─── Nav ─── */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (lenis) lenis.start();
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => mobileMenu.classList.contains("open") ? closeMenu() : openMenu());
    mobileMenu.querySelector(".mobile-menu__backdrop")?.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll(".mm-link").forEach(l => l.addEventListener("click", closeMenu));
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ─── Scroll reveals ─── */
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter() {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.85, delay: i * 0.08, ease: "power3.out" });
      },
    });
  });

  /* ─── CATALOG DATA ─── */
  const PRODUCTS_PER_PAGE = 6;

  const GRADIENTS = [
    "linear-gradient(135deg,#0a0a0a,#1a1a1a,#0f1a0f)",
    "linear-gradient(135deg,#000,#0a1a0a,#0a0a0a)",
    "linear-gradient(135deg,#0a0a0a,#141414,#0f180f)",
    "linear-gradient(135deg,#050505,#0d1a0d,#050505)",
    "linear-gradient(135deg,#0a0a0a,#1a1400,#0a0a0a)",
    "linear-gradient(135deg,#0d0d0d,#001a0d,#0d0d0d)",
  ];

  const products = [
    { name: "GreenMotors Urban",   badge: "Mais Vendido",    featured: false, specs: ["80 km", "45 km/h", "Fat Tire"],         desc: "Compacta, ágil e silenciosa. Feita para a rotina da cidade sem abrir mão do charme." },
    { name: "GreenMotors Beast",   badge: "Premium",         featured: true,  specs: ["120 km", "70 km/h", "Chopper Frame"],   desc: "A chopper elétrica que redefine presença. Power e brutalidade sustentável." },
    { name: "GreenMotors Cargo",   badge: "Novo",            featured: false, specs: ["100 km", "55 km/h", "Bagageiro"],       desc: "Para quem trabalha e não tolera paradas. Bateria estendida e praticidade máxima." },
    { name: "GreenMotors Shadow",  badge: "Ed. Limitada",    featured: true,  specs: ["110 km", "65 km/h", "Fat Tire"],        desc: "Acabamento fosco e painel OLED. Para quem prefere ser visto sem ser notado." },
    { name: "GreenMotors Scout",   badge: "Off-Road",        featured: false, specs: ["90 km", "50 km/h", "All Terrain"],      desc: "Pneus largos e suspensão reforçada para quem leva a mobilidade a sério." },
    { name: "GreenMotors Volt S",  badge: "Sport",           featured: false, specs: ["95 km", "75 km/h", "Esportiva"],        desc: "A versão de alta performance. Zero a 60 em 4 segundos." },
    { name: "GreenMotors Eco",     badge: "Acessível",       featured: false, specs: ["70 km", "40 km/h", "Compacta"],         desc: "Entrada premium. Sem abrir mão do design, com o menor custo por km." },
    { name: "GreenMotors Courier", badge: "Delivery",        featured: false, specs: ["110 km", "55 km/h", "Duplo Bagag."],    desc: "Dois bagageiros integrados. Solução definitiva para delivery urbano." },
    { name: "GreenMotors Titan",   badge: "Heavy Duty",      featured: true,  specs: ["130 km", "70 km/h", "Reforçada"],       desc: "Estrutura reforçada para carga extra. Capacidade 200 kg com motor duplo." },
    { name: "GreenMotors Air",     badge: "Ultraleve",       featured: false, specs: ["85 km", "50 km/h", "Alumínio"],         desc: "Chassi de alumínio aeronáutico. A mais leve da linha com 58 kg." },
    { name: "GreenMotors Night",   badge: "Novo",            featured: false, specs: ["95 km", "60 km/h", "LED 360°"],         desc: "Sistema de iluminação 360° com sensores de obstáculos integrados." },
    { name: "GreenMotors Retro",   badge: "Clássico",        featured: true,  specs: ["80 km", "45 km/h", "Vintage Frame"],    desc: "Tecnologia elétrica com alma retrô. Design anos 60, zero emissão." },
    { name: "GreenMotors Storm",   badge: "Off-Road",        featured: false, specs: ["100 km", "55 km/h", "Suspensão Longa"], desc: "Para trilhas urbanas e estradas de terra. Sem limite de terreno." },
    { name: "GreenMotors Max",     badge: "Autonomia+",      featured: false, specs: ["160 km", "60 km/h", "Dual Battery"],    desc: "Bateria dupla com carregamento rápido — 80% em 40 minutos." },
    { name: "GreenMotors Mini",    badge: "Compacta",        featured: false, specs: ["60 km", "35 km/h", "Mini Frame"],       desc: "Para a última milha. Cabe no elevador, carrega na tomada 110V." },
    { name: "GreenMotors Pro X",   badge: "Premium",         featured: true,  specs: ["140 km", "80 km/h", "Full Carbon"],     desc: "Estrutura em fibra de carbono. A scooter mais rápida da linha." },
    { name: "GreenMotors Fleet",   badge: "Corporativo",     featured: false, specs: ["100 km", "55 km/h", "Telemetria"],      desc: "Gestão de frota via app com telemetria, rastreamento e controle." },
    { name: "GreenMotors Zen",     badge: "Silenciosa",      featured: false, specs: ["90 km", "50 km/h", "Noise Free"],       desc: "Motor ultrassilencioso com isolamento acústico avançado. 12 dB." },
    { name: "GreenMotors Rally",   badge: "Esportivo",       featured: true,  specs: ["115 km", "85 km/h", "Race Frame"],      desc: "Design de pista com homologação urbana. Para vencer no asfalto." },
    { name: "GreenMotors Solar",   badge: "Inovação",        featured: false, specs: ["100 km+", "55 km/h", "Solar Panel"],    desc: "Painel solar integrado recarrega até 20 km/dia em exposição direta." },
  ];

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  let currentPage = 1;

  const grid = document.getElementById("catalogGrid");
  const paginationEl = document.getElementById("pagination");

  function buildCard(product, idx) {
    const grad = GRADIENTS[idx % GRADIENTS.length];
    const short = product.name.replace("GreenMotors ", "");
    const btn = product.featured ? "btn--primary" : "btn--outline";
    const badgeClass = product.featured ? "model-card__badge--green" : "";
    const cardClass = product.featured ? "model-card model-card--featured" : "model-card";
    const specsHtml = product.specs.map(s => `<span>${s}</span>`).join("");

    return `
      <article class="${cardClass}">
        <div class="model-card__badge ${badgeClass}">${product.badge}</div>
        <div class="model-card__img-wrap">
          <div class="model-card__img" style="background:${grad}">
            <span class="model-card__img-label">${short}</span>
          </div>
        </div>
        <div class="model-card__info">
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <div class="model-card__specs">${specsHtml}</div>
          <a href="index.html#contato" class="btn ${btn}">Ver Detalhes</a>
        </div>
      </article>`;
  }

  function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const slice = products.slice(start, start + PRODUCTS_PER_PAGE);

    grid.innerHTML = slice.map((p, i) => buildCard(p, start + i)).join("");

    const cards = grid.querySelectorAll(".model-card");
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add("visible"), i * 80);
    });

    cards.forEach(card => {
      const h3 = card.querySelector("h3");
      if (!h3) return;
      card.addEventListener("mouseenter", () => gsap.to(h3, { color: "#00ff88", duration: 0.25 }));
      card.addEventListener("mouseleave", () => gsap.to(h3, { color: "#ffffff", duration: 0.25 }));
    });

    renderPagination();
  }

  function renderPagination() {
    const arrowL = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const arrowR = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    let html = `<button class="pagination__btn pagination__arrow" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Anterior">${arrowL}</button>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination__btn ${i === currentPage ? "active" : ""}" data-page="${i}" aria-label="Página ${i}" aria-current="${i === currentPage}">${i}</button>`;
    }

    html += `<button class="pagination__btn pagination__arrow" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Próxima">${arrowR}</button>`;

    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll(".pagination__btn:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        if (page === currentPage || isNaN(page)) return;

        renderPage(page);

        const top = document.querySelector(".catalog-body").getBoundingClientRect().top + window.scrollY - 100;
        if (lenis) {
          lenis.scrollTo(top, { duration: 1 });
        } else {
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }

  const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log(id); // urban, beast, cargo

  renderPage(1);
  ScrollTrigger.refresh();
})();