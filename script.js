/* ============================================================
   HARMONIC CUSTOM CONCEPTS — script.js
   Vanilla JavaScript only. No frameworks.
   ------------------------------------------------------------
   What this file does:
   1. Sticky nav: blurred background once the page scrolls.
   2. Mobile nav toggle.
   3. Fade-and-rise on scroll (IntersectionObserver).
   4. Waveform bars: builds the bars and randomizes their
      heights in a loop (hero, CTA, contact).
   5. Hero parallax: the phoenix tilts slightly with the mouse.
   6. Hero cursor glow: a soft light that follows the mouse,
      hero only.
   7. Stat counters: count up when the About section scrolls
      into view. (EDIT the numbers in index.html, data-target.)
   8. Process line: draws the glowing circuit line on scroll.
   9. Project card tilt on hover (pointer devices only).
   10. Contact form: validates, shows inline errors, and a
       success message. No backend is wired yet; see the note
       in index.html next to the form.
   11. Footer year: keeps the copyright year current.
   ============================================================ */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Sticky nav background on scroll ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (window.scrollY > 24) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 2. Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. Fade-and-rise on scroll ---------- */
  var fadeEls = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 4. Waveform bars ---------- */
  function buildWaveform(container, barCount) {
    if (!container) return;
    var colors = ["#FF7A1A", "#FFB347", "#E0309A", "#7B3FE4", "#1FA2FF", "#22D3EE"];
    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement("span");
      bar.style.background = colors[i % colors.length];
      bar.style.animationDelay = (Math.random() * 1.6).toFixed(2) + "s";
      bar.style.animationDuration = (1.1 + Math.random() * 1.2).toFixed(2) + "s";
      container.appendChild(bar);
    }
  }
  document.querySelectorAll(".waveform").forEach(function (wave, index) {
    // Hero gets the widest wave; smaller ones elsewhere.
    buildWaveform(wave, index === 0 ? 48 : 32);
  });
  // Randomize bar heights in a gentle loop so the wave never repeats exactly.
  function randomizeWave() {
    document.querySelectorAll(".waveform span").forEach(function (bar) {
      var height = 12 + Math.random() * 88; // percent of the wave height
      bar.style.height = height.toFixed(0) + "%";
    });
  }
  randomizeWave();
  if (!prefersReducedMotion) {
    window.setInterval(randomizeWave, 900);
  }

  /* ---------- 5 + 6. Hero parallax + cursor glow ---------- */
  var hero = document.getElementById("hero");
  var logoWrap = document.getElementById("heroLogoWrap");
  var cursorGlow = document.getElementById("cursorGlow");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (hero && logoWrap && finePointer && !prefersReducedMotion) {
    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      // The phoenix drifts a few degrees with the mouse, never far.
      logoWrap.style.transform =
        "perspective(900px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg)";
      if (cursorGlow) {
        cursorGlow.style.left = event.clientX - rect.left + "px";
        cursorGlow.style.top = event.clientY - rect.top + "px";
      }
    });
    hero.addEventListener("mouseleave", function () {
      logoWrap.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    });
  }

  /* ---------- 7. Stat counters ---------- */
  var statNumbers = document.querySelectorAll(".stat-number");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    var duration = 1400;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease out: fast at first, settles at the end.
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && statNumbers.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  } else {
    statNumbers.forEach(animateCounter);
  }

  /* ---------- 8. Process line draws itself on scroll ---------- */
  var processTrack = document.querySelector(".process-track");
  if (processTrack) {
    if ("IntersectionObserver" in window) {
      var processObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            processTrack.classList.add("drawn");
            processObserver.disconnect();
          }
        });
      }, { threshold: 0.35 });
      processObserver.observe(processTrack);
    } else {
      processTrack.classList.add("drawn");
    }
  }

  /* ---------- 9. Project card tilt on hover ---------- */
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll(".project-card.tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 10. Contact form validation + success ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var success = document.getElementById("formSuccess");
    var fields = {
      name: { input: document.getElementById("field-name"), error: document.getElementById("error-name"),
              check: function (v) { return v.trim().length > 1; } },
      email: { input: document.getElementById("field-email"), error: document.getElementById("error-email"),
               check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      type: { input: document.getElementById("field-type"), error: document.getElementById("error-type"),
              check: function (v) { return v !== ""; } },
      message: { input: document.getElementById("field-message"), error: document.getElementById("error-message"),
                 check: function (v) { return v.trim().length > 9; } }
    };
    function validateOne(key) {
      var f = fields[key];
      var ok = f.check(f.input.value);
      var fieldWrap = f.input.closest(".field");
      if (fieldWrap) fieldWrap.classList.toggle("invalid", !ok);
      if (f.error) f.error.hidden = ok;
      f.input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }
    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener("input", function () { validateOne(key); });
      fields[key].input.addEventListener("blur", function () { validateOne(key); });
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var allOk = true;
      var firstBad = null;
      Object.keys(fields).forEach(function (key) {
        var ok = validateOne(key);
        if (!ok) {
          allOk = false;
          if (!firstBad) firstBad = fields[key].input;
        }
      });
      if (!allOk) {
        if (firstBad) firstBad.focus();
        return;
      }
      // No backend wired yet: show the success state and clear the form.
      // Wire this to a mail service (Formspree, server endpoint) to send for real.
      if (success) success.hidden = false;
      form.reset();
      if (success) success.focus();
    });
  }

  /* ---------- 11. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
