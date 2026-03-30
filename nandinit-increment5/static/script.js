/*
var x = 5
var y = 7
var z = x+y
console.log(z)

var A = "Hello"
var B = " world!"
var C = A+B
console.log(C)
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
    greetingElement.innerHTML = message;
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

function showTicketForm(selectedDate) {
  const form = document.getElementById("ticketPurchaseForm");
  const dateInput = document.getElementById("selectedDate");
  if (dateInput && selectedDate) {
    dateInput.value = selectedDate;
  }
  if (form) {
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function submitTicketPurchase() {
  alert("Redirecting to payment system.");
}

function initLeafletMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;
  if (!window.L) return;

  // CMU (Pittsburgh) area as a reasonable default museum location
  const lat = 40.444;
  const lng = -79.9436;
  const zoom = 14;

  const map = window.L.map("map").setView([lat, lng], zoom);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
  window.L.marker([lat, lng]).addTo(map).bindPopup("MonoMuse (demo location)").openPopup();
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

  // Called by the YouTube IFrame API when ready
  window.onYouTubeIframeAPIReady = function () {
    // Video chosen for Increment 5
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

// Page-specific initializers
initLeafletMap();
initYouTubePlayer();
