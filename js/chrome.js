/**
 * CloFix chrome behavior (nav / mega-menu).
 * Header and footer markup are embedded in each page from header.html / footer.html.
 */
(function () {
  function initNav(root) {
    var navToggle = root.querySelector("#navToggle");
    var navContent = root.querySelector(".c-nav__content");
    var dropdowns = root.querySelectorAll(".c-dropdown");

    function closeAllDropdowns() {
      dropdowns.forEach(function (dd) {
        dd.classList.remove("open");
        var btn = dd.querySelector(".c-dropdown__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }

    if (navToggle && navContent) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.addEventListener("click", function () {
        var open = navContent.classList.toggle("active");
        document.body.classList.toggle("nav-open", open);
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeAllDropdowns();
      });
      navContent.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          navContent.classList.remove("active");
          document.body.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
          closeAllDropdowns();
        });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navContent.classList.contains("active")) {
          navContent.classList.remove("active");
          document.body.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
          closeAllDropdowns();
        }
      });
      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          document.body.classList.remove("nav-open");
          navContent.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
          closeAllDropdowns();
        }
      });
    }

    dropdowns.forEach(function (dd) {
      var btn = dd.querySelector(".c-dropdown__toggle");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = dd.classList.contains("open");
        closeAllDropdowns();
        if (!isOpen) {
          dd.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", closeAllDropdowns);
  }

  function markCurrent() {
    var path = (window.location.pathname || "/").replace(/\/$/, "") || "/";
    document.querySelectorAll("header.header a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.indexOf("http") === 0 || href.charAt(0) === "#") return;
      var clean = href.replace(/\/$/, "") || "/";
      if (clean === path) a.setAttribute("aria-current", "page");
    });
  }

  function boot() {
    var header = document.querySelector("header.header");
    if (header) initNav(header);
    markCurrent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
