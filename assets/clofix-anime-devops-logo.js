// ======================================================================
// CloFix DevSecOps - Threat Hunt & Release Gate
// File: clofix-anime-devops-logo.js
//
// Narrative visual:
//   - Containers/artifacts move down a pipeline (conveyor).
//   - A live security scanner (red/magenta lens) inspects them for malware.
//   - Only "clean" artifacts reach the secure gate and ship to cloud.
//   - Gate is represented by a shield/lock + production cloud behind it.
//   - Gears + pipeline icons = automation & deployment flow.
//
// Message to the user at a glance:
//   "CloFix blocks bad code from ever reaching production."
//
// Props supported:
//   variant="orbit"   -> compact tile layout for orbit carousel
//   color="#38bdf8"   -> aura accent around the outer card
//   speed="4"         -> animation cycle seconds
//   data-href="..."   -> makes whole card clickable
//
// ======================================================================

class ClofixDevOpsLogo extends HTMLElement {
  static get observedAttributes() {
    return ["color", "speed", "data-href", "variant"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.applyProps();
    this.setupClickNav();
  }

  attributeChangedCallback() {
    this.applyProps();
    this.setupClickNav();
  }

  applyProps() {
    const accent = this.getAttribute("color") || "#38bdf8";
    const spd = parseFloat(this.getAttribute("speed"));
    const dur = isNaN(spd) ? 4 : spd;
    this.shadowRoot.host.style.setProperty("--accent", accent);
    this.shadowRoot.host.style.setProperty("--anim-speed", dur + "s");
  }

  setupClickNav() {
    const href = this.getAttribute("data-href");
    const card = this.shadowRoot.querySelector(".c-card-shell");
    if (!card) return;
    if (href) {
      card.style.cursor = "pointer";
      card.addEventListener(
        "click",
        (this._clickHandler = () => {
          window.location.href = href;
        })
      );
    } else {
      card.style.cursor = "default";
      if (this._clickHandler) {
        card.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
<style>
:host {
  --panel-bg: #0d1023;
  --panel-grad-start: #1a2145;
  --panel-grad-end:   #0f152f;

  --border-card: rgba(148,163,184,0.22);
  --text-main: #f8fafc;
  --text-dim:  #94a3b8;

  --accent: #38bdf8;
  --accent-soft: color-mix(in srgb, var(--accent) 40%, transparent);
  --accent-dim:  color-mix(in srgb, var(--accent) 15%, transparent);

  --anim-speed: 4s;

  /* Color language for this concept */
  --scan-hot-start: #ff005e;  /* intense magenta/red */
  --scan-hot-end:   #ff7a7a;  /* warm red/orange */
  --clean-start:    #22d3ee;  /* cyan/teal */
  --clean-end:      #4ade80;  /* green */
  --infra-warm:     #fb923c;  /* orange under infra blocks */

  --gate-shield-top:    #38bdf8;
  --gate-shield-bottom: #4ade80;

  --cloud-wireframe: #38bdf8;
  --conveyor-bg: rgba(15,23,42,0.6);

  display:inline-flex;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",
               Roboto,"Helvetica Neue",Arial,sans-serif;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* =========================================================
   CARD WRAPPER
========================================================= */
.c-card-shell{
  position:relative;
  display:flex;
  align-items:center;
  gap:1rem;

  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%),
    radial-gradient(circle at 80% 80%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%),
    linear-gradient(
      to bottom right,
      color-mix(in srgb, var(--panel-grad-start) 90%, transparent) 0%,
      color-mix(in srgb, var(--panel-grad-end)   60%, transparent) 100%
    );
  background-color:var(--panel-bg);

  border:1px solid var(--border-card);
  border-radius:1rem;
  padding:1rem 1.25rem;
  min-width:300px;
  max-width:680px;

  box-shadow:
    0 30px 70px rgba(0,0,0,0.9),
    0 0 40px var(--accent-soft),
    0 0 120px rgba(0,0,0,0.9);

  user-select:none;
  isolation:isolate;
}

/* Multicolor aura bloom around shell */
.c-card-shell::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:
    radial-gradient(circle at 30% 30%, rgba(255,0,90,.35) 0%, transparent 60%),     /* scan magenta */
    radial-gradient(circle at 70% 70%, rgba(56,189,248,.28) 0%, transparent 60%),   /* cyan */
    radial-gradient(circle at 50% 50%, rgba(74,222,128,.22) 0%, transparent 70%);   /* green */
  filter:blur(36px);
  opacity:.7;
  pointer-events:none;
  mix-blend-mode:screen;
  animation:shellPulse calc(var(--anim-speed)*1.2) ease-in-out infinite;
}
@keyframes shellPulse{
  0%,100%{opacity:.45;}
  50%    {opacity:.9;}
}

/* =========================================================
   VISUAL CORE
========================================================= */

.visual-wrap{
  position:relative;
  width:160px;
  height:160px;
  min-width:160px;
  min-height:160px;
  border-radius:1rem;
  background-color:#0a0f2a;
  border:1px solid rgba(148,163,184,0.28);
  overflow:hidden;
  isolation:isolate;

  display:grid;
  place-items:center;

  box-shadow:
    0 0 40px rgba(255,0,90,.35),
    0 0 50px rgba(56,189,248,.35),
    0 30px 60px rgba(0,0,0,0.9);
}

/* Subtle star texture */
.bg-stars{
  position:absolute;
  inset:0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.9) 0 1px, transparent 2px),
    radial-gradient(circle at 70% 60%, rgba(255,255,255,.6) 0 1px, transparent 2px),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,.5) 0 1px, transparent 2px);
  background-size:200px 200px;
  mix-blend-mode:screen;
  opacity:.4;
  filter:drop-shadow(0 0 4px rgba(255,255,255,.9));
  animation: twinkle calc(var(--anim-speed)*2) ease-in-out infinite;
}
@keyframes twinkle{
  0%,100%{opacity:.35;}
  50%    {opacity:.7;}
}

/* Ground glow pad */
.floor-glow{
  position:absolute;
  left:50%;
  top:76%;
  width:130px;
  height:44px;
  transform:translate(-50%,-50%);
  background:
    radial-gradient(ellipse at 40% 40%, rgba(255,0,90,.4) 0%, transparent 70%),
    radial-gradient(ellipse at 60% 60%, rgba(56,189,248,.35) 0%, transparent 70%);
  filter:blur(28px);
  opacity:.8;
  mix-blend-mode:screen;
  animation: padPulse calc(var(--anim-speed)*1.2) ease-in-out infinite;
}
@keyframes padPulse{
  0%,100%{opacity:.55;}
  50%    {opacity:.95;}
}

/* =========================================================
   PIPELINE / CONVEYOR
========================================================= */

/* The angled conveyor track that carries artifacts */
.conveyor{
  position:absolute;
  left:50%;
  top:50%;
  width:110px;
  height:50px;
  transform:translate(-50%,-50%) perspective(500px) rotateX(35deg) rotateY(-18deg);
  transform-style:preserve-3d;

  background:var(--conveyor-bg);
  border:1px solid rgba(148,163,184,.4);
  border-radius:10px;
  box-shadow:
    0 20px 30px rgba(0,0,0,.9),
    0 0 24px rgba(56,189,248,.4),
    0 0 36px rgba(255,0,90,.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  isolation:isolate;
}

/* subtle grid lines on conveyor */
.conveyor::before{
  content:"";
  position:absolute;
  inset:4px;
  border-radius:6px;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(148,163,184,.15) 0px,
      rgba(148,163,184,.15) 1px,
      rgba(0,0,0,0) 1px,
      rgba(0,0,0,0) 10px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(148,163,184,.15) 0px,
      rgba(148,163,184,.15) 1px,
      rgba(0,0,0,0) 1px,
      rgba(0,0,0,0) 10px
    );
  background-color: rgba(0,0,0,.15);
  box-shadow:
    0 0 12px rgba(56,189,248,.4),
    0 0 24px rgba(255,0,90,.3);
  filter:brightness(1.05);
  pointer-events:none;
}

/* =========================================================
   ARTIFACTS / CONTAINERS moving along conveyor
========================================================= */

.artifacts{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:space-around;
  padding:0 8px;
  z-index:3;
  pointer-events:none;
  transform-style:preserve-3d;
}

.artifact{
  width:18px;
  height:18px;
  border-radius:4px;
  background: radial-gradient(circle at 30% 30%, #fff 0%, #1e293b 40%, #0a0f2a 80%);
  border:1px solid rgba(255,255,255,.5);
  box-shadow:
    0 6px 10px rgba(0,0,0,.85),
    0 0 10px rgba(255,255,255,.4);
  position:relative;
  transform:translateZ(8px);
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:7px;
  font-weight:600;
  line-height:18px;
  text-align:center;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
  animation: driftArtifact var(--anim-speed) linear infinite;
}
/* stagger motion so they "flow" */
.artifact:nth-child(2){ animation-delay: calc(var(--anim-speed)*-0.25); }
.artifact:nth-child(3){ animation-delay: calc(var(--anim-speed)*-0.5);  }

@keyframes driftArtifact{
  0%   { transform:translateZ(8px) translateX(-8px); }
  100% { transform:translateZ(8px) translateX(8px);  }
}

/* malicious flag overlay (only on first artifact visually) */
.artifact.bad{
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, #3b0a1a 40%, #1a0008 80%);
  border-color: rgba(255,0,90,.7);
  box-shadow:
    0 6px 10px rgba(0,0,0,.9),
    0 0 10px rgba(255,0,90,.6),
    0 0 18px rgba(255,0,90,.4);
  color:#fff;
  text-shadow:0 0 4px rgba(255,0,90,.9);
}

/* =========================================================
   SCAN LENS
========================================================= */

.scan-lens{
  position:absolute;
  left:18px;
  top:16px;
  width:40px;
  height:40px;
  border-radius:50%;
  background:
    radial-gradient(circle at 40% 40%, var(--scan-hot-start) 0%, rgba(255,0,90,0) 70%);
  box-shadow:
    0 0 10px var(--scan-hot-start),
    0 0 30px rgba(255,0,90,.6),
    0 20px 40px rgba(0,0,0,.9);
  border:2px solid rgba(255,255,255,.4);
  filter:brightness(1.2);
  transform:translateZ(20px);
  mix-blend-mode:screen;
  animation: lensSweep calc(var(--anim-speed)*1.2) ease-in-out infinite;
}
@keyframes lensSweep{
  0%   { transform:translateZ(20px) translateX(-4px) translateY(-2px) scale(1);   opacity:.8; }
  50%  { transform:translateZ(20px) translateX(4px)  translateY(2px)  scale(1.08);opacity:1;  }
  100% { transform:translateZ(20px) translateX(-4px) translateY(-2px) scale(1);   opacity:.8; }
}

/* malware glyph in the scan (bug / alert) */
.scan-lens::after{
  content:"✖";
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  font-size:14px;
  font-weight:700;
  color:#fff;
  text-shadow:
    0 0 6px #fff,
    0 0 12px var(--scan-hot-start),
    0 0 24px rgba(255,0,90,.8);
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}

/* =========================================================
   RELEASE GATE / SHIELD
========================================================= */

/* gate body */
.release-gate{
  position:absolute;
  right:-6px;
  top:-4px;
  width:46px;
  height:54px;
  transform:translateZ(30px);
  filter:
    drop-shadow(0 0 8px rgba(56,189,248,.6))
    drop-shadow(0 0 20px rgba(74,222,128,.5))
    drop-shadow(0 0 32px rgba(0,0,0,.9));
  pointer-events:none;
}

/* shield plate */
.shield{
  position:absolute;
  right:0;
  top:0;
  width:36px;
  height:42px;
  clip-path:polygon(
    50% 0%,
    90% 15%,
    90% 60%,
    50% 100%,
    10% 60%,
    10% 15%
  );
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--gate-shield-top) 30%, var(--gate-shield-bottom) 70%);
  border:2px solid rgba(255,255,255,.7);
  box-shadow:
    0 0 8px rgba(56,189,248,.8),
    0 0 20px rgba(74,222,128,.5),
    0 0 32px rgba(0,0,0,.8);
  display:grid;
  place-items:center;
  font-size:8px;
  font-weight:700;
  color:#0a0f2a;
  text-shadow:0 0 4px #fff;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  animation: gatePulse var(--anim-speed) ease-in-out infinite;
}
@keyframes gatePulse{
  0%,100%{filter:brightness(1);}
  50%    {filter:brightness(1.4);}
}
.shield::after{
  content:"CLEAN";
  letter-spacing:-0.04em;
}

/* prod cloud behind shield */
.prod-cloud{
  position:absolute;
  right:2px;
  top:38px;
  width:44px;
  height:22px;
  border-radius:20px;
  background: radial-gradient(circle at 20% 30%, rgba(56,189,248,.4) 0%, rgba(0,0,0,0) 70%);
  border:2px solid rgba(56,189,248,.6);
  box-shadow:
    0 0 8px rgba(56,189,248,.7),
    0 0 20px rgba(74,222,128,.5),
    0 12px 20px rgba(0,0,0,.9);
  filter:brightness(1.2);
}
.prod-cloud::after{
  content:"☁ prod";
  position:absolute;
  left:50%; top:50%;
  transform:translate(-50%,-50%);
  font-size:7px;
  font-weight:600;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
}

/* =========================================================
   AUTOMATION GEARS + PIPE ICONS NEAR CONVEYOR EXIT
   (communicates "it's automated release machinery")
========================================================= */

.gear-cluster{
  position:absolute;
  left:-4px;
  bottom:-2px;
  width:40px;
  height:22px;
  display:flex;
  align-items:flex-end;
  gap:4px;
  color:#fff;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:8px;
  font-weight:700;
  text-shadow:
    0 0 6px rgba(255,255,255,.9),
    0 0 14px rgba(251,146,60,.6),
    0 0 20px rgba(0,0,0,.9);
}

.gear{
  min-width:14px;
  min-height:14px;
  border-radius:4px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--infra-warm) 30%, rgba(0,0,0,0) 70%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 0 8px rgba(251,146,60,.7),
    0 0 20px rgba(251,146,60,.4),
    0 12px 18px rgba(0,0,0,.9);
  display:grid;
  place-items:center;
  line-height:1;
  color:#0a0f2a;
  animation: gearBlink calc(var(--anim-speed)*1.5) steps(1,end) infinite;
}
@keyframes gearBlink{
  0%,90%{filter:brightness(1);}
  95%,100%{filter:brightness(1.4);}
}

/* deploy arrow block */
.deploy-chip{
  min-width:18px;
  min-height:14px;
  border-radius:4px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--clean-start) 30%, var(--clean-end) 70%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 0 8px rgba(56,189,248,.7),
    0 0 20px rgba(74,222,128,.5),
    0 12px 18px rgba(0,0,0,.9);
  display:grid;
  place-items:center;
  line-height:1;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
}

/* icons inside gear/deploy tiles */
.gear-icon,
.deploy-icon{
  font-size:8px;
  font-weight:700;
  line-height:1;
}

/* =========================================================
   TEXT CONTENT
========================================================= */

.text-block{
  position:relative;
  z-index:2;
  display:flex;
  flex-direction:column;
  line-height:1.4;
  max-width:480px;
  color:var(--text-main);
}

.headline{
  font-size:0.95rem;
  font-weight:600;
  letter-spacing:-0.03em;
  display:flex;
  flex-wrap:wrap;
  align-items:baseline;
  gap:.4rem;
  text-shadow:
    0 0 10px rgba(56,189,248,.6),
    0 0 16px rgba(255,0,90,.5),
    0 0 22px rgba(0,0,0,.8);
}

.brand{
  background: radial-gradient(circle at 20% 20%, #ff005e 0%, #38bdf8 50%, #4ade80 80%);
  -webkit-background-clip:text;
  color:transparent;
  font-weight:600;
  filter:drop-shadow(0 0 6px rgba(255,255,255,.6));
}

.dash{
  color:var(--text-main);
  opacity:.6;
}

.service{
  color:var(--text-main);
  font-weight:500;
  position:relative;
}
.service::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-0.25rem;
  height:2px;
  width:100%;
  background:linear-gradient(
    90deg,
    var(--scan-hot-start) 0%,
    var(--clean-start) 50%,
    var(--clean-end) 100%
  );
  box-shadow:
    0 0 6px rgba(255,255,255,.6),
    0 0 18px rgba(56,189,248,.4),
    0 0 24px rgba(0,0,0,.8);
  animation: headlineSweep 2.4s infinite linear;
}
@keyframes headlineSweep{
  0%   { clip-path: inset(0 100% 0 0); }
  50%  { clip-path: inset(0 30% 0 0); }
  100% { clip-path: inset(0 100% 0 0); }
}

.subline{
  color:var(--text-dim);
  font-size:0.8rem;
  font-weight:400;
  max-width:46ch;
  margin-top:.6rem;
  line-height:1.45;
}

/* =========================================================
   RESPONSIVE (normal usage)
========================================================= */
@media(max-width:480px){
  .c-card-shell{
    flex-direction:column;
    text-align:center;
    max-width:90vw;
  }
}

/* =========================================================
   ORBIT VARIANT (carousel tile)
========================================================= */

:host([variant="orbit"]) .c-card-shell{
  flex-direction:column;
  align-items:stretch;
  width:100%;
  max-width:220px;
  min-width:220px;
  height:220px;
  max-height:220px;
  padding:0.9rem;
  border-radius:20px;

  box-shadow:
    0 20px 40px rgba(0,0,0,0.9),
    0 0 32px rgba(255,0,90,.4),
    0 0 72px rgba(56,189,248,.4),
    0 0 88px rgba(74,222,128,.3);
}
:host([variant="orbit"]) .c-card-shell::before{
  filter:blur(28px);
  opacity:.8;
}

/* shrink visual */
:host([variant="orbit"]) .visual-wrap{
  width:100%;
  height:120px;
  min-height:120px;
  max-height:120px;
  border-radius:12px;
}

:host([variant="orbit"]) .text-block{
  flex:1 1 auto;
  max-width:100%;
  margin-top:0.75rem;
  text-align:left;
  line-height:1.35;
  overflow:hidden;
}
:host([variant="orbit"]) .headline{
  font-size:0.8rem;
  line-height:1.3;
  gap:.35rem;
  text-shadow:
    0 0 10px rgba(56,189,248,.6),
    0 0 16px rgba(255,0,90,.5),
    0 0 22px rgba(0,0,0,.8);
}
:host([variant="orbit"]) .brand{
  font-size:0.8rem;
  font-weight:600;
}
:host([variant="orbit"]) .service{
  font-size:0.8rem;
  font-weight:500;
}
:host([variant="orbit"]) .service::after{
  bottom:-0.2rem;
  height:2px;
  animation-duration:2s;
}
:host([variant="orbit"]) .subline{
  margin-top:.4rem;
  font-size:0.7rem;
  line-height:1.35;
  color:var(--text-dim);

  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* =========================================================
   KEY ANIMATIONS SUMMARY
   - twinkle: star bg twinkle
   - padPulse: ground glow breathing
   - driftArtifact: little containers "flow"
   - lensSweep: scanner hover motion
   - gatePulse: secure gate heartbeat
   - gearBlink: automation blip
========================================================= */

</style>

<div class="c-card-shell">
  <!-- VISUAL CORE -->
  <div class="visual-wrap" aria-hidden="true">
    <div class="bg-stars"></div>
    <div class="floor-glow"></div>

    <!-- Conveyor / pipeline -->
    <div class="conveyor">
      <!-- artifacts moving (some are 'bad') -->
      <div class="artifacts">
        <div class="artifact bad">X</div>
        <div class="artifact">OK</div>
        <div class="artifact">OK</div>
      </div>

      <!-- active scanning lens -->
      <div class="scan-lens"></div>

      <!-- automation gears + deploy chip at exit side -->
      <div class="gear-cluster">
        <div class="gear"><div class="gear-icon">⚙</div></div>
        <div class="deploy-chip"><div class="deploy-icon">⇪</div></div>
      </div>

      <!-- final release / prod gate -->
      <div class="release-gate">
        <div class="shield"></div>
        <div class="prod-cloud"></div>
      </div>
    </div>

  </div>

  <!-- TEXT CONTENT -->
  <div class="text-block">
    <div class="headline">
      <span class="brand">CloFix</span>
      <span class="dash">–</span>
      <span class="service">DevSecOps Support</span>
    </div>
    <div class="subline">
      CloFix intercepts insecure code before it ships. We scan, remediate, and enforce policy at the pipeline — only verified builds are allowed through to production.
    </div>
  </div>
</div>
    `;
  }
}

if (!customElements.get("clofix-devops-logo")) {
  customElements.define("clofix-devops-logo", ClofixDevOpsLogo);
}
