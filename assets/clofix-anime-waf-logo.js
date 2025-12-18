class ClofixWAFLogo extends HTMLElement {
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
    const accent = this.getAttribute("color") || "#38bdf8"; // trusted traffic / safe
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
  /* core palette */
  --accent: #38bdf8;     /* clean safe traffic / good state */
  --accent-hot: #ff4d6a; /* attacker / fire / bad */
  --accent-warn: #facc15;/* caution */
  --accent-safe: #4ade80;/* shield check */
  --bg-card-top:
    radial-gradient(circle at 15% 15%, rgba(255,77,106,0.22) 0%, rgba(0,0,0,0) 60%),
    radial-gradient(circle at 80% 80%, rgba(56,189,248,0.18) 0%, rgba(0,0,0,0) 60%),
    linear-gradient(160deg, rgba(32,8,16,0.9) 0%, rgba(7,10,22,0.7) 70%);

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

/* CARD WRAPPER ===================================================== */
.card{
  position:relative;
  display:flex;
  flex-direction:column;
  width:220px;
  min-width:220px;
  max-width:220px;
  height:220px;
  max-height:220px;
  padding:.8rem .8rem .7rem;
  gap:1rem;
  border-radius:20px;

  background: var(--bg-card-top);
  border:1px solid rgba(148,163,184,.22);

  box-shadow:
    0 28px 48px rgba(0,0,0,.9),
    0 0 40px rgba(0,0,0,.9),
    0 0 64px color-mix(in srgb,var(--accent)35%,transparent),
    0 0 90px rgba(0,0,0,.9);

  isolation:isolate;
  overflow:hidden;
  user-select:none;
}

/* subtle cyber aura */
.card::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,77,106,.4) 0%, transparent 60%),
    radial-gradient(circle at 70% 80%, color-mix(in srgb,var(--accent)40%,transparent) 0%, transparent 60%);
  filter:blur(36px);
  opacity:.45;
  animation:globalGlow calc(var(--anim-speed)*1.3) ease-in-out infinite;
  pointer-events:none;
}
@keyframes globalGlow{
  0%,100%{opacity:.3;}
  50%{opacity:.8;}
}

/* TOP VISUAL: FIREWALL SCENE ======================================= */
.scene{
  position:relative;
  flex:0 0 auto;
  height:120px;
  min-height:120px;
  max-height:120px;
  width:100%;
  border-radius:14px;
  background:radial-gradient(circle at 50% 40%,rgba(15,15,30,.7) 0%,rgba(7,10,22,.4) 70%);
  border:1px solid rgba(148,163,184,.28);
  box-shadow:
    0 24px 40px rgba(0,0,0,.9),
    0 0 24px color-mix(in srgb,var(--accent)25%,transparent),
    0 0 60px rgba(0,0,0,.8);
  overflow:hidden;
  isolation:isolate;
}

/* LAYER ORDERING
   flames (left/right)
   wall block (with scan)
   shield overlayed on wall
   HUD panels bottom
*/

/* ---------- WALL / FIREWALL BLOCK ---------- */
.wall{
  position:absolute;
  left:50%;
  top:45%;
  width:130px;
  height:60px;
  transform:translate(-50%,-50%);
  border-radius:6px;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(15,23,42,1) 0px,
      rgba(15,23,42,1) 14px,
      rgba(30,41,59,1) 14px,
      rgba(30,41,59,1) 15px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(51,65,85,0.5) 0px,
      rgba(51,65,85,0.5) 32px,
      rgba(0,0,0,0) 32px,
      rgba(0,0,0,0) 33px
    );
  border:1px solid rgba(148,163,184,.4);
  box-shadow:
    0 20px 30px rgba(0,0,0,.9),
    0 0 20px rgba(0,0,0,.8),
    0 0 30px rgba(0,0,0,.8);
  overflow:hidden;
  isolation:isolate;
}

/* moving scan bar that sweeps horizontally across bricks */
.wall-scan{
  position:absolute;
  top:0;
  left:-40%;
  width:40%;
  height:100%;
  background:linear-gradient(
    90deg,
    rgba(56,189,248,0) 0%,
    color-mix(in srgb,var(--accent)60%,transparent) 40%,
    rgba(56,189,248,0) 100%
  );
  mix-blend-mode:screen;
  filter:
    drop-shadow(0 0 6px var(--accent))
    drop-shadow(0 0 16px color-mix(in srgb,var(--accent)50%,transparent));
  animation:wallSweep var(--anim-speed) linear infinite;
  opacity:.6;
}
@keyframes wallSweep{
  0%{left:-40%;}
  100%{left:100%;}
}

/* ---------- CENTER SHIELD ---------- */
.shield-wrap{
  position:absolute;
  left:50%;
  top:45%;
  transform:translate(-50%,-50%);
  width:60px;
  height:60px;
  border-radius:50%;
  box-shadow:
    0 0 20px rgba(0,0,0,1),
    0 0 40px rgba(0,0,0,.8);
  filter:drop-shadow(0 0 8px rgba(0,0,0,.9));
  animation:shieldBreath calc(var(--anim-speed)*1.1) ease-in-out infinite;
}
@keyframes shieldBreath{
  0%,100%{filter:drop-shadow(0 0 6px var(--accent-safe)) drop-shadow(0 0 20px rgba(0,0,0,.9));}
  50%{filter:drop-shadow(0 0 10px var(--accent-safe)) drop-shadow(0 0 30px rgba(0,0,0,.9));}
}

/* shield body (hex-ish / badge-like) */
.shield-core{
  position:absolute;
  left:50%;
  top:50%;
  width:46px;
  height:50px;
  transform:translate(-50%,-50%);
  clip-path:polygon(
    50% 0%,
    90% 20%,
    90% 60%,
    50% 100%,
    10% 60%,
    10% 20%
  );
  background:
    radial-gradient(circle at 30% 30%,#0a0f1f 0%,rgba(0,0,0,0)70%),
    radial-gradient(circle at 50% 50%,rgba(16,185,129,.4)0%,rgba(0,0,0,0)70%);
  border:2px solid color-mix(in srgb,var(--accent-safe)70%,#000 30%);
  box-shadow:
    0 0 6px var(--accent-safe),
    0 0 16px color-mix(in srgb,var(--accent-safe)60%,transparent),
    0 0 32px rgba(0,0,0,1);
  position:relative;
}

/* small inner badge w/ check mark */
.shield-mark{
  position:absolute;
  left:50%;
  top:50%;
  width:26px;
  height:30px;
  transform:translate(-50%,-50%);
  clip-path:polygon(
    50% 0%,
    90% 25%,
    90% 70%,
    50% 100%,
    10% 70%,
    10% 25%
  );
  background:
    radial-gradient(circle at 30% 30%,#fff 0%,var(--accent-hot)40%,rgba(0,0,0,0)70%);
  border:2px solid rgba(0,0,0,.6);
  box-shadow:
    0 0 8px var(--accent-hot),
    0 0 20px rgba(255,77,106,.5),
    0 0 30px rgba(0,0,0,.8);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:10px;
  font-weight:700;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color:#fff;
  text-shadow:
    0 0 4px rgba(0,0,0,1),
    0 0 8px rgba(0,0,0,1),
    0 0 10px var(--accent-hot);
}
.shield-mark::after{
  content:"✔";
  color:#fff;
}

/* ---------- FLAMES / THREATS ---------- */
.flame{
  position:absolute;
  width:22px;
  height:28px;
  border-radius:40% 40% 50% 50%;
  background:
    radial-gradient(circle at 50% 30%, #fff 0%, var(--accent-hot)40%, rgba(0,0,0,0)70%);
  border:1px solid rgba(0,0,0,.6);
  box-shadow:
    0 0 8px var(--accent-hot),
    0 0 20px rgba(255,77,106,.6),
    0 0 36px rgba(255,77,106,.3),
    0 16px 30px rgba(0,0,0,.9);
  filter:
    drop-shadow(0 0 4px var(--accent-hot))
    drop-shadow(0 0 12px rgba(0,0,0,.8));
  animation:flameFlicker calc(var(--anim-speed)*0.5) infinite;
}
@keyframes flameFlicker{
  0%,100%{transform:scale(1) translateY(0); filter:brightness(1);}
  40%{transform:scale(1.08) translateY(-2px); filter:brightness(1.3);}
  70%{transform:scale(0.95) translateY(1px); filter:brightness(0.9);}
}

.flame-left{
  left:18px;
  top:48px;
}
.flame-right{
  right:18px;
  top:48px;
}

/* ---------- HUD PANELS / INFO CARDS ---------- */
.hud-row{
  position:absolute;
  left:50%;
  bottom:6px;
  width:140px;
  transform:translateX(-50%);
  display:flex;
  justify-content:space-between;
  font-size:8px;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}

.hud-box{
  flex:0 0 auto;
  min-width:60px;
  max-width:60px;
  background:rgba(0,0,0,.5);
  border:1px solid rgba(148,163,184,.4);
  border-radius:4px;
  padding:3px 4px 4px;
  line-height:1.25;
  box-shadow:
    0 12px 20px rgba(0,0,0,.9),
    0 0 12px rgba(0,0,0,.8);
  color:var(--text-main);
}
.hud-box.secure{
  box-shadow:
    0 0 8px var(--accent),
    0 0 20px color-mix(in srgb,var(--accent)60%,transparent),
    0 12px 20px rgba(0,0,0,.9);
  border-color: color-mix(in srgb,var(--accent)60%,transparent);
}
.hud-head{
  font-weight:700;
  display:flex;
  justify-content:space-between;
  color:var(--text-main);
}
.hud-head .tag-ok{
  color:var(--accent-safe);
  text-shadow:
    0 0 4px var(--accent-safe),
    0 0 10px rgba(0,0,0,.9);
}
.hud-head .tag-hot{
  color:var(--accent-hot);
  text-shadow:
    0 0 4px var(--accent-hot),
    0 0 10px rgba(0,0,0,.9);
}
.hud-body{
  margin-top:2px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  color:var(--text-dim);
  font-weight:500;
}

/* BOTTOM TEXT AREA ================================================= */
.textblock{
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
  background:linear-gradient(
    90deg,
    var(--accent) 0%,
    rgba(0,0,0,0) 90%
  );
  box-shadow:
    0 0 6px var(--accent),
    0 0 14px rgba(0,0,0,.8);
  animation:underlineSweep 2s linear infinite;
}
@keyframes underlineSweep{
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

/* NOTE:
   This component is already designed for orbit tile (220x220).
   No extra desktop variant here because your orbit carousel
   uses compact cards. You can still render it without variant
   if you want, sizing will remain 220x220.
*/
</style>

<div class="card">
  <div class="scene" aria-hidden="true">
    <!-- animated flames / attacker pressure -->
    <div class="flame flame-left"></div>
    <div class="flame flame-right"></div>

    <!-- firewall body + scan -->
    <div class="wall">
      <div class="wall-scan"></div>
    </div>

    <!-- central shield with check -->
    <div class="shield-wrap">
      <div class="shield-core">
        <div class="shield-mark"></div>
      </div>
    </div>

    <!-- status HUD boxes -->
    <div class="hud-row">
      <div class="hud-box">
        <div class="hud-head">
          <span class="tag-hot">BLOCK</span>
          <span>18 req/s</span>
        </div>
        <div class="hud-body">bots / L7 abuse</div>
      </div>
      <div class="hud-box secure">
        <div class="hud-head">
          <span class="tag-ok">ALLOW</span>
          <span>OK</span>
        </div>
        <div class="hud-body">CDN + API clean</div>
      </div>
    </div>
  </div>

  <div class="textblock">
    <div class="headline">
      <span class="brand">CloFix</span>
      <span class="dash">–</span>
      <span class="service">WAF</span>
    </div>
    <div class="subtext">
      Real-time attack filtering that keeps apps fast and secure
    </div>
  </div>
</div>
    `;
  }
}

if (!customElements.get("clofix-waf-logo")) {
  customElements.define("clofix-waf-logo", ClofixWAFLogo);
}
