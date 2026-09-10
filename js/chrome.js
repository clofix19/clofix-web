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

  function initReveals() {
    // Sitewide: unhide scroll-reveal blocks if page JS is missing/broken
    var revealEls = document.querySelectorAll(".reveal:not(.show)");
    var trustEls = document.querySelectorAll(
      ".trust-inner:not(.trust-reveal), .trust-card:not(.trust-reveal), .why-item:not(.trust-reveal), .compliance-card:not(.trust-reveal), .badge-pill:not(.trust-reveal)"
    );

    function showReveal(el) {
      el.classList.add("show");
      el.classList.add("trust-reveal");
    }

    var all = [];
    revealEls.forEach(function (el) {
      all.push(el);
    });
    trustEls.forEach(function (el) {
      all.push(el);
    });
    if (!all.length) return;

    if (!("IntersectionObserver" in window)) {
      all.forEach(showReveal);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          showReveal(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );

    all.forEach(function (el) {
      io.observe(el);
    });

    // Hard fallback so copy never stays invisible
    setTimeout(function () {
      all.forEach(showReveal);
    }, 2800);
  }

  function boot() {
    initNav(document.querySelector("header.header"));
    markCurrent();
    syncHeaderHeight();
    initReveals();
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
