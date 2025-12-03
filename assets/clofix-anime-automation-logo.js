// ======================================================================
// CloFix Automation & Management - DevOps Pipeline Orchestrator
// File: clofix-anime-automation-logo.js
//
// Visual narrative:
//   - A horizontal CI/CD conveyor pipeline: CODE → BUILD → TEST → DEPLOY → SCALE
//   - Workload blocks ride the belt automatically
//   - Animated gears drive the belt (no manual effort)
//   - On the right: scalable cloud infra receiving the final artifact
//   - Status badges show uptime + cost efficiency
//
// This says:
//   "CloFix automates your delivery pipeline end-to-end AND keeps it
//    running in production efficiently."
//
// Props supported:
//   variant="orbit"   -> compact orbit card layout
//   color="#38bdf8"   -> glow accent
//   speed="4"         -> animation cycle seconds
//   data-href="..."   -> make card clickable
//
// ======================================================================

class ClofixAutomationLogo extends HTMLElement {
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
    const accentAttr = this.getAttribute("color") || "#38bdf8";
    const speedAttr = parseFloat(this.getAttribute("speed"));
    const baseSpeed = isNaN(speedAttr) ? 4 : speedAttr;

    this.shadowRoot.host.style.setProperty("--accent", accentAttr);
    this.shadowRoot.host.style.setProperty("--anim-speed", baseSpeed + "s");
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

  --anim-speed: 4s;

  /* Stage colors */
  --stage-code-from:   #6366f1;
  --stage-code-to:     #8b5cf6;

  --stage-build-from:  #0ea5e9;
  --stage-build-to:    #38bdf8;

  --stage-test-from:   #ec4899;
  --stage-test-to:     #fb7185;

  --stage-deploy-from: #4ade80;
  --stage-deploy-to:   #22d3ee;

  --stage-scale-from:  #fb923c;
  --stage-scale-to:    #facc15;

  --uptime-green: #4ade80;
  --cost-gold:    #facc15;
  --infra-warm:   #fb923c;
  --cloud-cyan:   #38bdf8;

  display:inline-flex;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",
               Roboto,"Helvetica Neue",Arial,sans-serif;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* =========================================================
   CARD SHELL
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

/* multi-hue aura: pipeline cyan, scale orange, uptime green */
.c-card-shell::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:
    radial-gradient(circle at 25% 30%, rgba(56,189,248,.28) 0%, transparent 60%),  /* pipeline cyan */
    radial-gradient(circle at 70% 70%, rgba(251,146,60,.28) 0%, transparent 60%),  /* scale orange  */
    radial-gradient(circle at 50% 50%, rgba(74,222,128,.20) 0%, transparent 70%);  /* uptime green  */
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
    0 0 40px rgba(56,189,248,.35),
    0 0 50px rgba(251,146,60,.35),
    0 30px 60px rgba(0,0,0,0.9);
}

/* subtle star bg */
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

/* glow pad under pipeline */
.floor-glow{
  position:absolute;
  left:50%;
  top:78%;
  width:140px;
  height:46px;
  transform:translate(-50%,-50%);
  background:
    radial-gradient(ellipse at 40% 40%, rgba(56,189,248,.4) 0%, transparent 70%),
    radial-gradient(ellipse at 60% 60%, rgba(251,146,60,.35) 0%, transparent 70%),
    radial-gradient(ellipse at 50% 50%, rgba(74,222,128,.25) 0%, transparent 75%);
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
   PIPELINE BELT
========================================================= */

/* angled "assembly line" strip */
.pipeline-belt{
  position:absolute;
  left:50%;
  top:48%;
  width:120px;
  height:50px;
  transform:
    translate(-50%,-50%)
    perspective(480px)
    rotateX(32deg)
    rotateY(-15deg);
  transform-style:preserve-3d;
  background: rgba(15,23,42,0.6);
  border:1px solid rgba(148,163,184,.4);
  border-radius:10px;
  box-shadow:
    0 20px 30px rgba(0,0,0,.9),
    0 0 24px rgba(56,189,248,.4),
    0 0 36px rgba(251,146,60,.3),
    0 0 40px rgba(74,222,128,.3);

  background-image:
    repeating-linear-gradient(
      90deg,
      rgba(148,163,184,.15) 0px,
      rgba(148,163,184,.15) 1px,
      rgba(0,0,0,0) 1px,
      rgba(0,0,0,0) 10px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(148,163,184,.08) 0px,
      rgba(148,163,184,.08) 1px,
      rgba(0,0,0,0) 1px,
      rgba(0,0,0,0) 10px
    );
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* individual stage tiles on top of belt */
.stages{
  position:absolute;
  inset:4px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  z-index:3;
  pointer-events:none;
  transform:translateZ(10px);
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-weight:700;
  font-size:6px;
  line-height:1.15;
  text-align:center;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
}

.stage-tile{
  width:36px;
  height:26px;
  border-radius:6px;
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 8px 14px rgba(0,0,0,.9),
    0 0 10px rgba(255,255,255,.5);
  display:grid;
  place-items:center;
  position:relative;
  overflow:hidden;
  animation: tilePulse var(--anim-speed) ease-in-out infinite;
}
@keyframes tilePulse{
  0%,100%{
    filter:
      drop-shadow(0 0 4px rgba(255,255,255,.6))
      drop-shadow(0 0 16px rgba(255,255,255,.4));
  }
  50%{
    filter:
      drop-shadow(0 0 6px rgba(255,255,255,.9))
      drop-shadow(0 0 24px rgba(255,255,255,.6));
  }
}

/* Each stage gets its own gradient color */
.stage-code{
  background:linear-gradient(
    145deg,
    var(--stage-code-from) 0%,
    var(--stage-code-to) 70%
  );
}
.stage-build{
  background:linear-gradient(
    145deg,
    var(--stage-build-from) 0%,
    var(--stage-build-to) 70%
  );
  animation-delay: calc(var(--anim-speed)*0.15);
}
.stage-test{
  background:linear-gradient(
    145deg,
    var(--stage-test-from) 0%,
    var(--stage-test-to) 70%
  );
  animation-delay: calc(var(--anim-speed)*0.3);
}
.stage-deploy{
  background:linear-gradient(
    145deg,
    var(--stage-deploy-from) 0%,
    var(--stage-deploy-to) 70%
  );
  animation-delay: calc(var(--anim-speed)*0.45);
}
.stage-scale{
  background:linear-gradient(
    145deg,
    var(--stage-scale-from) 0%,
    var(--stage-scale-to) 70%
  );
  animation-delay: calc(var(--anim-speed)*0.6);
}

.stage-inner{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  line-height:1.15;
}
.stage-icon{
  font-size:8px;
  font-weight:700;
  margin-bottom:2px;
}
.stage-label{
  font-size:6px;
  font-weight:700;
  letter-spacing:-0.03em;
}

/* moving workload block riding the belt */
.workload{
  --size: 14px;
  position:absolute;
  left:12px;
  top:22px;
  width:var(--size);
  height:var(--size);
  border-radius:4px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--accent) 40%, rgba(0,0,0,0) 70%);
  border:1px solid rgba(255,255,255,.7);
  box-shadow:
    0 0 6px var(--accent),
    0 0 18px color-mix(in srgb, var(--accent) 60%, transparent),
    0 0 36px color-mix(in srgb, var(--accent) 30%, transparent);
  filter:
    drop-shadow(0 0 3px var(--accent))
    drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 50%, transparent))
    drop-shadow(0 0 16px color-mix(in srgb, var(--accent) 20%, transparent));
  transform:translateZ(18px);
  animation: workloadTravel var(--anim-speed) linear infinite;
}
@keyframes workloadTravel{
  0%   { left:10px;  }
  25%  { left:35px;  }
  50%  { left:65px;  }
  75%  { left:95px;  }
  100% { left:10px;  }
}

/* gears powering the belt */
.gear-row{
  position:absolute;
  left:8px;
  bottom:-6px;
  width:60px;
  height:20px;
  display:flex;
  gap:6px;
  color:#fff;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:8px;
  font-weight:700;
  line-height:1;
  text-shadow:
    0 0 6px rgba(255,255,255,.9),
    0 0 14px rgba(251,146,60,.6),
    0 0 20px rgba(0,0,0,.9);
}
.gear-tile{
  min-width:16px;
  min-height:16px;
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

/* =========================================================
   CLOUD TARGET / SCALE TARGET
========================================================= */

.cloud-target{
  position:absolute;
  right:6px;
  top:8px;
  width:48px;
  height:30px;
  border-radius:10px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255,255,255,.9) 0%, rgba(56,189,248,.4) 30%, rgba(0,0,0,0) 70%);
  border:2px solid rgba(56,189,248,.6);
  box-shadow:
    0 0 8px rgba(56,189,248,.7),
    0 0 20px rgba(56,189,248,.5),
    0 12px 20px rgba(0,0,0,.9);
  text-align:center;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:7px;
  font-weight:700;
  line-height:30px;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
}

/* autoscale stack (prod capacity) */
.scale-stack{
  position:absolute;
  right:10px;
  bottom:26px;
  width:36px;
  height:34px;
  animation: bobStack calc(var(--anim-speed)*1.2) ease-in-out infinite;
  filter:
    drop-shadow(0 0 6px rgba(251,146,60,.6))
    drop-shadow(0 0 14px rgba(250,204,21,.5))
    drop-shadow(0 20px 30px rgba(0,0,0,.9));
}
@keyframes bobStack{
  0%,100%{transform:translateY(0);}
  50%    {transform:translateY(-4px);}
}
.stack-base{
  position:absolute;
  left:50%;
  bottom:0;
  transform:translateX(-50%);
  width:36px;
  height:10px;
  border-radius:5px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--stage-scale-from) 30%, rgba(0,0,0,0) 70%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 0 10px rgba(251,146,60,.7),
    0 0 24px rgba(250,204,21,.5),
    0 20px 30px rgba(0,0,0,.9);
}
.stack-columns{
  position:absolute;
  left:50%;
  bottom:10px;
  transform:translateX(-50%);
  display:flex;
  gap:4px;
}
.stack-col{
  width:8px;
  height:20px;
  border-radius:2px;
  background:linear-gradient(to bottom,#1e293b 0%,#0a0f2a 70%);
  border:1px solid rgba(255,255,255,.4);
  box-shadow:
    0 0 6px rgba(251,146,60,.6),
    0 0 16px rgba(0,0,0,.8);
  animation: scalePulse var(--anim-speed) ease-in-out infinite;
}
.stack-col:nth-child(2){ animation-delay: calc(var(--anim-speed)*0.25); }
.stack-col:nth-child(3){ animation-delay: calc(var(--anim-speed)*0.5); }
@keyframes scalePulse{
  0%,100%{height:18px;}
  50%    {height:26px;}
}

/* label below stack */
.stack-label{
  position:absolute;
  left:50%;
  bottom:-14px;
  transform:translateX(-50%);
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:7px;
  font-weight:700;
  color:#fff;
  text-shadow:
    0 0 4px rgba(255,255,255,.9),
    0 0 8px rgba(251,146,60,.7),
    0 0 14px rgba(250,204,21,.5);
}
.stack-label::after{
  content:"SCALE";
  letter-spacing:-0.03em;
}

/* =========================================================
   BADGES: UPTIME + COST
========================================================= */

.badge-uptime{
  position:absolute;
  left:8px;
  top:8px;
  min-width:46px;
  height:22px;
  border-radius:6px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--uptime-green) 30%, rgba(0,0,0,0) 70%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 10px 20px rgba(0,0,0,.85),
    0 0 14px rgba(74,222,128,.6),
    0 0 24px rgba(74,222,128,.4),
    0 20px 30px rgba(0,0,0,.9);
  padding:3px 4px;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:6px;
  font-weight:700;
  line-height:1.15;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
  display:flex;
  align-items:center;
  justify-content:space-between;
  animation: bobBadge calc(var(--anim-speed)*1.2) ease-in-out infinite;
}
@keyframes bobBadge{
  0%,100%{transform:translateY(0);}
  50%    {transform:translateY(-3px);}
}
.badge-uptime .val{
  font-weight:700;
}
.badge-uptime .tag{
  font-weight:700;
  font-size:6px;
}

.badge-cost{
  position:absolute;
  left:8px;
  bottom:20px;
  min-width:40px;
  height:22px;
  border-radius:6px;
  background:
    radial-gradient(circle at 30% 30%, #fff 0%, var(--cost-gold) 30%, rgba(0,0,0,0) 70%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:
    0 10px 20px rgba(0,0,0,.85),
    0 0 14px rgba(250,204,21,.6),
    0 0 24px rgba(250,204,21,.4),
    0 20px 30px rgba(0,0,0,.9);
  padding:3px 4px;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:6px;
  font-weight:700;
  line-height:1.15;
  color:#0a0f2a;
  text-shadow:0 0 4px rgba(255,255,255,.9);
  display:grid;
  place-items:center;
  animation: bobBadge calc(var(--anim-speed)*1.2) ease-in-out infinite;
  animation-delay:.2s;
}
.badge-cost .icon{
  font-size:7px;
  font-weight:700;
  line-height:1;
}
.badge-cost .label{
  font-size:6px;
  font-weight:700;
  line-height:1.1;
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
    0 0 16px rgba(251,146,60,.5),
    0 0 22px rgba(0,0,0,.8);
}

.brand{
  background: radial-gradient(circle at 20% 20%, #38bdf8 0%, #ec4899 40%, #4ade80 80%);
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
    var(--stage-code-from) 0%,
    var(--stage-build-from) 25%,
    var(--stage-test-from) 50%,
    var(--stage-deploy-from) 75%,
    var(--stage-scale-from) 100%
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
   RESPONSIVE (normal)
========================================================= */
@media(max-width:480px){
  .c-card-shell{
    flex-direction:column;
    text-align:center;
    max-width:90vw;
  }
}

/* =========================================================
   ORBIT VARIANT
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
    0 0 32px rgba(56,189,248,.4),
    0 0 72px rgba(251,146,60,.4),
    0 0 88px rgba(74,222,128,.3);
}
:host([variant="orbit"]) .c-card-shell::before{
  filter:blur(28px);
  opacity:.8;
}

/* compact visual */
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
    0 0 16px rgba(251,146,60,.5),
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
   ANIMS SUMMARY:
   - shellPulse    : card glow breathing
   - twinkle       : bg particles
   - padPulse      : base glow
   - tilePulse     : each pipeline stage "alive"
   - workloadTravel: workload block traveling through stages
   - gearBlink     : gears energizing pipeline
   - scalePulse    : autoscaling infra stack
   - bobStack / bobBadge : float subtle motion
   - headlineSweep : underline sweep in title
========================================================= */

</style>

<div class="c-card-shell">
  <!-- VISUAL CORE -->
  <div class="visual-wrap" aria-hidden="true">
    <div class="bg-stars"></div>
    <div class="floor-glow"></div>

    <!-- pipeline / CI-CD delivery belt -->
    <div class="pipeline-belt">

      <!-- workload moving along stages -->
      <div class="workload"></div>

      <!-- devops stages -->
      <div class="stages">
        <div class="stage-tile stage-code">
          <div class="stage-inner">
            <div class="stage-icon">{ }</div>
            <div class="stage-label">CODE</div>
          </div>
        </div>
        <div class="stage-tile stage-build">
          <div class="stage-inner">
            <div class="stage-icon">🔧</div>
            <div class="stage-label">BUILD</div>
          </div>
        </div>
        <div class="stage-tile stage-test">
          <div class="stage-inner">
            <div class="stage-icon">🧪</div>
            <div class="stage-label">TEST</div>
          </div>
        </div>
        <div class="stage-tile stage-deploy">
          <div class="stage-inner">
            <div class="stage-icon">🚀</div>
            <div class="stage-label">DEPLOY</div>
          </div>
        </div>
        <div class="stage-tile stage-scale">
          <div class="stage-inner">
            <div class="stage-icon">📈</div>
            <div class="stage-label">SCALE</div>
          </div>
        </div>
      </div>

      <!-- powering gears -->
      <div class="gear-row">
        <div class="gear-tile">⚙</div>
        <div class="gear-tile">⚙</div>
      </div>
    </div>

    <!-- production cloud target -->
    <div class="cloud-target">CLOUD</div>

    <!-- autoscale infra stack -->
    <div class="scale-stack">
      <div class="stack-base"></div>
      <div class="stack-columns">
        <div class="stack-col"></div>
        <div class="stack-col"></div>
        <div class="stack-col"></div>
      </div>
      <div class="stack-label"></div>
    </div>

    <!-- uptime badge -->
    <div class="badge-uptime">
      <div class="val">99.99%</div>
      <div class="tag">UP</div>
    </div>

    <!-- cost badge -->
    <div class="badge-cost">
      <div class="icon">💸</div>
      <div class="label">OPT</div>
    </div>

  </div>

  <!-- TEXT CONTENT -->
  <div class="text-block">
    <div class="headline">
      <span class="brand">CloFix</span>
      <span class="dash">–</span>
      <span class="service">Automation &amp; Management</span>
    </div>
    <div class="subline">
      End-to-end DevOps automation: we build, test, deploy, scale, and keep it
      healthy in production. Less manual work, faster delivery, lower cost.
    </div>
  </div>
</div>
    `;
  }
}

if (!customElements.get("clofix-automation-logo")) {
  customElements.define("clofix-automation-logo", ClofixAutomationLogo);
}
