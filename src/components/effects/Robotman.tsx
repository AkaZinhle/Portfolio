import React, { useEffect, useRef } from 'react';

const SPRITE = "/assets/images/robot-man.png";
const SPRITE_PX = 128;
const SCREEN = { x: 75.5, y: 39.0, w: 55.0, h: 48.0 };

const CFG = {
  name: "ROBOTMAN",
  size: 67,
  radius: 24,
  gravity: 1900,
  bounce: 0.62,
  margin: 36,
  solid: "h1,h2,h3,h4,h5,h6,p,li,blockquote,a,button,label,figcaption,.rm-solid",
  messages: [
    "click me for info!",
    "psst... over here",
    "throw me around!",
    "i bounce on text",
    "beep boop?",
    "what's behind this screen?"
  ],
  boot: [
    "ROBOTMAN OS v4.2",
    "MEM CHECK ........ 64TB OK",
    "AI CORE .......... ONLINE",
    "PHOSPHOR ......... RETRO CRT",
    ""
  ],
  info: [
    "HELLO, HUMAN.",
    "I AM ROBOTMAN, WONGAI'S FLOATING AI LAB COMPANION.",
    "WONGAI (ZEE) RANKIN IS AN AI SYSTEMS ENGINEER SPECIALIZING IN",
    "YOLOV8 COMPUTER VISION, LOCAL LLM FINE-TUNING (MISTRAL 7B),",
    "AND AGENTIC PROTOCOLS (MODEL CONTEXT PROTOCOL & GOOGLE AP2).",
    "",
    "YOU CAN THROW ME AT PARAGRAPHS, HEADINGS, AND BUTTONS,",
    "OR TYPE 'help' FOR AVAILABLE TERMINAL COMMANDS."
  ],
  links: [
    "SELECTED WORK ... #projects",
    "SKILL CODEX ..... #capabilities",
    "ABOUT BIO ....... #about",
    "CONTACT ......... #contact",
    "GITHUB .......... github.com/AkaZinhle",
    "LINKEDIN ........ linkedin.com/in/wongai-rankin"
  ]
};

export const Robotman: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const S = CFG.size;
    const R = CFG.radius;
    const K0 = S / SPRITE_PX;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    /* ---------- DOM elements ---------- */
    const bot = document.createElement("div");
    bot.className = "rm-bot";
    root.appendChild(bot);

    const img = document.createElement("img");
    img.src = SPRITE;
    img.alt = "Robotman";
    img.draggable = false;
    bot.appendChild(img);

    bot.tabIndex = 0;
    bot.setAttribute("role", "button");
    bot.setAttribute("aria-label", "Robotman: open info console");

    const bubble = document.createElement("div");
    bubble.className = "rm-bubble";
    root.appendChild(bubble);

    const ov = document.createElement("div");
    ov.className = "rm-ov";
    root.appendChild(ov);

    ov.innerHTML = `
      <div class="rm-dim"></div>
      <img class="rm-zoom" alt="Robotman zoom">
      <div class="rm-con" role="dialog" aria-modal="true" aria-label="Robotman console">
        <div class="rm-bezel">
          <div class="rm-bar">
            <span>${CFG.name} TERMINAL</span>
            <button class="rm-x" aria-label="Close console">X</button>
          </div>
          <div class="rm-screen">
            <div class="rm-text">
              <div class="rm-out"></div>
              <div class="rm-in"><span class="rm-pr">&gt;</span><span class="rm-a"></span><i class="rm-cur"></i><span class="rm-b"></span></div>
            </div>
            <canvas class="rm-noise" width="96" height="72"></canvas>
            <div class="rm-scan"></div>
            <div class="rm-roll"></div>
            <div class="rm-vig"></div>
            <input class="rm-field" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Type a command">
          </div>
          <div class="rm-foot">
            <b class="led"></b>
            <span>ESC = EXIT</span>
            <span class="rm-brand">ROBOTMAN-9000</span>
          </div>
        </div>
      </div>
    `;

    const $q = <T extends Element = Element>(s: string) => ov.querySelector(s) as T;
    const zoom = $q<HTMLImageElement>(".rm-zoom");
    const con = $q<HTMLDivElement>(".rm-con");
    const out = $q<HTMLDivElement>(".rm-out");
    const scroller = $q<HTMLDivElement>(".rm-text");
    const field = $q<HTMLInputElement>(".rm-field");
    const pa = $q<HTMLSpanElement>(".rm-a");
    const pb = $q<HTMLSpanElement>(".rm-b");
    const noise = $q<HTMLCanvasElement>(".rm-noise");
    const screenEl = $q<HTMLDivElement>(".rm-screen");
    const closeBtn = $q<HTMLButtonElement>(".rm-x");
    const dimEl = $q<HTMLDivElement>(".rm-dim");
    zoom.src = SPRITE;

    /* ---------- state ---------- */
    let W = window.innerWidth;
    let H = window.innerHeight;
    let mode = "float";
    let busy = false;
    let drag: { ox: number; oy: number; sx: number; sy: number; t0: number; moved: boolean; pts: { x: number; y: number; t: number }[]; prev: string } | null = null;
    let x = W - S / 2 - CFG.margin;
    let y = H * 0.45;
    let vx = 0;
    let vy = 0;
    let ang = 0;
    let av = 0;
    let t = 0;
    let idle = 0;
    let thrownTime = 0;

    const homeX = () => W - S / 2 - CFG.margin;
    const homeY = () => H * 0.45;

    /* ---------- solid text rectangles (page coordinates) ---------- */
    let rects: { l: number; t: number; r: number; b: number }[] = [];
    let scanTimer: number;

    function scan() {
      const outList: { l: number; t: number; r: number; b: number }[] = [];
      const seen = new WeakSet<Node>();
      const sx = window.scrollX;
      const sy = window.scrollY;

      document.querySelectorAll(CFG.solid).forEach(el => {
        if (el.closest(".rm-root,[data-rm-ignore]")) return;
        const cs = window.getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") return;
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = w.nextNode())) {
          if (seen.has(n) || !n.nodeValue?.trim()) continue;
          seen.add(n);
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const q of r.getClientRects()) {
            if (q.width > 6 && q.height > 6) {
              outList.push({ l: q.left + sx, t: q.top + sy, r: q.right + sx, b: q.bottom + sy });
            }
          }
        }
      });
      rects = outList;
    }

    const rescan = () => {
      window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(scan, 150);
    };

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      rescan();
    };

    window.addEventListener("resize", handleResize);
    document.fonts?.ready?.then(scan);
    const observer = new MutationObserver((mutations) => {
      // Ignore DOM mutations that occur within carousel or explicitly ignored containers
      const hasRelevantMutation = mutations.some((m) => {
        const target = m.target as HTMLElement;
        return !target.closest?.(".rm-root, [data-rm-ignore]");
      });
      if (hasRelevantMutation) rescan();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    scan();

    /* ---------- speech bubble ---------- */
    let sayUntil = 0;
    let nextSay = 2.5;
    let msgI = 0;

    function say(txt: string, sec = 3.4) {
      bubble.textContent = txt;
      bubble.classList.add("on");
      sayUntil = t + sec;
    }

    const hush = () => {
      bubble.classList.remove("on");
      sayUntil = 0;
    };

    bubble.addEventListener("click", () => openConsole());

    function placeBubble() {
      if (!bubble.classList.contains("on")) return;
      const bw = bubble.offsetWidth;
      const bh = bubble.offsetHeight;
      const left = clamp(x - bw + 44, 10, W - bw - 10);
      let top = y - R - bh - 18;
      let flip = false;
      if (top < 10) {
        top = y + R + 18;
        flip = true;
      }
      bubble.classList.toggle("flip", flip);
      bubble.style.setProperty("--tx", `${clamp(x - left, 18, bw - 18)}px`);
      bubble.style.translate = `${left}px ${top}px`;
    }

    /* ---------- physics ---------- */
    let contact = false;

    function hit(nx: number, ny: number, pen: number, h: number) {
      x += nx * pen;
      y += ny * pen;
      contact = true;
      const vn = vx * nx + vy * ny;
      if (vn >= 0) return;
      const e = -vn > 90 ? CFG.bounce : 0;
      if (-vn > 1100 && !busy && t > sayUntil) {
        say(["ow!", "oof!", "bonk!"][(Math.random() * 3) | 0], 1.2);
      }
      vx -= (1 + e) * vn * nx;
      vy -= (1 + e) * vn * ny;
      const tx = -ny;
      const ty = nx;
      const vt = vx * tx + vy * ty;
      const k = Math.min(1, 9 * h);
      vx -= vt * k * tx;
      vy -= vt * k * ty;
      av += (vt / R - av) * 0.2;
    }

    function physics(dt: number) {
      const sp = Math.hypot(vx, vy);
      const n = clamp(Math.ceil(sp * dt / 10), 1, 8);
      const h = dt / n;
      contact = false;
      for (let i = 0; i < n; i++) {
        vy += CFG.gravity * h;
        x += vx * h;
        y += vy * h;
        if (x < R) hit(1, 0, R - x, h);
        if (x > W - R) hit(-1, 0, x - (W - R), h);
        if (y < R) hit(0, 1, R - y, h);
        if (y > H - R) hit(0, -1, y - (H - R), h);

        const sx = window.scrollX;
        const sy = window.scrollY;
        for (const q of rects) {
          const l = q.l - sx;
          const tp = q.t - sy;
          const r = q.r - sx;
          const b = q.b - sy;
          if (r < x - R || l > x + R || b < y - R || tp > y + R) continue;
          const cx = clamp(x, l, r);
          const cy = clamp(y, tp, b);
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.hypot(dx, dy);
          if (d >= R) continue;
          if (d > 0.001) hit(dx / d, dy / d, R - d, h);
          else {
            const m = [[x - l, -1, 0], [r - x, 1, 0], [y - tp, 0, -1], [b - y, 0, 1]].sort((a, c) => a[0] - c[0])[0];
            hit(m[1], m[2], m[0] + R, h);
          }
        }
      }
      vx *= Math.exp(-0.12 * dt);
      av *= Math.exp(-(contact ? 2 : 0.4) * dt);
      const resting = (contact && Math.hypot(vx, vy) < 160) || (t - thrownTime > 1.2);
      if (resting) {
        vx *= 0.88;
        if (Math.abs(vx) < 8) vx = 0;
        av = 0;
        ang += (Math.round(ang / 6.2832) * 6.2832 - ang) * Math.min(1, dt * 7);
        idle += dt;
      } else {
        ang += av * dt;
        idle = 0;
      }

      // Return home after about 2 seconds
      if (idle > 0.8 || (t - thrownTime >= 2.0)) {
        mode = "return";
        idle = 0;
        vx = vy = av = 0;
      }
    }

    function step(dt: number) {
      if (busy) return;
      if (mode === "drag") {
        const v = dragVel();
        ang += (clamp(v.x / 2200, -0.55, 0.55) - ang) * Math.min(1, dt * 12);
        return;
      }
      if (mode === "return") {
        const dx = homeX() - x;
        const dy = homeY() - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 10) {
          x = homeX();
          y = homeY();
          mode = "float";
        } else {
          const sp = Math.max(900, dist * 7);
          x += (dx / dist) * Math.min(dist, sp * dt);
          y += (dy / dist) * Math.min(dist, sp * dt);
          ang += (0 - ang) * Math.min(1, dt * 10);
        }
        return;
      }

      if (mode === "float") {
        const k = Math.min(1, dt * 4);
        x += (homeX() - x) * k;
        y += (homeY() + Math.sin(t * 1.7) * 12 - y) * k;
        ang += (Math.sin(t * 1.2) * 0.05 - ang) * Math.min(1, dt * 7);
        ang -= Math.round(ang / 6.2832) * 6.2832;
      } else {
        physics(dt);
      }

      if (t > sayUntil && bubble.classList.contains("on")) hush();
      if (mode !== "return" && (mode === "float" || idle > 2)) {
        nextSay -= dt;
        if (nextSay <= 0) {
          say(CFG.messages[msgI++ % CFG.messages.length]);
          nextSay = 6 + Math.random() * 4;
        }
      }
    }

    function draw() {
      bot.style.transform = `translate(${x - S / 2}px,${y - S / 2}px) rotate(${ang}rad)`;
      placeBubble();
    }

    let last = performance.now();
    let animFrameId: number;

    function frameLoop(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      t += dt;
      step(dt);
      draw();
      animFrameId = requestAnimationFrame(frameLoop);
    }
    animFrameId = requestAnimationFrame(frameLoop);

    /* ---------- drag, throw, click ---------- */
    const dragVel = () => {
      if (!drag || drag.pts.length < 2) return { x: 0, y: 0 };
      const a = drag.pts[0];
      const b = drag.pts[drag.pts.length - 1];
      const d = Math.max(0.016, (b.t - a.t) / 1000);
      return { x: clamp((b.x - a.x) / d, -3200, 3200), y: clamp((b.y - a.y) / d, -3200, 3200) };
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (busy || e.button > 0) return;
      e.preventDefault();
      try { bot.setPointerCapture(e.pointerId); } catch {}
      drag = {
        ox: x - e.clientX,
        oy: y - e.clientY,
        sx: e.clientX,
        sy: e.clientY,
        t0: performance.now(),
        moved: false,
        pts: [],
        prev: mode,
      };
      mode = "drag";
      bot.classList.add("grab");
      hush();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
      if (drag.moved) {
        x = clamp(e.clientX + drag.ox, R, W - R);
        y = clamp(e.clientY + drag.oy, R, H - R);
      }
      const n = performance.now();
      drag.pts.push({ x: e.clientX, y: e.clientY, t: n });
      while (drag.pts.length > 2 && n - drag.pts[0].t > 110) drag.pts.shift();
    };

    const handleRelease = () => {
      if (!drag) return;
      const d = drag;
      bot.classList.remove("grab");
      if (!d.moved && performance.now() - d.t0 < 600) {
        mode = d.prev;
        drag = null;
        openConsole();
        return;
      }
      const stale = performance.now() - (d.pts.length ? d.pts[d.pts.length - 1].t : 0) > 80;
      const v = stale ? { x: 0, y: 0 } : dragVel();
      drag = null;
      vx = v.x;
      vy = v.y;
      av = clamp(v.x / 400, -9, 9);
      mode = "fly";
      thrownTime = t;
      idle = 0;
      nextSay = 4;
      if (Math.hypot(vx, vy) > 900) say("wheee!", 1.4);
    };

    bot.addEventListener("pointerdown", handlePointerDown);
    bot.addEventListener("pointermove", handlePointerMove);
    bot.addEventListener("pointerup", handleRelease);
    bot.addEventListener("pointercancel", handleRelease);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openConsole();
      }
    };
    bot.addEventListener("keydown", handleKeyDown);

    /* ---------- zoom in / out & CRT terminal ---------- */
    let isOpen = false;
    let session = 0;
    let noiseTimer: number;
    let themeI = 0;

    function openConsole() {
      if (busy) return;
      busy = true;
      hush();
      const cx = SCREEN.x * K0;
      const cy = SCREEN.y * K0;
      const left = x - S / 2;
      const top = y - S / 2;
      const dx = W / 2 - (left + cx);
      const dy = H / 2 - (top + cy);
      const k = Math.min(Math.max(W, H) * 0.5 / (SCREEN.w * K0), 36);

      Object.assign(zoom.style, {
        left: left + "px",
        top: top + "px",
        width: S + "px",
        height: S + "px",
        transformOrigin: `${cx}px ${cy}px`,
        transition: "none",
        opacity: "1",
        transform: `translate(0px,0px) scale(1) rotate(${ang}rad)`
      });

      ov.classList.add("on");
      bot.style.visibility = "hidden";
      void zoom.offsetWidth;

      zoom.style.transition = "transform .9s cubic-bezier(.7,0,.25,1)";
      zoom.style.transform = `translate(${dx}px,${dy}px) scale(${k}) rotate(0rad)`;
      zoom.dataset.back = `translate(0px,0px) scale(1) rotate(0rad)`;

      setTimeout(() => {
        con.className = "rm-con on";
        isOpen = true;
        zoom.style.transition = "opacity .35s";
        zoom.style.opacity = "0";
        startNoise();
        field.value = "";
        mirror();
        field.focus({ preventScroll: true });
        blip(220, 0.09);
        bootConsole();
      }, 850);
    }

    function closeConsole(after?: string) {
      if (!isOpen) return;
      isOpen = false;
      session++;
      window.clearInterval(noiseTimer);
      con.className = "rm-con off";
      blip(150, 0.12);
      field.blur();

      setTimeout(() => {
        con.className = "rm-con";
        zoom.style.transition = "none";
        zoom.style.opacity = "1";
        void zoom.offsetWidth;
        ang = 0;
        zoom.style.transition = "transform .75s cubic-bezier(.6,0,.3,1)";
        zoom.style.transform = zoom.dataset.back || `translate(0px,0px) scale(1) rotate(0rad)`;
        dimEl.style.transition = "opacity .6s";
        ov.classList.add("on");

        setTimeout(() => {
          ov.classList.remove("on");
          bot.style.visibility = "";
          busy = false;
          x = clamp(x, R, W - R);
          y = clamp(y, R, H - R);
          vx = vy = 0;
          mode = "fly";
          thrownTime = t;
          idle = 0;
          nextSay = 5;
          if (after === "throw") {
            vx = (Math.random() < 0.5 ? -1 : 1) * 1500;
            vy = -1700;
            av = 8;
            thrownTime = t;
            say("weeeee!", 1.6);
          }
        }, 760);
      }, 330);
    }

    closeBtn.addEventListener("click", () => closeConsole());
    dimEl.addEventListener("click", () => closeConsole());

    const handleWindowKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        e.preventDefault();
        closeConsole();
      }
    };
    window.addEventListener("keydown", handleWindowKey, true);

    function startNoise() {
      const c = noise.getContext("2d");
      if (!c) return;
      const id = c.createImageData(96, 72);
      noiseTimer = window.setInterval(() => {
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() * 255;
        }
        c.putImageData(id, 0, 0);
      }, 70);
    }

    function print(txt: string, cls?: string) {
      const d = document.createElement("div");
      d.className = "rm-l " + (cls || "");
      d.textContent = txt;
      out.appendChild(d);
      scroller.scrollTop = 1e9;
      return d;
    }

    async function typeLine(txt: string, cls?: string, ms = 12) {
      const s = session;
      const d = print("", cls);
      for (const ch of txt) {
        if (s !== session) return;
        d.textContent += ch;
        if (ch !== " ") blip(520 + Math.random() * 90, 0.012);
        scroller.scrollTop = 1e9;
        await wait(ms);
      }
    }

    async function bootConsole() {
      const s = session;
      out.textContent = "";
      for (const l of CFG.boot) {
        if (s !== session) return;
        print(l);
        await wait(110);
      }
      for (const l of CFG.info) {
        if (s !== session) return;
        await typeLine(l, "hi");
        await wait(40);
      }
    }

    function mirror() {
      const v = field.value;
      const p = field.selectionStart == null ? v.length : field.selectionStart;
      pa.textContent = v.slice(0, p);
      pb.textContent = v.slice(p);
      scroller.scrollTop = 1e9;
    }

    const hist: string[] = [];
    let hi = 0;
    let sound = true;

    const themes: Record<string, [string, string]> = {
      green: ["#72ff8e", "#06130a"],
      amber: ["#ffb43a", "#150d02"],
      ice: ["#7fe8ff", "#03111a"],
      white: ["#f2fff2", "#0b0f0b"]
    };

    const jokes = [
      "WHY DID THE ROBOT GO ON VACATION? TO RECHARGE.",
      "I WOULD TELL YOU A UDP JOKE, BUT YOU MIGHT NOT GET IT.",
      "I HAVE A FEELING I'M ABOUT 32 PIXELS TALL."
    ];

    const cmds: Record<string, (args: string) => string[]> = {
      help: () => [
        "COMMANDS:",
        "  info ...... ABOUT WONGAI & ARCHITECTURES",
        "  links ..... QUICK JUMP LINKS",
        "  skills .... CORE AI STACK",
        "  projects .. FLAGSHIP SYSTEMS",
        "  joke ...... BEEP BOOP",
        "  color X ... green | amber | ice | white",
        "  date ...... TIME CHECK",
        "  echo X .... REPEATS X",
        "  sound ..... TOGGLE KEY BLIPS",
        "  throw ..... FLING ME ACROSS SCREEN",
        "  clear ..... CLEAN SCREEN",
        "  exit ...... CLOSE (OR PRESS ESC)"
      ],
      info: () => CFG.info,
      about: () => CFG.info,
      links: () => CFG.links,
      skills: () => [
        "CORE STACK & SPECIALIZATIONS:",
        "  • Computer Vision: YOLOv8, OpenCV, PyTorch, GTSRB CNN",
        "  • LLMs & Fine-Tuning: Mistral 7B, Unsloth AI, 4-bit QLoRA",
        "  • Agentic AI: Model Context Protocol (MCP), Google AP2",
        "  • Full-Stack: FastAPI, React 19, TypeScript, Next.js 16"
      ],
      projects: () => [
        "FLAGSHIP SYSTEMS:",
        "  01: VoltStock ............ Autonomous Inventory & Google AP2 Commerce",
        "  02: PCB Defect Detector .. YOLOv8 Sub-mm Diagnostics & Ollama Vision",
        "  03: UnderWrite.AI ........ Agentic Commercial Underwriting & RAG",
        "  04: Traffic Sign CNN ..... 43-Class GTSRB Real-Time Recognition"
      ],
      joke: () => [jokes[(Math.random() * jokes.length) | 0]],
      date: () => [new Date().toString().toUpperCase()],
      whoami: () => ["A CURIOUS HUMAN VISITOR TO WONGAI'S PORTFOLIO."],
      echo: a => [a || ""],
      sudo: () => ["ACCESS GRANTED: ROOT ACCESS TO PIXEL VALLEY."],
      sound: () => [(sound = !sound) ? "SOUND ON" : "SOUND OFF"],
      clear: () => { out.textContent = ""; return []; },
      cls: () => { out.textContent = ""; return []; },
      color: a => {
        const key = (a || "").toLowerCase().trim();
        const th = themes[key] || Object.values(themes)[++themeI % 4];
        root.style.setProperty("--rm-fg", th[0]);
        root.style.setProperty("--rm-bg", th[1]);
        return ["PHOSPHOR RECALIBRATED: " + (themes[key] ? key.toUpperCase() : "CYCLE")];
      },
      throw: () => {
        setTimeout(() => closeConsole("throw"), 250);
        return ["HOLD ON TO YOUR PIXELS..."];
      },
      exit: () => {
        setTimeout(() => closeConsole(), 200);
        return ["BYE."];
      }
    };
    cmds.quit = cmds.close = cmds.exit;

    function run(line: string) {
      const [c, ...r] = line.trim().split(/\s+/);
      if (!c) return;
      const f = cmds[c.toLowerCase()];
      if (!f) return print("?? UNKNOWN COMMAND: " + c + "  (TRY 'help')", "err");
      for (const l of f(r.join(" "))) print(l);
    }

    const handleFieldKey = (e: KeyboardEvent) => {
      blip(380 + Math.random() * 120, 0.025);
      if (e.key === "Enter") {
        const v = field.value;
        print("> " + v, "cmd");
        field.value = "";
        if (v.trim()) {
          hist.push(v);
          hi = hist.length;
        }
        run(v);
        mirror();
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        hi = clamp(hi + (e.key === "ArrowUp" ? -1 : 1), 0, hist.length);
        field.value = hist[hi] || "";
        setTimeout(() => {
          field.setSelectionRange(1e4, 1e4);
          mirror();
        });
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    };

    field.addEventListener("keydown", handleFieldKey);
    ["input", "keyup", "click", "focus", "select"].forEach(ev => field.addEventListener(ev, mirror));

    const handleSelection = () => {
      if (document.activeElement === field) mirror();
    };
    document.addEventListener("selectionchange", handleSelection);

    screenEl.addEventListener("pointerdown", e => {
      e.preventDefault();
      field.focus({ preventScroll: true });
    });

    let ac: AudioContext | null = null;
    function blip(f = 600, d = 0.03) {
      if (!sound) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac = ac || new AudioCtx();
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "square";
        o.frequency.value = f;
        g.gain.value = 0.015;
        o.connect(g);
        g.connect(ac.destination);
        o.start();
        o.stop(ac.currentTime + d);
      } catch (_) {}
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleWindowKey, true);
      document.removeEventListener("selectionchange", handleSelection);
      observer.disconnect();
      window.clearInterval(noiseTimer);
      window.clearTimeout(scanTimer);
      bot.remove();
      bubble.remove();
      ov.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="rm-root fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 45,
        ['--rm-fg' as string]: '#72ff8e',
        ['--rm-bg' as string]: '#06130a',
      }}
    />
  );
};
