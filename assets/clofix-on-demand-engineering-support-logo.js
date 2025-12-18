class ClofixOnDemandEngineeringSupportLogo extends HTMLElement {
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
    this.bindNav();
  }

  attributeChangedCallback() {
    this.applyProps();
    this.bindNav();
  }

  applyProps() {
    const accent = this.getAttribute("color") || "#38bdf8";
    const sp = parseFloat(this.getAttribute("speed"));
    const speed = isNaN(sp) ? 4 : sp;

    const root = this.shadowRoot.host;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--anim-speed", speed + "s");
  }

  bindNav() {
    const href = this.getAttribute("data-href");
    const card = this.shadowRoot.querySelector(".card");
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
  --accent: #38bdf8;
  --accent-hot: #ff4d6a;
  --accent-good: #4ade80;
  --bg-card-top: radial-gradient(circle at 20% 20%, rgba(56,189,248,0.22) 0%, rgba(0,0,0,0) 60%),
                 radial-gradient(circle at 80% 80%, rgba(255,77,106,0.18) 0%, rgba(0,0,0,0) 60%),
                 linear-gradient(160deg, rgba(18,28,52,0.95) 0%, rgba(7,10,22,0.6) 70%);
  --text-main:#f8fafc;
  --text-dim:#94a3b8;
  --anim-speed:4s;

  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  display:inline-flex;
}

/* CARD =============================================================*/
.card{
  position:relative;
  display:flex;
  flex-direction:column;
  width:220px;
  min-width:220px;
  max-width:220px;
  height:220px;
  max-height:220px;
  gap:1rem;
  padding:.8rem .8rem .7rem;
  border-radius:20px;

  background: var(--bg-card-top);
  border:1px solid rgba(148,163,184,.22);

  box-shadow:
    0 28px 48px rgba(0,0,0,.9),
    0 0 40px rgba(0,0,0,.9),
    0 0 64px color-mix(in srgb,var(--accent)40%,transparent),
    0 0 90px rgba(0,0,0,.9);

  isolation:isolate;
  overflow:hidden;
  user-select:none;
}

/* soft aura glow */
.card::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,.12) 0%, transparent 60%),
    radial-gradient(circle at 70% 70%, color-mix(in srgb,var(--accent)40%,transparent) 0%, transparent 60%);
  filter:blur(30px);
  opacity:.4;
  animation:cardGlow calc(var(--anim-speed)*1.5) ease-in-out infinite;
  pointer-events:none;
}
@keyframes cardGlow{
  0%,100%{opacity:.25;}
  50%{opacity:.7;}
}

/* TOP VISUAL: ENGINEERING POD ======================================*/
.pod-wrap{
  position:relative;
  flex:0 0 auto;
  height:120px;
  min-height:120px;
  max-height:120px;
  width:100%;
  border-radius:14px;
  background:radial-gradient(circle at 50% 40%,rgba(15,23,42,.7) 0%,rgba(7,10,22,.3) 70%);
  border:1px solid rgba(148,163,184,.28);
  box-shadow:
    0 24px 40px rgba(0,0,0,.9),
    0 0 24px color-mix(in srgb,var(--accent)25%,transparent),
    0 0 60px rgba(0,0,0,.8);
  overflow:hidden;
  isolation:isolate;
}

/* orbit ring for floating tool icons */
.tool-orbit{
  position:absolute;
  left:50%;
  top:50%;
  width:110px;
  height:110px;
  transform:translate(-50%,-50%);
  pointer-events:none;
  animation:orbitSpin var(--anim-speed) linear infinite;
}
@keyframes orbitSpin{
  0%{transform:translate(-50%,-50%) rotate(0deg);}
  100%{transform:translate(-50%,-50%) rotate(360deg);}
}

/* individual tool icon (gear / wrench / shield / chat) */
.tool{
  position:absolute;
  width:22px;
  height:22px;
  border-radius:6px;
  font-size:11px;
  font-weight:600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  line-height:22px;
  text-align:center;
  color:#0a0f1f;
  box-shadow:
    0 6px 14px rgba(0,0,0,.9),
    0 0 12px rgba(0,0,0,.8);

  background:radial-gradient(circle at 30% 30%,#fff 0%,var(--accent)40%,rgba(0,0,0,0)70%);
  filter:
    drop-shadow(0 0 4px var(--accent))
    drop-shadow(0 0 12px rgba(0,0,0,.8));
}

/* place tools on orbit (top/right/bottom/left-ish) */
.tool-1{left:50%;top:0%;transform:translate(-50%,-50%);}
.tool-2{right:0%;top:50%;transform:translate(50%,-50%);}
.tool-3{left:50%;bottom:0%;transform:translate(-50%,50%);}
.tool-4{left:0%;top:50%;transform:translate(-50%,-50%);}

/* floating platform under the engineer */
.platform{
  position:absolute;
  left:50%;
  top:58%;
  width:120px;
  height:60px;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 45%,rgba(255,255,255,.9) 0%,rgba(255,255,255,0)60%),
    radial-gradient(circle at 50% 60%,rgba(0,0,0,.25)0%,rgba(0,0,0,0)70%);
  box-shadow:
    0 30px 40px rgba(0,0,0,.9),
    0 0 30px rgba(0,0,0,.9),
    0 0 40px color-mix(in srgb,var(--accent)35%,transparent);
  border:2px solid rgba(255,255,255,.15);

  animation:podBob calc(var(--anim-speed)*2) ease-in-out infinite;
}
@keyframes podBob{
  0%,100%{transform:translate(-50%,-50%) translateY(0);}
  50%{transform:translate(-50%,-50%) translateY(-4px);}
}

/* little melt/drip glow below platform to mimic reference style */
.platform::after{
  content:"";
  position:absolute;
  left:50%;
  top:100%;
  width:90px;
  height:28px;
  transform:translate(-50%,0);
  background:radial-gradient(circle at 50% 0%,rgba(56,189,248,.45)0%,rgba(0,0,0,0)70%);
  filter:blur(12px);
  opacity:.6;
}

/* the desk + engineer group */
.desk-cluster{
  position:absolute;
  left:50%;
  top:38%;
  width:90px;
  height:60px;
  transform:translate(-50%,-50%) scale(1);
  transform-origin:center center;
  animation:podBob calc(var(--anim-speed)*2) ease-in-out infinite;
  /* same bob as platform so they feel connected */
  font-size:0;
}

/* desk slab */
.desk-surface{
  position:absolute;
  left:50%;
  top:22px;
  width:80px;
  height:16px;
  transform:translateX(-50%);
  border-radius:3px;
  background:linear-gradient(#1e293b 0%,#0f172a 100%);
  box-shadow:0 6px 12px rgba(0,0,0,.8);
  border:1px solid rgba(255,255,255,.08);
}

/* monitor block left (question / alert) */
.screen-left{
  position:absolute;
  left:14px;
  top:2px;
  width:28px;
  height:18px;
  border-radius:3px;
  background:radial-gradient(circle at 50% 40%,#1e3a8a 0%,#000 70%);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 4px 8px rgba(0,0,0,.9),0 0 8px rgba(0,0,0,.8);
  overflow:hidden;
  isolation:isolate;
}
.alertMark{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  font-size:11px;
  font-weight:700;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color:#fff;
  text-shadow:
    0 0 4px var(--accent-hot),
    0 0 8px rgba(0,0,0,.9);
  animation:alertPulse calc(var(--anim-speed)*0.6) ease-in-out infinite;
}
@keyframes alertPulse{
  0%,100%{color:#fff;text-shadow:0 0 4px var(--accent-hot),0 0 8px rgba(0,0,0,.9);}
  50%{color:var(--accent-hot);text-shadow:0 0 6px var(--accent-hot),0 0 10px rgba(0,0,0,.9);}
}

/* monitor block right (logs / typing) */
.screen-right{
  position:absolute;
  left:46px;
  top:2px;
  width:28px;
  height:18px;
  border-radius:3px;
  background:radial-gradient(circle at 50% 40%,#0f766e 0%,#000 70%);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 4px 8px rgba(0,0,0,.9),0 0 8px rgba(0,0,0,.8);
  overflow:hidden;
  isolation:isolate;
}

.typingDots{
  position:absolute;
  left:50%;
  bottom:3px;
  transform:translateX(-50%);
  width:14px;
  height:4px;
  display:flex;
  justify-content:space-between;
}
.typingDots span{
  width:3px;
  height:3px;
  border-radius:50%;
  background:#fff;
  box-shadow:0 0 4px rgba(255,255,255,.7);
  animation:dotBlink calc(var(--anim-speed)*0.4) infinite;
}
.typingDots span:nth-child(2){animation-delay:.12s;}
.typingDots span:nth-child(3){animation-delay:.24s;}

@keyframes dotBlink{
  0%,100%{opacity:.3;}
  50%{opacity:1;}
}

/* coffee mug (tiny red element to echo your ref vibe) */
.mug{
  position:absolute;
  left:12px;
  top:22px;
  width:6px;
  height:6px;
  border-radius:2px 2px 2px 2px;
  background:radial-gradient(circle at 30% 30%,#fff 0%,#dc2626 40%,rgba(0,0,0,0)70%);
  box-shadow:0 3px 6px rgba(0,0,0,.9);
  border:1px solid rgba(255,255,255,.15);
}
.mug::after{
  content:"";
  position:absolute;
  right:-2px;
  top:2px;
  width:3px;
  height:3px;
  border:1px solid rgba(255,255,255,.6);
  border-radius:2px;
  border-left:none;
  background:transparent;
}

/* engineer body (simple block forms, headset implied) */
.engineer-chair{
  position:absolute;
  left:44px;
  top:28px;
  width:18px;
  height:18px;
  border-radius:3px;
  background:linear-gradient(#1e293b 0%,#0f172a 100%);
  box-shadow:0 4px 8px rgba(0,0,0,.9);
  border:1px solid rgba(255,255,255,.08);
}

.engineer-body{
  position:absolute;
  left:40px;
  top:14px;
  width:18px;
  height:16px;
  border-radius:3px;
  background:linear-gradient(#ef4444 0%,#7f1d1d 100%);
  box-shadow:0 4px 8px rgba(0,0,0,.9);
  border:1px solid rgba(255,255,255,.1);
}
.engineer-head{
  position:absolute;
  left:45px;
  top:6px;
  width:10px;
  height:10px;
  border-radius:50%;
  background:linear-gradient(#1f2937 0%,#0f172a 100%);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 4px 8px rgba(0,0,0,.9);
}
/* headset band */
.engineer-head::after{
  content:"";
  position:absolute;
  left:-2px;
  top:4px;
  width:14px;
  height:4px;
  border-radius:2px;
  background:#0f172a;
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 0 6px rgba(0,0,0,.8);
}
/* mic boom */
.engineer-head::before{
  content:"";
  position:absolute;
  left:8px;
  top:6px;
  width:6px;
  height:2px;
  border-radius:2px;
  background:#0f172a;
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 0 4px rgba(0,0,0,.8);
}

/* BOTTOM TEXT BAND ================================================*/
.textband{
  flex:1 1 auto;
  margin-top:.7rem;
  line-height:1.35;
  max-width:100%;
  text-align:left;
  overflow:hidden;
  color:var(--text-main);
}

.headline{
  font-size:.8rem;
  font-weight:600;
  letter-spacing:-0.03em;
  line-height:1.3;
  display:flex;
  flex-wrap:wrap;
  align-items:baseline;
  gap:.35rem;
  text-shadow:
    0 0 10px rgba(0,0,0,.9),
    0 0 20px color-mix(in srgb,var(--accent)40%,transparent);
}
.brand{
  font-weight:600;
  background:radial-gradient(circle at 20% 20%,var(--accent)0%,#4ade80 60%);
  -webkit-background-clip:text;
  color:transparent;
  filter:
    drop-shadow(0 0 4px rgba(255,255,255,.5))
    drop-shadow(0 0 10px color-mix(in srgb,var(--accent)40%,transparent));
}
.dash{
  color:var(--text-main);
  opacity:.6;
}
.service{
  color:var(--text-main);
  font-weight:500;
  position:relative;
  line-height:1.2;
}
.service::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-.2rem;
  height:2px;
  width:100%;
  background:linear-gradient(90deg,var(--accent)0%,rgba(0,0,0,0)90%);
  box-shadow:
    0 0 6px var(--accent),
    0 0 14px rgba(0,0,0,.8);
  animation:svcSweep 2s linear infinite;
}
@keyframes svcSweep{
  0%{clip-path:inset(0 100% 0 0);}
  50%{clip-path:inset(0 20% 0 0);}
  100%{clip-path:inset(0 100% 0 0);}
}

.subtext{
  margin-top:.45rem;
  font-size:.7rem;
  font-weight:400;
  color:var(--text-dim);
  line-height:1.35;
  text-shadow:0 0 10px rgba(0,0,0,.9);

  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* DOT ANIM SPEED INHERITS VAR(--anim-speed) -----------------------*/
</style>

<div class="card">
  <div class="pod-wrap" aria-hidden="true">
    <!-- orbiting tool icons -->
    <div class="tool-orbit">
      <div class="tool tool-1">🛠</div>
      <div class="tool tool-2">⚙</div>
      <div class="tool tool-3">🛡</div>
      <div class="tool tool-4">💬</div>
    </div>

    <!-- platform + desk + engineer -->
    <div class="platform"></div>

    <div class="desk-cluster">
      <div class="screen-left"><div class="alertMark">?</div></div>
      <div class="screen-right">
        <div class="typingDots"><span></span><span></span><span></span></div>
      </div>
      <div class="desk-surface"></div>
      <div class="mug"></div>

      <div class="engineer-body"></div>
      <div class="engineer-head"></div>
      <div class="engineer-chair"></div>
    </div>
  </div>

  <div class="textband">
    <div class="headline">
      <span class="brand">CloFix</span>
      <span class="dash">–</span>
      <span class="service">On-Demand Support</span>
    </div>
    <div class="subtext">
      Instant expert support for secure, stable, and optimized systems
    </div>
  </div>
</div>
    `;
  }
}

if (!customElements.get("clofix-on-demand-engineering-support-logo")) {
  customElements.define(
    "clofix-on-demand-engineering-support-logo",
    ClofixOnDemandEngineeringSupportLogo
  );
}
