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
