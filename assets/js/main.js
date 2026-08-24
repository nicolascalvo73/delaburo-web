(function () {
  "use strict";

  /* ---------------- Theme (claro / oscuro) ---------------- */
  var root = document.documentElement;
  var THEME_KEY = "delaburo-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var isDark =
        theme === "dark" ||
        (!theme &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    });
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      if (theme) localStorage.setItem(THEME_KEY, theme);
      else localStorage.removeItem(THEME_KEY);
    } catch (e) {
      /* almacenamiento no disponible: seguimos igual */
    }
  }

  applyTheme(getStoredTheme());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var current =
      root.getAttribute("data-theme") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  });

  /* ---------------- Menu mobile ---------------- */
  var mobileNav = document.querySelector("[data-mobile-nav]");
  function toggleMobileNav(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    var opener = document.querySelector("[data-mobile-open]");
    if (opener) opener.setAttribute("aria-expanded", open ? "true" : "false");
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-mobile-open]")) toggleMobileNav(true);
    if (e.target.closest("[data-mobile-close]")) toggleMobileNav(false);
    if (e.target.matches("[data-mobile-nav] a")) toggleMobileNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggleMobileNav(false);
  });

  /* ---------------- Revelado al hacer scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Hero: red de particulas ---------------- */
  (function () {
    var canvas = document.querySelector(".hero-particles");
    var hero = document.querySelector(".hero");
    if (!canvas || !hero || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var W = 0,
      H = 0,
      dpr = 1,
      particles = [],
      rafId = null,
      linkDist = 130;

    var mouse = { x: null, y: null };

    function makeParticle(minX, maxX) {
      return {
        x: minX + Math.random() * (maxX - minX),
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.9,
      };
    }

    function initParticles() {
      var area = W * H;
      var base = Math.max(24, Math.min(90, Math.round(area / 13000)));
      /* El contenido esta justificado a la izquierda: la mitad izquierda
         mantiene la densidad base y la mitad derecha (sin texto encima)
         duplica la cantidad de nodos animados. */
      var leftCount = Math.round(base / 2);
      var rightCount = base;
      particles = [];
      for (var i = 0; i < leftCount; i++) {
        particles.push(makeParticle(0, W / 2));
      }
      for (var j = 0; j < rightCount; j++) {
        particles.push(makeParticle(W / 2, W));
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= W) p.vx *= -1;
        if (p.y <= 0 || p.y >= H) p.vy *= -1;
      }

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var pa = particles[a],
            pb = particles[b];
          var dx = pa.x - pb.x,
            dy = pa.y - pb.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= linkDist) continue;
          var alpha = (1 - dist / linkDist) * 0.32;
          if (mouse.x !== null) {
            var mx = (pa.x + pb.x) / 2 - mouse.x;
            var my = (pa.y + pb.y) / 2 - mouse.y;
            var mDist = Math.sqrt(mx * mx + my * my);
            if (mDist < 160) {
              alpha = Math.min(0.75, alpha + (1 - mDist / 160) * 0.45);
            }
          }
          ctx.strokeStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }

      for (var j = 0; j < particles.length; j++) {
        var dot = particles[j];
        var dotAlpha = 0.8;
        var dotR = dot.r;
        if (mouse.x !== null) {
          var ddx = dot.x - mouse.x,
            ddy = dot.y - mouse.y;
          var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 160) {
            dotAlpha = Math.min(1, 0.8 + (1 - ddist / 160) * 0.3);
            dotR = dot.r * (1 + (1 - ddist / 160) * 0.5);
          }
        }
        ctx.fillStyle = "rgba(255,255,255," + dotAlpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) rafId = requestAnimationFrame(draw);
    }

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (rafId) cancelAnimationFrame(rafId);
        resize();
        draw();
      }, 150);
    });

    resize();
    draw();
  })();

  /* ---------------- Anio dinamico en el footer ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Prefijos telefonicos ---------------- */
  var phoneSelect = document.querySelector("[data-country-select]");
  if (phoneSelect && window.DELABURO_COUNTRIES) {
    window.DELABURO_COUNTRIES.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c.dial;
      opt.textContent = c.iso + " " + c.dial;
      if (c.iso === "AR") opt.selected = true;
      phoneSelect.appendChild(opt);
    });
  }

  /* ---------------- Formulario de cotizacion ---------------- */
  var form = document.querySelector("[data-quote-form]");
  if (form) {
    var statusEl = form.querySelector("[data-form-status]");
    var endpoint = form.getAttribute("data-endpoint");

    function showStatus(kind, message) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = "form-status show " + kind;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var isPlaceholder =
        !endpoint || endpoint.indexOf("TU_ID_DE_FORMSPREE") !== -1;

      if (isPlaceholder) {
        showStatus(
          "err",
          "El formulario todavia no esta conectado a un servicio de envio. Mientras tanto, escribinos directamente a recursoshumanos@delaburo.com."
        );
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (response) {
          if (response.ok) {
            showStatus(
              "ok",
              "¡Gracias! Recibimos tu consulta y un ejecutivo comercial se va a contactar a la brevedad."
            );
            form.reset();
          } else {
            showStatus(
              "err",
              "No pudimos enviar el formulario. Probá de nuevo o escribinos a recursoshumanos@delaburo.com."
            );
          }
        })
        .catch(function () {
          showStatus(
            "err",
            "No pudimos enviar el formulario. Probá de nuevo o escribinos a recursoshumanos@delaburo.com."
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }
})();
