// Volta ao topo sempre que a página recarregar
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));



(function () {
  "use strict";

  /* ─── CONFIG ─── */
  const IS_MOBILE = window.matchMedia("(max-width: 768px)").matches;
  const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js-loaded");

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* ─── LENIS ─── */
  let lenis = null;

  if (typeof Lenis !== "undefined" && !IS_MOBILE) {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    gsap.ticker.add(time => lenis.raf(time * 1000));
    lenis.on("scroll", ScrollTrigger.update);
  }

  const scrollTo = (target) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  };

  


  /* ─── ANIMAÇÕES ─── */
  // Usei window.onload para garantir que imagens e fontes carregaram antes de animar
  window.addEventListener("load", () => {
    document.documentElement.classList.add("js-loaded");

    // Reveal das Seções
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          }
        }
      );
    });

    // Hero Timeline
    const tl = gsap.timeline();
    tl.to(".hero__title, .hero__sub, .hero__actions", {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out"
    });
    
    ScrollTrigger.refresh();
  });

  /* ─── CURSOR PERSONALIZADO (desktop only) ─── */
  if (!IS_MOBILE) {
   // Cria os elementos do cursor
   const cursorDot = document.createElement("div");
   cursorDot.className = "cursor-dot";
   const cursorRing = document.createElement("div");
   cursorRing.className = "cursor-ring";
   document.body.appendChild(cursorDot);
   document.body.appendChild(cursorRing);
  
   // Injetar CSS do cursor via JS para não precisar alterar o style.css
   const cursorStyle = document.createElement("style");
   cursorStyle.textContent = `
     body { cursor: none !important; }
     a, button, [role="button"], .model-card, .btn, .nav__links a, .mm-link {
       cursor: none !important;
     }
     .cursor-dot {
       position: fixed;
       top: 0; left: 0;
       width: 8px; height: 8px;
       background: #00ff88;
       border-radius: 50%;
       pointer-events: none;
       z-index: 99999;
       transform: translate(-50%, -50%);
       transition: transform 0.08s ease, width 0.25s ease, height 0.25s ease, background 0.25s ease;
       will-change: transform;
       
     }
     .cursor-ring {
       position: fixed;
       top: 0; left: 0;
       width: 36px; height: 36px;
       border: 1.5px solid rgba(0,255,136,0.5);
       border-radius: 50%;
       pointer-events: none;
       z-index: 99998;
       transform: translate(-50%, -50%);
       transition: width 0.35s ease, height 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
       will-change: transform;
     }
     .cursor-dot.is-hovering {
       width: 12px; height: 12px;
       background: #00ff88;
     }
     .cursor-ring.is-hovering {
       width: 56px; height: 56px;
       border-color: rgba(0,255,136,0.8);
     }
     .cursor-dot.is-clicking {
       transform: translate(-50%, -50%) scale(0.7);
     }
   `;
   document.head.appendChild(cursorStyle);
  
   let mouseX = 0, mouseY = 0;
   let ringX = 0, ringY = 0;
  
   document.addEventListener("mousemove", e => {
     mouseX = e.clientX;
     mouseY = e.clientY;
     cursorDot.style.left = mouseX + "px";
     cursorDot.style.top  = mouseY + "px";
   });
  
   // Ring segue com lag suave
   function animateRing() {
     ringX += (mouseX - ringX) * 0.12;
     ringY += (mouseY - ringY) * 0.12;
     cursorRing.style.left = ringX + "px";
     cursorRing.style.top  = ringY + "px";
     requestAnimationFrame(animateRing);
   }
   animateRing();
  
   // Hover em elementos interativos
   const hoverTargets = document.querySelectorAll("a, button, [role='button'], .model-card, .btn, .carousel__item");
   hoverTargets.forEach(el => {
     el.addEventListener("mouseenter", () => {
       cursorDot.classList.add("is-hovering");
       cursorRing.classList.add("is-hovering");
     });
     el.addEventListener("mouseleave", () => {
       cursorDot.classList.remove("is-hovering");
       cursorRing.classList.remove("is-hovering");
     });
   });
  
   document.addEventListener("mousedown", () => cursorDot.classList.add("is-clicking"));
   document.addEventListener("mouseup",   () => cursorDot.classList.remove("is-clicking"));
  
   // Esconde cursor quando sai da janela
   document.addEventListener("mouseleave", () => {
     cursorDot.style.opacity  = "0";
     cursorRing.style.opacity = "0";
   });
   document.addEventListener("mouseenter", () => {
     cursorDot.style.opacity  = "1";
     cursorRing.style.opacity = "1";
   });
  }
  
  
  /* ─── NAV SCROLL STATE ─── */
  const nav = document.getElementById("nav");
  if (nav) {
    ScrollTrigger.create({
      start: "top -10px",
      onUpdate: (self) => {
        // self.direction 1 = scroll down, -1 = scroll up
        if (self.progress > 0) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
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

  const video = document.getElementById("heroVideo");

ScrollTrigger.create({
  trigger: "#hero",
  start: "top bottom",
  end: "bottom top",
  onEnter: () => video.play(),
  onLeave: () => video.pause(),
  onEnterBack: () => video.play(),
  onLeaveBack: () => video.pause()
});

  
  /* ─── HERO ENTRANCE ─── */
  if (!PREFERS_REDUCED) {
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
    .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.8 })
    .to(".hero__title", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to(".hero__sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero__actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
  }
  
  // Refresh final para garantir que as posições estão certas
  ScrollTrigger.refresh();
  
  /* ─── SCROLL REVEALS ─── */
  const revealElements = document.querySelectorAll("[data-reveal]");
  revealElements.forEach((el, i) => {
    if (PREFERS_REDUCED) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    
    gsap.fromTo(el, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: (i % 3) * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none" // Executa apenas uma vez
        }
      }
    );
  });
  
  
 /* ─── STATS COUNTER ─── */
window.addEventListener("load", () => {
  
  ScrollTrigger.refresh();

  document.querySelectorAll(".stat__num[data-count]").forEach(el => {
    const targetValue = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";

    // Define o valor inicial fixo para não pular
    el.textContent = "0" + suffix;

    ScrollTrigger.create({
      trigger: el,
      start: "top 95%", 
      once: true,
      onEnter: () => {
       
        const obj = { val: 0 };
        
        gsap.to(obj, {
          val: targetValue,
          duration: 2, 
          ease: "power2.out",
          onUpdate: () => {
            
            let displayVal;
            if (targetValue % 1 !== 0) {
              displayVal = obj.val.toFixed(1).replace(".", ",");
            } else {
              displayVal = Math.floor(obj.val).toLocaleString("pt-BR");
            }
            el.textContent = displayVal + suffix;
          }
        });
      }
    });
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
  
  gsap.to(".benefits__orb", {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: ".benefits",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  
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
  
  
  /*--- 3D TILT COM GSAP --- */
  document.querySelectorAll('.model-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Calcula a posição do mouse em relação ao centro do card (-0.5 a 0.5)
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rotateX = ((y / rect.height) - 0.5) * -10; // Inclinação vertical
      const rotateY = ((x / rect.width) - 0.5) * 10;  // Inclinação horizontal
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.03,
        duration: 0.2,
        ease: "power2.out",
        transformPerspective: 1000 // Adiciona profundidade ao efeito
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out"
      });
    });
  });
  
  /* Testemunhas */
  
  function initInfiniteCarousel() {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");
    
    if (!carousel || !track) return;
    
    if (!track.dataset.duplicado) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicado = "true";
    }
    
    let speed = 0.5;
    
    function animate() {
      carousel.scrollLeft += speed;
      
      // quando chega na metade (loop perfeito)
      if (carousel.scrollLeft >= track.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      }
      
      updateCenterFocus();
      
      requestAnimationFrame(animate);
    }
    
    function updateCenterFocus() {
      const items = document.querySelectorAll(".carousel__item");
      const center = window.innerWidth / 2;
      
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        
        const distance = Math.abs(center - itemCenter);
        
        const scale = Math.max(0.85, 1 - distance / 600);
        const opacity = Math.max(0.5, 1 - distance / 500);
        
        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
      });
    }
    
    animate();
  }
  
  initInfiniteCarousel();
  
  // Refresh depois de tudo pronto
  window.addEventListener("load", () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  });
})();