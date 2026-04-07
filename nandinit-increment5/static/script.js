/**
 * MonoMuse — Phase B site scripts
 *
 * External libraries (cite in project documentation):
 * - jQuery 4.x: https://code.jquery.com/ (used on index.html for Read More/Less; membership.html for accordion)
 * - Leaflet 1.9.x: https://leafletjs.com/ (visit.html map; loaded from unpkg.com)
 * - YouTube IFrame API: https://developers.google.com/youtube/iframe_api_reference (exhibitions.html)
 */

function activeNav() {
  const navLinks = document.querySelectorAll(".nav_bar a");
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  let currentFile = segments.length ? segments[segments.length - 1] : "index.html";
  if (!currentFile.includes(".")) {
    currentFile = "index.html";
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) {
      return;
    }
    try {
      const resolved = new URL(href, window.location.href);
      const linkSegments = resolved.pathname.split("/").filter(Boolean);
      const linkFile = linkSegments.length
        ? linkSegments[linkSegments.length - 1]
        : "index.html";
      if (linkFile === currentFile) {
        link.classList.add("active");
      }
    } catch {
      /* ignore invalid href */
    }
  });
}

activeNav();

function toggleNav() {
  const nav = document.querySelector(".nav_bar");
  if (!nav) return;
  nav.classList.toggle("responsive");
}

const now = new Date();
const hour = now.getHours();

function greeting(x) {
  let message = "";

  if (x < 5 || x >= 20) {
    message = "Good night";
  } else if (x < 12) {
    message = "Good morning";
  } else if (x < 18) {
    message = "Good afternoon";
  } else {
    message = "Good evening";
  }
  const greetingElement = document.getElementById("greeting");
  if (greetingElement) {
    greetingElement.textContent = `${message}, `;
  }
}

greeting(hour);

function addYear() {
  const year = new Date().getFullYear();
  const copyYearElement = document.getElementById("copyYear");
  if (copyYearElement) {
    copyYearElement.textContent = `© ${year} MonoMuse. All rights reserved.`;
  }
}

addYear();

if (window.jQuery) {
  const $ = window.jQuery;
  $("#readLess").on("click", function () {
    $("#longIntro").hide();
    $("#readLess").hide();
    $("#readMore").show();
  });
  $("#readMore").on("click", function () {
    $("#longIntro").show();
    $("#readLess").show();
    $("#readMore").hide();
  });
}

/** jQuery accordion (membership.html) */
function initSupportAccordion() {
  if (!window.jQuery || !document.querySelector("#supportAccordion")) return;
  const $ = window.jQuery;
  $("#supportAccordion .accordion-trigger").on("click", function () {
    const $btn = $(this);
    const panelId = $btn.attr("aria-controls");
    const $panel = $("#" + panelId);
    const isOpen = $panel.is(":visible");
    $("#supportAccordion .accordion-panel").slideUp(200);
    $("#supportAccordion .accordion-trigger").attr("aria-expanded", "false");
    if (!isOpen) {
      $panel.slideDown(200);
      $btn.attr("aria-expanded", "true");
    }
  });
}

initSupportAccordion();

/** Image slideshow (explore.html) — custom DOM interaction */
function initSlideshow() {
  const img = document.getElementById("slideshowImage");
  const prev = document.getElementById("slideshowPrev");
  const next = document.getElementById("slideshowNext");
  const caption = document.getElementById("slideshowCaption");
  if (!img || !prev || !next) return;

  const slides = [
    {
      src: "../static/gallery-1.svg",
      alt: "Abstract digital art installation with cyan geometric shapes",
    },
    {
      src: "../static/gallery-2.svg",
      alt: "Generative art pattern with overlapping circles",
    },
    {
      src: "../static/gallery-3.svg",
      alt: "Museum gallery wall with framed abstract panels",
    },
  ];
  let i = 0;

  function show(index) {
    i = (index + slides.length) % slides.length;
    img.src = slides[i].src;
    img.alt = slides[i].alt;
    if (caption) {
      caption.textContent = slides[i].alt;
    }
  }

  prev.addEventListener("click", () => show(i - 1));
  next.addEventListener("click", () => show(i + 1));
  show(0);
}

initSlideshow();

const CHECKOUT_UNIT_PRICE = 18;

function clearCheckoutErrors() {
  document.querySelectorAll(".checkout-form .field-error").forEach((el) => {
    el.textContent = "";
  });
}

function setCheckoutError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function updateCheckoutTotal() {
  const qtyInput = document.getElementById("quantity");
  const out = document.getElementById("orderTotalDisplay");
  if (!qtyInput || !out) return;
  const qty = Number.parseInt(qtyInput.value, 10);
  if (!Number.isFinite(qty) || qty < 1) {
    out.textContent = "$0.00";
    return;
  }
  const total = qty * CHECKOUT_UNIT_PRICE;
  out.textContent = `$${total.toFixed(2)}`;
}

function initCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const qtyInput = document.getElementById("quantity");
  if (qtyInput) {
    qtyInput.addEventListener("input", updateCheckoutTotal);
    qtyInput.addEventListener("change", updateCheckoutTotal);
  }
  updateCheckoutTotal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearCheckoutErrors();

    const visitDate = document.getElementById("visitDate");
    const email = document.getElementById("email");
    const zip = document.getElementById("zip");
    const quantity = document.getElementById("quantity");
    const typeSelected = form.querySelector('input[name="ticketType"]:checked');

    let ok = true;

    if (!visitDate || !visitDate.value) {
      setCheckoutError("err-visitDate", "Please choose a visit date.");
      ok = false;
    }

    if (!typeSelected) {
      setCheckoutError("err-ticketType", "Please select a ticket type.");
      ok = false;
    }

    const qty = quantity ? Number.parseInt(quantity.value, 10) : NaN;
    if (!Number.isFinite(qty) || qty < 1 || qty > 10) {
      setCheckoutError("err-quantity", "Enter a whole number of tickets from 1 to 10.");
      ok = false;
    }

    if (!email || !email.value.trim()) {
      setCheckoutError("err-email", "Email is required.");
      ok = false;
    } else if (!email.checkValidity()) {
      setCheckoutError("err-email", "Enter a valid email address.");
      ok = false;
    }

    if (zip && zip.value.trim()) {
      if (!/^\d{5}$/.test(zip.value.trim())) {
        setCheckoutError("err-zip", "ZIP code must be exactly five digits.");
        ok = false;
      }
    }

    if (!ok) return;

    const total = qty * CHECKOUT_UNIT_PRICE;
    const params = new URLSearchParams();
    params.set("total", total.toFixed(2));
    params.set("visitDate", visitDate.value);
    params.set("ticketType", typeSelected.value);
    params.set("quantity", String(qty));
    params.set("email", email.value.trim());
    window.location.href = `confirmation.html?${params.toString()}`;
  });
}

initCheckoutForm();

function populateConfirmationPage() {
  const totalEl = document.getElementById("confirmationTotal");
  if (!totalEl) return;
  const params = new URLSearchParams(window.location.search);
  const total = params.get("total");
  const visitDate = params.get("visitDate");
  const msg = document.getElementById("confirmationMessage");
  if (msg && visitDate) {
    msg.textContent = `Your simulated order is confirmed for ${visitDate}. No payment was processed.`;
  }
  if (!total) {
    totalEl.textContent = "";
    return;
  }
  const n = Number.parseFloat(total);
  totalEl.textContent = Number.isFinite(n)
    ? `Your order total (simulated): $${n.toFixed(2)}`
    : "";
}

populateConfirmationPage();

function initLeafletMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;
  if (!window.L) return;

  const lat = 40.444;
  const lng = -79.9436;
  const zoom = 14;

  const map = window.L.map("map").setView([lat, lng], zoom);
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  window.L.marker([lat, lng]).addTo(map).bindPopup("MonoMuse").openPopup();
}

function loadYouTubeIframeAPI() {
  if (window.YT && window.YT.Player) return;
  if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function initYouTubePlayer() {
  const playerElement = document.getElementById("youtubePlayer");
  if (!playerElement) return;
  loadYouTubeIframeAPI();

  window.onYouTubeIframeAPIReady = function () {
    const videoId = "YsWzkNvTRv0";
    new window.YT.Player("youtubePlayer", {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
      },
    });
  };
}

initLeafletMap();
initYouTubePlayer();
