/**
 * CloFix chrome: mobile/tablet nav + mega-menu (all pages).
 * Breakpoint matches style.css: max-width 1024px.
 */
(function () {
  var MQ = "(max-width: 1024px)";

  function isCompact() {
    return window.matchMedia(MQ).matches;
  }

  function syncHeaderHeight() {
    var headerEl = document.querySelector("header.header");
    if (!headerEl) return;
    document.documentElement.style.setProperty(
      "--header-h",
      headerEl.offsetHeight + "px"
    );
  }

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
        syncHeaderHeight();
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

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest && t.closest(".c-dropdown")) return;
      if (t.closest && t.closest(".c-nav__toggle")) return;
      if (
        navContent &&
        navContent.classList.contains("active") &&
        t.closest &&
        t.closest(".c-nav__content")
      ) {
        return;
      }
      closeAllDropdowns();
      if (isCompact()) {
        if (
          navContent &&
          navContent.classList.contains("active") &&
          !(t.closest && t.closest(".c-nav"))
        ) {
          closeMobile();
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });

    window.addEventListener("resize", function () {
      syncHeaderHeight();
      if (!isCompact()) closeMobile();
    });

    if (navContent) {
      navContent.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          if (isCompact()) closeMobile();
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
    syncHeaderHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeaderHeight);
    }
    window.addEventListener("load", syncHeaderHeight);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
