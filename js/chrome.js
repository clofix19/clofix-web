/**
 * CloFix chrome: mobile nav + mega-menu (all pages).
 */
(function () {
  function initNav(header) {
    if (!header || header.getAttribute("data-nav-ready") === "1") return;
    header.setAttribute("data-nav-ready", "1");

    var navToggle = header.querySelector("#navToggle");
    var navContent = header.querySelector(".c-nav__content");
    var dropdowns = header.querySelectorAll(".c-dropdown");

    function closeAllDropdowns() {
      dropdowns.forEach(function (dd) {
        dd.classList.remove("open");
        var btn = dd.querySelector(".c-dropdown__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }

    function closeMobile() {
      if (!navContent || !navToggle) return;
      navContent.classList.remove("active");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      closeAllDropdowns();
    }

    if (navToggle && navContent) {
      navToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = navContent.classList.toggle("active");
        document.body.classList.toggle("nav-open", open);
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeAllDropdowns();
      });
    }

    dropdowns.forEach(function (dd) {
      var btn = dd.querySelector(".c-dropdown__toggle");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var willOpen = !dd.classList.contains("open");
        closeAllDropdowns();
        if (willOpen) {
          dd.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Close when clicking outside the open dropdown / mobile panel
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest && t.closest(".c-dropdown")) return;
      if (t.closest && t.closest(".c-nav__toggle")) return;
      if (navContent && navContent.classList.contains("active") && t.closest && t.closest(".c-nav__content")) {
        return;
      }
      closeAllDropdowns();
      if (window.innerWidth <= 768) {
        // only close mobile panel when tapping outside nav
        if (navContent && navContent.classList.contains("active") && !(t.closest && t.closest(".c-nav"))) {
          closeMobile();
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMobile();
    });

    // Close mobile panel after choosing a link
    if (navContent) {
      navContent.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          if (window.innerWidth <= 768) closeMobile();
          else closeAllDropdowns();
        });
      });
    }
  }

  function markCurrent() {
    var path = (window.location.pathname || "/").replace(/\/$/, "") || "/";
    document.querySelectorAll("header.header a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.indexOf("http") === 0 || href.charAt(0) === "#") return;
      var clean = href.replace(/\/$/, "") || "/";
      if (clean === path || clean + ".html" === path.split("/").pop()) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function boot() {
    initNav(document.querySelector("header.header"));
    markCurrent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
