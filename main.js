(function () {
  "use strict";

  document.documentElement.classList.add("js-loaded");

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const IS_MOBILE = window.matchMedia("(max-width: 768px)").matches;
  const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── LENIS ─── */
  let lenis = null;
  const LenisClass = window.Lenis || (typeof Lenis !== "undefined" ? Lenis : null);

  if (LenisClass && !IS_MOBILE) {
    lenis = new LenisClass({
      duration: 0.9,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
  }

  const scrollTo = (target, offset = -80) => {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  /* ─── CURSOR GLOW (desktop only) ─── */
  if (!IS_MOBILE) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let mx = -999, my = -999;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(() => {
      gsap.set(glow, { x: mx, y: my });
    });
  }

  /* ─── NAV SCROLL STATE ─── */
  const nav = document.getElementById("nav");
  if (nav) {
    ScrollTrigger.create({
      start: "top -8px",
      onUpdate(self) {
        nav.classList.toggle("scrolled", self.progress > 0);
      },
    });
  }

  /* ─── MOBILE MENU ─── */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("menu-open");
    if (lenis) lenis.stop();
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
    if (lenis) lenis.start();
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
    });

    mobileMenu.querySelector(".mobile-menu__backdrop")?.addEventListener("click", closeMenu);

    mobileMenu.querySelectorAll(".mm-link").forEach(link => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("open")) closeMenu();
  });

  /* ─── VIDEO ─── */
  function initScrollVideo() {
  const video = document.getElementById("heroVideo");
  const wrapper = document.getElementById("heroWrapper");

  if (!video || !wrapper) return;

  // configura autoplay
  video.muted = true;
  video.loop = true;
  video.setAttribute("playsinline", "");

  // garante autoplay
  video.play().catch(() => {});

 

  // controla quando aparece na tela
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.4 
    }

    
  );

  observer.observe(wrapper);
}

  /* ─── HERO ENTRANCE ANIMATION ─── */
  if (!PREFERS_REDUCED) {
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })
      .to(".hero__title", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.65")
      .to(".hero__sub", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .to(".hero__actions", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
      .to(".hero__scroll-hint", { opacity: 1, duration: 0.6 }, "-=0.2");
  } else {
    document.querySelectorAll(".hero__eyebrow, .hero__title, .hero__sub, .hero__actions, .hero__scroll-hint")
      .forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
  }

  /* ─── SCROLL REVEALS ─── */
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    if (PREFERS_REDUCED) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    ScrollTrigger.create({
      trigger: el,
      start: "top 87%",
      once: true,
      onEnter() {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: (i % 3) * 0.07,
          ease: "power3.out",
        });
      },
    });
  });

  /* ─── STATS COUNTER ─── */
  document.querySelectorAll(".stat__num[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";

    if (PREFERS_REDUCED) {
      el.textContent = target + suffix;
      return;
    }

    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate() {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      },
    });
  });

  /* ─── BENEFIT STAGGER ─── */
  if (!PREFERS_REDUCED) {
    ScrollTrigger.create({
      trigger: ".benefits__grid",
      start: "top 78%",
      once: true,
      onEnter() {
        gsap.from(".benefit", {
          opacity: 0, y: 36,
          duration: 0.8, stagger: 0.12,
          ease: "power3.out",
        });
      },
    });
  }

  /* ─── MODEL CARDS HOVER (home) ─── */
  document.querySelectorAll(".models__showcase .model-card").forEach(card => {
    const h3 = card.querySelector("h3");
    if (!h3) return;
    card.addEventListener("mouseenter", () => gsap.to(h3, { color: "#00ff88", duration: 0.25 }));
    card.addEventListener("mouseleave", () => gsap.to(h3, { color: "#ffffff", duration: 0.25 }));
  });

  /* ─── CTA GLOW PULSE ─── */
  const ctaBg = document.querySelector(".cta-final__bg");
  if (ctaBg && !PREFERS_REDUCED) {
    gsap.to(ctaBg, {
      scale: 1.18, opacity: 0.75,
      duration: 3.5, repeat: -1, yoyo: true,
      ease: "sine.inOut",
    });
  }

  /* ─── PARALLAX — benefits orb ─── */
  if (!IS_MOBILE && !PREFERS_REDUCED) {
    gsap.to(".benefits::after", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".benefits",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  /* ─── SMOOTH ANCHOR SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollTo(target);
    });
  });

  /* ─── LEAFLET MAP ─── */
  function initMap() {
    if (typeof L === "undefined") return;
    const mapEl = document.getElementById("map");
    if (!mapEl) return;

    const map = L.map("map", {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([-22.9, -43.37], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

   const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20S24 21 24 12C24 5.4 18.6 0 12 0z" fill="#00ff88"/>
  <circle cx="12" cy="12" r="5" fill="#000"/>
</svg>`;

    const icon = L.divIcon({
      html: pinSvg,
      className: "",
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });

    L.marker([-22.9245, -43.3742], { icon })
      .addTo(map)
      .bindPopup("<b style='font-family:sans-serif'>Taquara</b><br><small>Est. Rodrigues Caldas, 90</small>");

    L.marker([-22.8763, -43.3702], { icon })
      .addTo(map)
      .bindPopup("<b style='font-family:sans-serif'>Valqueire</b><br><small>Est. Intendente Magalhães, 800</small>");
  }

  initMap();

  ScrollTrigger.refresh();
})();

/*--- 3D TILT--- */

document.querySelectorAll(".model-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;

   card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

/* Testemunhas */

function initCarouselEffect() {
  const items = document.querySelectorAll(".carousel__item");

  function updateScale() {
    const center = window.innerWidth / 2;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;

      const distance = Math.abs(center - itemCenter);
      const scale = Math.max(0.85, 1 - distance / 800);

      item.style.transform = `scale(${scale})`;
      item.style.opacity = scale;
    });
  }

  document
    .getElementById("carousel")
    .addEventListener("scroll", updateScale);

  window.addEventListener("load", updateScale);
}

function autoCarousel() {
  const carousel = document.getElementById("carousel");
  let scrollAmount = 0;

  setInterval(() => {
    scrollAmount += 300;
    if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
      scrollAmount = 0;
    }
    carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
  }, 3000);
}

autoCarousel();
initCarouselEffect();