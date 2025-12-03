class ClofixOrbitLogo extends HTMLElement {
  static get observedAttributes() {
    return ["size", "speed", "color", "paused"];
  }
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
<style>
:host{
  display:inline-block;
  /* Make it behave like an image: width controls size, height follows */
  width:auto;
  aspect-ratio:1;
}
.wrap{
  /* --size is set by JS (ResizeObserver or attribute). */
  --size: 220px; --orb: calc(var(--size) * .227);
  --rx: calc(var(--size) * .445); --ry: calc(var(--size) * .282);
  --speed: 3.2s; --c: #38bdf8;
  position:relative; inline-size:100%; block-size:100%;
  filter: drop-shadow(0 8px 22px color-mix(in oklab, var(--c) 35%, black));
  user-select:none; contain: layout paint;
}
.bot{ inline-size:100%; block-size:100%; display:block; animation: bob 3.2s ease-in-out infinite; }
@keyframes bob{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-5px)} }
.eyes circle{ animation: blink 4.2s infinite; transform-origin:center }
.eyes circle:nth-child(2){ animation-delay:.25s }
@keyframes blink{ 0%,92%,100%{ transform:scaleY(1)} 95%{ transform:scaleY(.08)} }
.antenna circle{ animation: ping 1.6s ease-out infinite; filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
@keyframes ping{ 50%{ filter: drop-shadow(0 0 10px color-mix(in oklab, var(--c) 90%, white)) } }
.ring{ position:absolute; inset:0 }
.ring::before{
  content:""; position:absolute; inset:0; margin:auto;
  width: calc(var(--rx)*2); height: calc(var(--ry)*2); border-radius:50%/50%;
  border: 1.5px dashed color-mix(in oklab, var(--c) 55%, transparent);
  animation: ring 6.4s linear infinite; opacity:.55; pointer-events:none;
}
@keyframes ring{ to{ transform: rotate(360deg) } }
.orb{
  position:absolute; width: var(--orb); height: var(--orb);
  left:50%; top:50%; margin: calc(var(--orb)/-2) 0 0 calc(var(--orb)/-2);
  display:grid; place-items:center; color:#fff; border-radius:50%;
  background: radial-gradient(40% 35% at 30% 30%, color-mix(in oklab, var(--c) 70%, white 30%), var(--c));
  box-shadow: 0 0 0 2px rgba(255,255,255,.05) inset, 0 8px 18px color-mix(in oklab, var(--c) 35%, black);
  border: 1px solid rgba(255,255,255,.1);
  will-change: transform, filter;
}
.orb svg{ width:62%; height:62% }
.orb[data-depth="front"]{ filter: brightness(1.08) saturate(1.05); z-index:3; transform: translate3d(var(--x),var(--y),0) scale(1.06); }
.orb[data-depth="back"] { filter: brightness(.78)  saturate(.90); z-index:1; transform: translate3d(var(--x),var(--y),0) scale(.92); }
.orb[data-depth="mid"]  { z-index:2; transform: translate3d(var(--x),var(--y),0) scale(1); }

:host([paused]) .wrap, :host([paused]) .wrap * { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce){ .wrap *{ animation:none !Important } }
</style>
<div class="wrap">
  <svg class="bot" viewBox="0 0 200 200" aria-hidden="true" part="svg">
    <defs>
      <linearGradient id="gBody" x1="0" x2="1">
        <stop offset="0%" stop-color="#9beaff"/><stop offset="100%" stop-color="var(--c)"/>
      </linearGradient>
      <radialGradient id="gGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="var(--c)" stop-opacity=".35"/>
        <stop offset="100%" stop-color="var(--c)" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="120" r="70" fill="url(#gGlow)"/>
    <g class="head" transform="translate(55,50)">
      <rect x="0" y="0" width="90" height="70" rx="22" fill="url(#gBody)"/>
      <rect x="7" y="7" width="76" height="56" rx="16" fill="#0b1324"/>
      <g class="eyes"><circle cx="28" cy="35" r="7" fill="#e7fbff"/><circle cx="62" cy="35" r="7" fill="#e7fbff"/></g>
      <path d="M22 49 Q45 60 68 49" fill="none" stroke="#e7fbff" stroke-width="4" stroke-linecap="round"/>
      <g class="antenna"><rect x="42" y="-16" width="6" height="18" rx="3" fill="#b6ecff"/><circle cx="45" cy="-20" r="6" fill="var(--c)"/></g>
    </g>
    <g stroke="#b6ecff" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M40 105 Q30 110 22 118"/><path d="M160 105 Q170 110 178 118"/>
    </g>
    <ellipse cx="100" cy="130" rx="32" ry="24" fill="url(#gBody)"/>
    <circle cx="100" cy="158" r="10" fill="#b6ecff"/><rect x="90" y="165" width="20" height="12" rx="6" fill="#b6ecff"/>
  </svg>
  <div class="ring">
    <div class="orb orb--chat"><svg viewBox="0 0 48 48"><path d="M8 10h32v20H18l-10 8v-8H8z" fill="#fff"/></svg></div>
    <div class="orb orb--alert"><svg viewBox="0 0 48 48"><rect x="22" y="10" width="4" height="22" rx="2" fill="#fff"/><circle cx="24" cy="38" r="3" fill="#fff"/></svg></div>
    <div class="orb orb--gear"><svg viewBox="0 0 48 48"><path d="M27 6h-6l-1 5-5 2-4-3-4 4 3 4-2 5-5 1v6l5 1 2 5-3 4 4 4 4-3 5 2 1 5h6l1-5 5-2 4 3 4-4-3-4 2-5 5-1v-6l-5-1-2-5 3-4-4-4-4 3-5-2-1-5zm-3 12a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" fill="#fff"/></svg></div>
    <div class="orb orb--wrench"><svg viewBox="0 0 48 48"><path d="M27 6a11 11 0 0 0 9 15l-9 9-6-6 9-9A11 11 0 0 0 27 6zM9 39l8-8 6 6-8 8-6-6z" fill="#fff"/></svg></div>
  </div>
</div>`;
    this._root = root;
  }

  attributeChangedCallback() {
    // If 'size' is present, lock to that px; otherwise responsive.
    this._applyProps();
  }

  connectedCallback() {
    this._applyProps();
    // Orbit animation loop (unchanged)
    const wrap = this._root.querySelector(".wrap");
    const orbs = [
      { el: this._root.querySelector(".orb--chat"), phase: 0.0 },
      { el: this._root.querySelector(".orb--alert"), phase: 0.25 },
      { el: this._root.querySelector(".orb--gear"), phase: 0.5 },
      { el: this._root.querySelector(".orb--wrench"), phase: 0.75 },
    ];
    const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
    const rx = () =>
      parseFloat(getComputedStyle(wrap).getPropertyValue("--rx"));
    const ry = () =>
      parseFloat(getComputedStyle(wrap).getPropertyValue("--ry"));
    const speed = () =>
      parseFloat(getComputedStyle(wrap).getPropertyValue("--speed"));
    let start = performance.now();
    const frame = (now) => {
      const lap = ((now - start) / (speed() * 1000)) % 1;
      for (const { el, phase } of orbs) {
        const p = (lap + phase) % 1;
        const th = 2 * Math.PI * ease(p);
        const x = rx() * Math.cos(th),
          y = ry() * Math.sin(th);
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${y}px`);
        el.setAttribute(
          "data-depth",
          y > 12 ? "front" : y < -12 ? "back" : "mid"
        );
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    // Responsiveness: observe the host's rendered width
    this._ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentBoxSize?.[0]?.inlineSize || e.contentRect.width;
        if (!this.hasAttribute("size")) this._setSize(w); // only auto if size not fixed
      }
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    this._ro && this._ro.disconnect();
  }

  _applyProps() {
    const wrap = this._root.querySelector(".wrap");
    if (!wrap) return;
    const speed = this.getAttribute("speed") || 3.2;
    const color = this.getAttribute("color") || "#38bdf8";
    wrap.style.setProperty("--speed", `${speed}s`);
    wrap.style.setProperty("--c", color);

    if (this.hasAttribute("size")) {
      const sAttr = this.getAttribute("size");
      // accept numbers (px) or CSS lengths (e.g., 12vw, 100%)
      if (/^\d+(\.\d+)?$/.test(sAttr)) this._setSize(parseFloat(sAttr));
      else (this.style.width = sAttr), (this.style.height = "auto"); // e.g., 12vw
    }
  }

  _setSize(px) {
    const wrap = this._root.querySelector(".wrap");
    wrap.style.setProperty("--size", `${px}px`);
    // derived values depend on --size via CSS calc()
    // height follows width via aspect-ratio on :host
  }
}
customElements.define("clofix-orbit-logo", ClofixOrbitLogo);
