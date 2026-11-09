/** Homepage product rotation; uses local assets and also works with file://. */
(function () {
  var hero = document.querySelector(".cf-hero-product");
  if (!hero) return;

  var title = hero.querySelector("h1 .unique-title-highlight");
  var lead = hero.querySelector(".cf-hero-product__lead");
  var actions = hero.querySelector(".hero-actions");
  var buttons = hero.querySelectorAll("[data-product]");
  var rotation = hero.querySelector(".cf-hero-product__rotation");
  var status = hero.querySelector(".cf-hero-product__status");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var originalActions = Array.prototype.map.call(actions.children, function (link) {
    return link.cloneNode(true);
  });
  var products = [
    { id: "waf", name: "CloFix WAF" },
    { id: "cloud", name: "CloFix Cloud", source: ".cf-spotlight--cloud" },
    { id: "one", name: "CloFix One", source: ".cf-spotlight--one" },
    { id: "sre", name: "CloFix SRE AI", source: "#heroSreContent" }
  ];
  var active = 0;
  var timer = null;
  var transition = null;
  var paused = reducedMotion.matches;
  var hovered = false;
  var focused = false;
  var visible = true;
  var explicitPlay = false;

  // Keep every product's copy in the document so page translation can
  // translate it once and product changes never replace translated text.
  var leads = document.createElement("div");
  leads.className = "cf-hero-product__leads";
  lead.parentNode.insertBefore(leads, lead);
  var actionGroups = document.createElement("div");
  actionGroups.className = "cf-hero-product__actions";
  actions.parentNode.replaceChild(actionGroups, actions);

  products.forEach(function (product) {
    product.leadElement = product.source ? lead.cloneNode(false) : lead;
    if (product.source) {
      var source = document.querySelector(product.source);
      product.sourceElement = source.content || source;
      product.leadElement.removeAttribute("data-i18n");
      product.leadElement.textContent = product.sourceElement.querySelector(".heading--4").textContent.trim();
    }
    leads.appendChild(product.leadElement);
    product.actionElement = buildActions(product);
    actionGroups.appendChild(product.actionElement);
  });

  function schedule() {
    window.clearTimeout(timer);
    if (paused || (!explicitPlay && (hovered || focused)) || !visible || document.hidden) return;
    timer = window.setTimeout(function () {
      show((active + 1) % products.length, false);
    }, 5500);
  }

  function localHref(href) {
    if (location.protocol !== "file:" || !href || href.charAt(0) !== "/") return href;
    var parts = href.slice(1).split("#");
    return (parts[0] ? parts[0] + ".html" : "index.html") + (parts[1] ? "#" + parts[1] : "");
  }

  function buildActions(product) {
    var sourceLinks = product.source
      ? product.sourceElement.querySelectorAll(".spot-action")
      : originalActions;
    var group = actions.cloneNode(false);
    Array.prototype.forEach.call(sourceLinks, function (source, index) {
      var link = source.cloneNode(true);
      link.className = "hero-action " + (index === 0 ? "hero-action--trial" : "hero-action--features");
      link.querySelectorAll("[class]").forEach(function (node) {
        node.className = node.className.replace(/spot-action__/g, "hero-action__");
      });
      link.setAttribute("href", localHref(link.getAttribute("href")));
      group.appendChild(link);
    });
    group.setAttribute("aria-label", product.name + " actions");
    return group;
  }

  function render(index, announce) {
    var product = products[index];
    active = index;
    hero.dataset.activeProduct = product.id;
    title.textContent = product.name;
    products.forEach(function (item, itemIndex) {
      var selected = itemIndex === index;
      [item.leadElement, item.actionElement].forEach(function (element) {
        element.dataset.active = String(selected);
        element.setAttribute("aria-hidden", String(!selected));
        element.toggleAttribute("inert", !selected);
      });
    });
    buttons.forEach(function (button) {
      var selected = button.dataset.product === product.id;
      button.classList.toggle("cf-hero-product__pill--main", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (announce) status.textContent = product.name;
    hero.classList.remove("is-switching");
    schedule();
  }

  function show(index, announce) {
    window.clearTimeout(timer);
    window.clearTimeout(transition);
    if (index === active || reducedMotion.matches) {
      render(index, announce);
      return;
    }
    hero.classList.add("is-switching");
    transition = window.setTimeout(function () { render(index, announce); }, 200);
  }

  function updateRotationButton() {
    var label = paused ? "Play product rotation" : "Pause product rotation";
    rotation.setAttribute("aria-label", label);
    rotation.title = label;
    rotation.firstElementChild.textContent = paused ? "▶" : "Ⅱ";
  }

  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () { show(index, true); });
  });
  rotation.addEventListener("click", function () {
    paused = !paused;
    explicitPlay = !paused;
    updateRotationButton();
    schedule();
  });
  hero.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "mouse") return;
    explicitPlay = false;
    hovered = true;
    schedule();
  });
  hero.addEventListener("pointerleave", function () { hovered = false; schedule(); });
  hero.addEventListener("focusin", function () { explicitPlay = false; focused = true; schedule(); });
  hero.addEventListener("focusout", function (event) {
    focused = hero.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", function () {
    paused = reducedMotion.matches;
    updateRotationButton();
    schedule();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(hero);
  }
  render(0, false);
  updateRotationButton();
  schedule();
})();
