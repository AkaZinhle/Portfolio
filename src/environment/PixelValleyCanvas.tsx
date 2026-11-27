import React, { useEffect, useRef } from 'react';

interface PixelValleyCanvasProps {
  enabled?: boolean;
}

export const PixelValleyCanvas: React.FC<PixelValleyCanvasProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current!;
    if (!cv) return;
    const ctx = cv.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const N = 80;
    const C = 20;
    const M = 52;
    const PX = C + 5;
    const PY = C - 4;

    const rr = (a: number, b: number) => a + Math.random() * (b - a);
    const pk = <T,>(a: T[]): T => a[(Math.random() * a.length) | 0];
    const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const hs = (x: number, y: number) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const sm = (t: number) => t * t * (3 - 2 * t);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    const nz = (x: number, y: number) => {
      const i = Math.floor(x), j = Math.floor(y), u = sm(x - i), v = sm(y - j);
      return lp(lp(hs(i, j), hs(i + 1, j), u), lp(hs(i, j + 1), hs(i + 1, j + 1), u), v);
    };
    const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const by = (x: number, y: number) => (BY[((y & 3) << 2) | (x & 3)] + 0.5) / 16;

    const GR = ['#2b4a3c', '#3e6b3f', '#5a8a45', '#86a84a', '#b4c25a'];
    const SA = ['#c9a46a', '#dcbb7e', '#ecd29a', '#f6e4b4'];
    const WA = ['#17285a', '#223f7e', '#3466aa', '#4f8bc6', '#8fc3e8'];
    const DI = ['#6b4a3a', '#8a6246', '#a87c52'];

    /* ---- world grid ---- */
    const el = new Float32Array(N * N);
    const LD = new Uint8Array(N * N);
    const PT = new Uint8Array(N * N);
    const inb = (x: number, y: number) => x >= 0 && y >= 0 && x < N && y < N;
    const pondAt = (x: number, y: number) => Math.hypot(x - PX, y - PY) < 3.4 + nz(x * 0.4, y * 0.4) * 1.2;
    const segD = (x: number, y: number, a: number, b: number, c: number, d: number) => {
      const vx = c - a, vy = d - b, t = cl(((x - a) * vx + (y - b) * vy) / (vx * vx + vy * vy), 0, 1);
      return Math.hypot(x - a - vx * t, y - b - vy * t);
    };
    const BRG = (i: number, j: number) => Math.abs(i - j) <= 1 && i >= 24 && i <= 47;
    const FARM = (i: number, j: number) => i >= 56 && i <= 61 && j >= 44 && j <= 49;
    const RD = (x: number, y: number) =>
      segD(x, y, 43, 43, 62, 62) < 0.9 ||
      segD(x, y, 46, 54, 56, 48) < 0.7 ||
      Math.hypot(x - 50, y - 50) < 2.6 ||
      Math.hypot(x - 64.5, y - 64.5) < 3.2;
    const KZ = (x: number, y: number) => x > 41 && x < 68 && y > 41 && y < 68;
    const TENTS = [[C - 4, C + 1], [C - 1, C + 5], [C + 4, C + 3]];

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = j * N + i, x = i + 0.5, y = j + 0.5;
        el[k] = Math.max(
          nz(i * 0.13, j * 0.13) * 0.5 + 0.78 - Math.hypot(x - C, y - C) / 20,
          nz(i * 0.11 + 9, j * 0.11) * 0.5 + 0.95 - Math.hypot(x - M, y - M) / 26
        ) - Math.max(0, 10 - Math.min(x, y, N - x, N - y)) * 0.07;
        LD[k] = (el[k] > 0.3 && !pondAt(x, y)) || BRG(i, j) ? 1 : 0;
        PT[k] = (Math.hypot(x - C, y - C) < 2.3 ||
          BRG(i, j) ||
          RD(x, y) ||
          segD(x, y, C, C, PX - 3.2, PY + 2) < 0.7 ||
          TENTS.some(t => segD(x, y, C, C, t[0] + 0.5, t[1] + 0.5) < 0.55 + nz(x, y) * 0.3)) && LD[k] ? 1 : 0;
      }
    }

    const ok = (x: number, y: number) => inb(x, y) && LD[(y | 0) * N + (x | 0)] === 1;

    function lp2(cx: number, cy: number, r: number): [number, number] {
      for (let i = 0; i < 30; i++) {
        const a = rr(0, 6.28), d = rr(0, r), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        if (ok(x, y)) return [x, y];
      }
      return [C, C + 2];
    }

    /* ---- camera + static terrain ---- */
    let W = 0;
    let H = 0;
    let S = 3;
    let OX = 0;
    let OY = 0;
    let WOX = 0;
    let MY = 0;
    let tc: HTMLCanvasElement;
    let tx: CanvasRenderingContext2D;
    let WL: [number, number][] = [];

    const P = (x: number, y: number): [number, number] => [
      OX + Math.round((x - y) * 8),
      OY + Math.round((x + y) * 4)
    ];

    const mk = (w: number, h: number, f: (g: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d')!;
      g.imageSmoothingEnabled = false;
      f(g);
      return c;
    };

    function tile(g: CanvasRenderingContext2D, sx: number, sy: number, fn: (x: number, y: number) => string) {
      for (let j = 0; j < 8; j++) {
        const w = j < 4 ? 2 * (j + 1) : 2 * (8 - j);
        for (let k = -w; k < w; k++) {
          g.fillStyle = fn(sx + k, sy + j);
          g.fillRect(sx + k, sy + j, 1, 1);
        }
      }
    }

    function build() {
      S = Math.max(2, Math.floor(Math.min(window.innerWidth, window.innerHeight) / 220));
      W = Math.ceil(window.innerWidth / S);
      H = Math.ceil(window.innerHeight / S);
      cv.width = W;
      cv.height = H;
      OX = W >> 1;
      OY = (H >> 1) - C * 8;
      WOX = N * 8;
      MY = H >> 1;

      tc = document.createElement('canvas');
      tc.width = N * 16;
      tc.height = N * 8 + 8 + 2 * MY;
      tx = tc.getContext('2d')!;
      tx.imageSmoothingEnabled = false;
      WL = [];

      const id = tx.createImageData(N * 16, N * 8 + 8 + 2 * MY);
      const b = new Uint32Array(id.data.buffer);
      const cs = [0, 1, 2].map(idx => {
        const hex = WA[idx];
        return (255 << 24 |
          parseInt(hex.slice(5, 7), 16) << 16 |
          parseInt(hex.slice(3, 5), 16) << 8 |
          parseInt(hex.slice(1, 3), 16)) >>> 0;
      });

      for (let y = 0; y < id.height; y++) {
        for (let x = 0; x < id.width; x++) {
          b[y * id.width + x] = cs[cl(Math.floor((nz(x * 0.06, y * 0.09) * 0.7 + by(x, y) * 0.4 - 0.1) * 3), 0, 2)];
        }
      }
      tx.putImageData(id, 0, 0);

      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const k = j * N + i, [sx, sy] = [WOX + (i - j) * 8, (i + j) * 4 + MY];
          const pd = pondAt(i + 0.5, j + 0.5), e = el[k];

          if (BRG(i, j) && e <= 0.3 && !pd) {
            tile(tx, sx, sy, (x, y) => DI[hs(x, y) > 0.9 ? 0 : ((y >> 1) & 1) ? 1 : 2]);
            if (i - j === 1) {
              tx.fillStyle = '#3b2a22'; tx.fillRect(sx + 5, sy + 1, 2, 5);
              tx.fillStyle = '#c9a06a'; tx.fillRect(sx + 5, sy + 1, 2, 1);
            }
            if (j - i === 1) {
              tx.fillStyle = '#3b2a22'; tx.fillRect(sx - 7, sy + 1, 2, 5);
              tx.fillStyle = '#c9a06a'; tx.fillRect(sx - 7, sy + 1, 2, 1);
            }
            continue;
          }

          if (pd || e <= 0.3) {
            if (pd || e > 0.12) {
              const dp = pd ? 1 - Math.hypot(i + 0.5 - PX, j + 0.5 - PY) / 5 : 0;
              tile(tx, sx, sy, (x, y) => WA[cl(Math.floor(1.3 + nz(x * 0.1, y * 0.1) * 1.2 + (by(x, y) - 0.5) * 0.6 - dp * 0.8 + (pd ? 0 : 0.8)), 0, 4)]);
              WL.push([sx, sy + 4]);
            } else if (e > 0.27) {
              tile(tx, sx, sy, (x, y) => SA[cl(Math.floor(hs(x, y) * 0.3 + (by(x, y) - 0.5) * 0.4 + nz(x * 0.1, y * 0.1) * 0.6), 0, 3)]);
            }
            continue;
          }

          if (e < 0.34) {
            tile(tx, sx, sy, (x, y) => SA[cl(Math.floor(hs(x, y) * 0.3 + (by(x, y) - 0.5) * 0.4 + nz(x * 0.1, y * 0.1) * 0.7), 0, 3)]);
          } else if (FARM(i, j) && !PT[k]) {
            tile(tx, sx, sy, (x, y) => (((x + y * 2) >> 2) & 1) ? '#c9b04a' : (hs(x, y) > 0.5 ? '#a8923a' : '#8a7a30'));
          } else if (PT[k]) {
            tile(tx, sx, sy, (x, y) => DI[cl(Math.floor(hs(x, y) * 0.5 + (by(x, y) - 0.5) * 0.5 + 0.4), 0, 2)]);
          } else {
            tile(tx, sx, sy, (x, y) => GR[cl(Math.floor((nz(x * 0.05, y * 0.05) * 0.55 + hs(x, y) * 0.2 + (by(x, y) - 0.5) * 0.35 + 0.12) * 5), 0, 4)]);
            const h = hs(i, j);
            if (h > 0.72) {
              tx.fillStyle = pk(['#f4d35e', '#ee6c4d', '#f7f0ff', '#c77dff']);
              tx.fillRect(sx + ((h * 9) | 0) - 4, sy + 2 + (((h * 40) % 3) | 0), 1, 1);
              tx.fillRect(sx - 3 + (((h * 77) % 6) | 0), sy + 3, 1, 1);
            } else if (h < 0.2) {
              tx.fillStyle = '#2b4a3c';
              tx.fillRect(sx - 2, sy + 3, 1, 2);
              tx.fillRect(sx, sy + 2, 1, 2);
            }
          }
        }
      }
    }

    /* ---- sprites ---- */
    const PAL = [
      ['#274a3a', '#3a6b3e', '#5d9a46', '#9bc255'],
      ['#6b3a2a', '#a8452a', '#d9782e', '#f0b44a'],
      ['#1f4a4a', '#2f6b5a', '#4a9a6a', '#8cd0a0']
    ];

    const oak = (r: number, p: string[]) => mk(r * 2 + 2, r * 2 + 7, g => {
      g.fillStyle = '#4a3224'; g.fillRect(r, r * 2 - 2, 2, 7);
      g.fillStyle = '#6b4a36'; g.fillRect(r, r * 2 - 2, 1, 7);
      for (let dy = -r; dy <= r; dy++) {
        const hw = Math.floor(Math.sqrt(r * r - dy * dy));
        for (let dx = -hw; dx <= hw; dx++) {
          const l = (-dx - dy) / (2 * r) + (hs(dx + r, dy + r) - 0.5) * 0.5 + 0.1;
          g.fillStyle = p[l > 0.42 ? 3 : l > 0.1 ? 2 : l > -0.25 ? 1 : 0];
          g.fillRect(r + dx, r + dy, 1, 1);
        }
      }
    });

    const pine = (r: number) => mk(r * 2 + 2, r * 3 + 7, g => {
      g.fillStyle = '#4a3224'; g.fillRect(r, r * 3, 2, 6);
      const pineH = r * 3;
      for (let y = 0; y < pineH; y++) {
        const hw = Math.floor(r * y / pineH) + (y % 5 === 4 ? 1 : 0);
        for (let dx = -hw; dx <= hw; dx++) {
          g.fillStyle = PAL[0][dx < -hw / 3 ? 3 : dx < hw / 2 ? 2 : 1];
          if ((dx + y) % 4 === 0) g.fillStyle = PAL[0][1];
          g.fillRect(r + dx, y, 1, 1);
        }
      }
    });

    const OAKS = [5, 6, 7, 8].flatMap(r => PAL.map(p => oak(r, p)));
    const PINES = [4, 5, 6].map(pine);
    const tent = mk(21, 12, g => {
      for (let r = 0; r < 12; r++) {
        const hw = Math.floor(r * 0.85);
        for (let dx = -hw; dx <= hw; dx++) {
          g.fillStyle = dx < 0 ? '#e8604a' : '#b8412e';
          if (r > 6 && Math.abs(dx) <= ((r - 6) >> 1) + 0) g.fillStyle = '#2a1a22';
          if (r === 0) g.fillStyle = '#f4e4b8';
          g.fillRect(10 + dx, r, 1, 1);
        }
      }
    });

    /* ---- entities ---- */
    interface Entity {
      k: string;
      x: number;
      y: number;
      z: number;
      t: number;
      s: string;
      d: number;
      wk: number;
      ph: number;
      fx: number;
      fy: number;
      hx: number;
      hy: number;
      hr: number;
      g?: number;
      sp?: HTMLCanvasElement;
      c?: string;
      h?: string;
      sk?: string;
      a?: number;
      say?: number;
      tx?: number;
      ty?: number;
      pal?: number;
      ox?: number;
      oy?: number;
      oz?: number;
      stag?: boolean;
      vx?: number;
      vy?: number;
      f?: number;
      dk?: number;
      trav?: boolean;
      wp?: [number, number][];
      ar?: number;
      dir?: number;
      i?: number;
      w?: number;
    }

    const E: Entity[] = [];
    const V: Entity[] = [];
    const FS: { x: number; y: number; ph: number; j: number; z: number; c: string; d?: number }[] = [];
    const PR: { x: number; y: number; z: number; vx: number; vy: number; vz: number; l: number; m: number; c: string }[] = [];
    const RP: { x: number; y: number; t: number }[] = [];
    const herd = { x: C - 2, y: C + 3, t: 0 };

    const ent = (k: string, x: number, y: number, o: Partial<Entity> = {}): Entity => {
      const e: Entity = {
        k,
        x,
        y,
        z: 0,
        t: rr(0, 9),
        s: 'idle',
        d: 1,
        wk: 0,
        ph: rr(0, 6.28),
        fx: C,
        fy: C,
        hx: C,
        hy: C,
        hr: 13,
        ...o,
      };
      E.push(e);
      return e;
    };

    const planted: Entity[] = [];
    function addTree(x: number, y: number, g?: number) {
      const pn = Math.random() < 0.3;
      const e = ent('t', x, y, { g: g ?? 1, sp: pn ? pk(PINES) : pk(OAKS) });
      if (g != null) planted.push(e);
      return e;
    }

    for (let n = 0; n < 1200 && E.length < 110; n++) {
      const x = rr(1, N - 1), y = rr(1, N - 1);
      if (
        !ok(x, y) ||
        el[(y | 0) * N + (x | 0)] < 0.36 ||
        PT[(y | 0) * N + (x | 0)] ||
        Math.hypot(x - C, y - C) < 4.5 ||
        KZ(x, y) ||
        Math.hypot(x - 50, y - 50) < 13 ||
        Math.hypot(x - PX, y - PY) < 5.2 ||
        E.some(o => Math.hypot(o.x - x, o.y - y) < 1.5)
      ) continue;
      addTree(x, y);
    }

    TENTS.forEach(t => ent('n', t[0] + 0.5, t[1] + 0.5));
    ent('F', C, C);

    const SH = ['#c8553d', '#3d8bc8', '#e0b43a', '#6aa84f', '#9b59b6', '#e8e8e8'];
    const HR = ['#2a1a12', '#6b3b1c', '#d8b45a', '#9a9a9a'];
    const SK = ['#f1c9a0', '#c98f64', '#8d5a3b'];

    for (let i = 0; i < 6; i++) {
      const [x, y] = lp2(C, C, 6);
      V.push(ent('v', x, y, { c: SH[i], h: pk(HR), sk: pk(SK), a: i * 1.05, say: 0 }));
    }
    ent('g', V[0].x + 1, V[0].y, {});

    /* ---- the kingdom ---- */
    const SN = ['#5a5878', '#7a7898', '#9a98b8', '#c0bed8'];
    const stone = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, b: number) => {
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          g.fillStyle = SN[cl(b + (hs(x + i, y + j) > 0.88 ? 1 : 0) - (((j % 5 === 0) || (((i + ((j / 5) | 0) * 3) % 7) === 0)) ? 1 : 0), 0, 3)];
          g.fillRect(x + i, y + j, 1, 1);
        }
      }
    };

    const tower = (w: number, h: number, rf: string[]) => mk(w + 4, h + 16, g => {
      const cx = ((w + 4) / 2) | 0;
      stone(g, 2, 16, w >> 1, h, 2);
      stone(g, 2 + (w >> 1), 16, w - (w >> 1), h, 1);
      for (let r = 0; r < 16; r++) {
        const hw = Math.round((w / 2 + 1.5) * (r + 1) / 16);
        for (let dx = -hw; dx < hw; dx++) {
          g.fillStyle = dx < 0 ? rf[1] : rf[0];
          g.fillRect(cx + dx, r, 1, 1);
        }
      }
      g.fillStyle = '#10102a';
      g.fillRect(cx - 1, 24, 2, 4);
      g.fillRect(cx - 1, 38, 2, 4);
    });

    const house = (c1: string, c2: string, rf: string[]) => mk(24, 26, g => {
      const a = 11;
      for (let py = 0; py < 26; py++) {
        for (let px = -a; px <= a; px++) {
          const top = px < 0 ? 6 + (px + a) * 6 / a : 12 - px * 6 / a;
          let c: string | null = null;
          if (Math.abs(px) / a + Math.abs(py - 6) / 6 <= 1) c = px < 0 ? rf[1] : rf[0];
          else if (py >= top && py <= top + 10) {
            c = px < 0 ? c1 : c2;
            if (px >= 3 && px <= 5 && py >= top + 4) c = '#3b2a22';
            if (px >= -7 && px <= -5 && py >= top + 3 && py <= top + 5) c = '#ffe9a8';
          }
          if (c) {
            g.fillStyle = c;
            g.fillRect(px + a, py, 1, 1);
          }
        }
      }
    });

    const HS = [
      house('#9a98b8', '#7a7898', ['#8a2d2d', '#c0463a']),
      house('#e8dcc0', '#c9b894', ['#2f4a9a', '#4a6ac8']),
      house('#a87c52', '#8a6246', ['#2f6b5a', '#4a9a6a'])
    ];

    const stall = (a: string, b: string) => mk(20, 18, g => {
      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 20; x++) {
          g.fillStyle = (((x / 3) | 0) & 1) ? a : b;
          g.fillRect(x, y, 1, 1);
        }
      }
      g.fillStyle = '#4a3224';
      g.fillRect(2, 6, 1, 11);
      g.fillRect(17, 6, 1, 11);
      g.fillStyle = '#a87c52';
      g.fillRect(3, 12, 14, 5);
      g.fillStyle = '#6b4a36';
      g.fillRect(3, 16, 14, 1);
      for (let i = 0; i < 8; i++) {
        g.fillStyle = pk(['#e8484f', '#f4d35e', '#6aa84f', '#e8e8e8']);
        g.fillRect(4 + (((i * 1.6) | 0)), 10 + (i & 1), 2, 2);
      }
    });

    const vil = (x: number, y: number, o: Partial<Entity> = {}) =>
      V.push(ent('v', x, y, { c: pk(SH), h: pk(HR), sk: pk(SK), a: rr(0, 6.28), say: 0, fx: 50, fy: 50, ...o }));

    [[50, 45, 0], [55, 46.5, 1], [46, 52.5, 1], [58, 50, 2], [59.5, 53, 0], [47, 57, 2], [50, 60, 1]].forEach(([x, y, v]) => {
      if (ok(x, y)) ent('h', x, y, { sp: HS[v] });
    });

    ent('K', 64.5, 64.5, {});
    ent('F', 50, 50);

    const CW = [[40, 34], [58, 34], [49, 30], [24, 66], [74, 66], [37, 74], [61, 74]];
    const keep = mk(100, 96, g => {
      const bt = tower(12, 36, ['#2f4a9a', '#4a6ac8']);
      g.drawImage(bt, 20, 8);
      g.drawImage(bt, 64, 8);
      stone(g, 32, 22, 18, 46, 2);
      stone(g, 50, 22, 18, 46, 1);
      for (let r = 0; r < 14; r++) {
        const hw = Math.round(11 * (r + 1) / 14);
        for (let dx = -hw; dx < hw; dx++) {
          g.fillStyle = dx < 0 ? '#f0c850' : '#c8a02e';
          g.fillRect(50 + dx, 8 + r, 1, 1);
        }
      }
      stone(g, 16, 56, 34, 40, 2);
      stone(g, 50, 56, 34, 40, 1);
      for (let i = 0; i < 68; i += 4) {
        g.fillStyle = SN[2];
        g.fillRect(16 + i, 52, 3, 4);
      }
      g.fillStyle = '#171230';
      for (let y = 64; y < 96; y++) {
        const hw = y < 73 ? Math.floor(Math.sqrt(81 - (73 - y) ** 2)) : 9;
        g.fillRect(50 - hw, y, hw * 2, 1);
      }
      g.fillStyle = '#a8323a'; g.fillRect(46, 89, 8, 7);
      g.fillStyle = '#e8c860'; g.fillRect(45, 89, 1, 7); g.fillRect(54, 89, 1, 7);
      g.fillStyle = '#6b4a2e'; g.fillRect(41, 75, 2, 21); g.fillRect(57, 75, 2, 21);
      g.fillStyle = '#3a2a22';
      for (let y = 78; y < 96; y += 6) {
        g.fillRect(41, y, 2, 1);
        g.fillRect(57, y, 2, 1);
      }
      g.fillStyle = '#4a4a5a';
      for (let x = 42; x < 58; x += 2) g.fillRect(x, 64, 1, 6);
      g.fillRect(42, 64, 16, 1);
      g.fillStyle = '#3b2a22';
      g.fillRect(36, 76, 3, 4); g.fillRect(61, 76, 3, 4);
      g.fillStyle = '#171230';
      CW.slice(0, 5).forEach(([x, y]) => g.fillRect(x, y, 2, 6));
      [[26, 56], [70, 56]].forEach(([x, y]) => {
        g.fillStyle = '#c8323a'; g.fillRect(x, y, 4, 13);
        g.fillRect(x + 1, y + 13, 2, 1);
        g.fillStyle = '#e8c860'; g.fillRect(x, y, 4, 1);
      });
      const ft = tower(16, 52, ['#2f4a9a', '#4a6ac8']);
      g.drawImage(ft, 0, 28);
      g.drawImage(ft, 80, 28);
    });

    const arch = mk(40, 34, g => {
      stone(g, 0, 6, 20, 28, 2);
      stone(g, 20, 6, 20, 28, 1);
      for (let i = 0; i < 40; i += 4) {
        g.fillStyle = SN[2];
        g.fillRect(i, 2, 3, 4);
      }
      for (let y = 12; y < 34; y++) {
        const hw = y < 21 ? Math.floor(Math.sqrt(81 - (21 - y) ** 2)) : 9;
        g.clearRect(20 - hw, y, hw * 2, 1);
      }
      g.fillStyle = '#4a3224';
      for (let y = 18; y < 34; y++) {
        g.fillRect(11, y, 2, 1);
        g.fillRect(27, y, 2, 1);
      }
      g.fillStyle = '#2a1a12';
      for (let y = 20; y < 34; y += 5) {
        g.fillRect(11, y, 2, 1);
        g.fillRect(27, y, 2, 1);
      }
      g.fillStyle = '#3a3a48';
      for (let x = 12; x < 28; x += 2) g.fillRect(x, 13, 1, 6);
      g.fillRect(12, 13, 16, 1);
      g.fillStyle = '#3b2a22';
      g.fillRect(8, 22, 3, 3);
      g.fillRect(29, 22, 3, 3);
    });

    const gt = tower(10, 30, ['#b8412e', '#e8604a']);
    [[46.5, 43.5], [43.5, 46.5]].forEach(([x, y]) => {
      if (ok(x, y)) {
        ent('T', x, y, { sp: gt });
        LD[(y | 0) * N + (x | 0)] = 0;
      }
    });
    ent('A', 44.8, 44.8, {});

    [[47, 48.5, '#e8484f'], [53, 47, '#3d8bc8'], [50.5, 53.5, '#e0b43a']].forEach(([x, y, a]) => {
      ent('S', x as number, y as number, { sp: stall(a as string, '#f1e6c4') });
      vil((x as number) + 1.4, (y as number) + 0.6, { hx: x as number, hy: y as number, hr: 1.5 });
    });

    for (let i = 0; i < 8; i++) {
      const [x, y] = lp2(50, 50, 7);
      vil(x, y, { hx: 50, hy: 50, hr: 7, trav: i < 2 });
    }
    for (let i = 0; i < 3; i++) vil(44.5 + i * 0.4, 44.5, { c: '#8e92a8', h: '#8e92a8', ar: 1, hx: 44.5, hy: 44.5, hr: 3 });
    for (let i = 0; i < 3; i++) vil(58 + i * 0.5, 47, { c: '#6aa84f', hx: 58, hy: 47, hr: 3 });

    V.filter(v => v.hx === C).slice(1, 3).forEach(v => { v.trav = true; });

    for (let i = 27; i <= 41; i += 3) {
      const s = ((i / 3) | 0) & 1;
      ent('L', s ? i + 1.4 : i, s ? i : i + 1.4, {});
    }
    for (let i = 0; i < 5; i++) {
      const [x, y] = lp2(52, 52, 12);
      ent('y', x, y, { c: pk(['#ff9ec4', '#ffd45e', '#9ed8ff', '#fff']), a: rr(0, 6.28) });
    }
    for (let i = 0; i < 4; i++) {
      const [x, y] = lp2(52, 52, 12);
      ent('r', x, y, { vx: 0, vy: 0 });
    }

    const RT: [number, number][] = [[C + 2.5, C + 2.5], [30.5, 30.5], [42.5, 42.5], [47.5, 47.5], [50, 52]];
    ent('c', RT[0][0], RT[0][1], { i: 0, dir: 1, w: 0 });

    /* ---- curtain wall ---- */
    const wall = (dir: number, b: number) => mk(10, 24, g => {
      for (let dx = -5; dx < 5; dx++) {
        const y0 = 4 + Math.floor(dir * dx * 0.5);
        g.fillStyle = '#cfcde8';
        g.fillRect(dx + 5, y0, 1, 3);
        if (((dx + 8) >> 1) & 1) {
          g.fillStyle = SN[b];
          g.fillRect(dx + 5, y0 - 2, 1, 2);
        }
        for (let k = 0; k < 12; k++) {
          const py = y0 + 3 + k;
          g.fillStyle = SN[cl(b + (hs(dx + 9, py) > 0.88 ? 1 : 0) - (((k % 4 === 0) || (((dx + 9 + ((k >> 2) * 3)) % 6) === 0)) ? 1 : 0), 0, 3)];
          g.fillRect(dx + 5, py, 1, 1);
        }
      }
    });

    const WX = wall(1, 2);
    const WY = wall(-1, 1);
    const wt = tower(8, 22, ['#2f4a9a', '#4a6ac8']);
    const ct = tower(12, 34, ['#b8412e', '#e8604a']);
    const TW = [[64, 43], [43, 64], [54, 43], [64, 54], [54, 64], [43, 54]];
    const far = (x: number, y: number) => Math.hypot(x - 64.5, y - 64.5) > 1.5;

    const seg = (i: number, j: number, sp: HTMLCanvasElement) => {
      const x = i + 0.5, y = j + 0.5;
      if (ok(x, y) && far(x, y) && !TW.some(t => t[0] === i && t[1] === j)) {
        ent('W', x, y, { sp });
        LD[j * N + i] = 0;
      }
    };

    for (let i = 47; i <= 63; i++) seg(i, 43, WX);
    for (let j = 44; j <= 63; j++) seg(64, j, WY);
    for (let i = 44; i <= 63; i++) seg(i, 64, WX);
    for (let j = 47; j <= 63; j++) seg(43, j, WY);

    TW.forEach(([i, j], n) => {
      const x = i + 0.5, y = j + 0.5;
      if (ok(x, y) && far(x, y)) {
        ent('T', x, y, { sp: n < 2 ? ct : wt });
        LD[j * N + i] = 0;
      }
    });

    for (let i = 0; i < 5; i++) {
      const [x, y] = lp2(C - 5, C + 6, 4);
      ent('d', x, y, { ox: rr(-1.6, 1.6), oy: rr(-1.6, 1.6), stag: i === 0 });
    }
    for (let i = 0; i < 7; i++) {
      const [x, y] = lp2(C, C, 12);
      ent('r', x, y, { vx: 0, vy: 0 });
    }
    for (let i = 0; i < 9; i++) {
      ent('b', C, C, { f: i % 2, ox: rr(-2.5, 2.5), oy: rr(-2.5, 2.5), oz: rr(0, 9) });
    }
    for (let i = 0; i < 9; i++) {
      const [x, y] = lp2(C, C, 12);
      ent('y', x, y, { c: pk(['#ff9ec4', '#ffd45e', '#9ed8ff', '#fff']), a: rr(0, 6.28) });
    }
    for (let i = 0; i < 20; i++) {
      const [x, y] = lp2(C, C, 13);
      ent('ff', x, y, { a: rr(0, 6.28) });
    }
    for (let i = 0; i < 8; i++) {
      FS.push({ x: PX, y: PY, ph: rr(0, 6.28), j: rr(6, 20), z: 0, c: pk(['#ff9f43', '#ffd166', '#f6f0e0']) });
    }

    /* ---- helpers ---- */
    const ptr = { on: false, x: 0, y: 0, sx: 0, sy: 0 };

    function mv(e: Entity, x: number, y: number, sp: number, dt: number) {
      const dx = x - e.x, dy = y - e.y, d = Math.hypot(dx, dy);
      if (d < 0.15) return 1;
      const nx = e.x + dx / d * sp * dt, ny = e.y + dy / d * sp * dt;
      if (!ok(nx, ny)) return 2;
      e.x = nx; e.y = ny;
      e.d = dx - dy >= 0 ? 1 : -1;
      e.wk += dt * sp * 2.2;
      return 0;
    }

    function fl(e: Entity, rad: number, sp: number, dt: number) {
      if (!ptr.on) return 0;
      const dx = e.x - ptr.x, dy = e.y - ptr.y;
      if (dx * dx + dy * dy > rad * rad) return 0;
      const n = Math.hypot(dx, dy) || 1;
      mv(e, e.x + dx / n * 3, e.y + dy / n * 3, sp, dt);
      return 1;
    }

    const pp = (x: number, y: number, z: number, vx: number, vy: number, vz: number, l: number, c: string) => {
      PR.push({ x, y, z, vx, vy, vz, l, m: l, c });
    };

    let tm = 0;
    let T = 0.3;
    let night = 0;
    let wind = 0;

    function upd(e: Entity, dt: number) {
      switch (e.k) {
        case 'v': {
          if (night > 0.55 && e.s !== 'sit' && e.s !== 'to') {
            e.s = 'to'; e.tx = e.fx + Math.cos(e.a || 0) * 1.7; e.ty = e.fy + Math.sin(e.a || 0) * 1.7;
          }
          if (night < 0.4 && (e.s === 'sit' || e.s === 'to')) {
            e.s = 'idle'; e.t = 0;
          }
          if (e.s === 'to') {
            const r = mv(e, e.tx!, e.ty!, 1.6, dt);
            if (r === 1) e.s = 'sit';
            else if (r === 2) { e.s = 'idle'; e.t = 1; }
          } else if (e.s === 'walk') {
            const r = mv(e, e.tx!, e.ty!, 1.3, dt);
            if (r === 1 && e.wp && e.wp.length) {
              const next = e.wp.shift()!;
              e.tx = next[0];
              e.ty = next[1];
            } else if (r) {
              e.s = 'idle'; e.t = rr(1.5, 5);
              if (r === 1 && e.pal) e.say = 2.4;
            }
          } else if (e.s === 'idle') {
            e.t -= dt;
            if (e.t <= 0) {
              if (e.trav && Math.random() < 0.3) {
                const k = (e.hx || C) > C + 9;
                e.wp = k
                  ? [[42.5, 42.5], [30.5, 30.5], [C + rr(-3, 3), C + rr(-3, 3)]]
                  : [[30.5, 30.5], [42.5, 42.5], [47, 47], [50 + rr(-3, 3), 50 + rr(-3, 3)]];
                e.hx = e.fx = k ? C : 50;
                e.hy = e.fy = k ? C : 50;
                e.hr = k ? 13 : 7;
                const next = e.wp.shift()!;
                e.tx = next[0];
                e.ty = next[1];
                e.s = 'walk';
                e.pal = 0;
              } else {
                e.s = 'walk';
                const o = Math.random() < 0.35 ? pk(V.filter(q => q.hx === e.hx)) : null;
                if (o && o !== e) {
                  e.tx = o.x + 0.8; e.ty = o.y; e.pal = 1;
                } else {
                  [e.tx, e.ty] = lp2(e.hx || C, e.hy || C, e.hr || 13);
                  e.pal = 0;
                }
              }
            }
          }
          if (e.say && e.say > 0) e.say -= dt;
          break;
        }
        case 'g': {
          const L = V[0], d = Math.hypot(L.x - e.x, L.y - e.y);
          if (d > 2.6) mv(e, L.x, L.y, 3, dt);
          else {
            e.t -= dt;
            if (e.t < 0) {
              e.t = rr(1, 3);
              e.tx = e.x + rr(-1.5, 1.5);
              e.ty = e.y + rr(-1.5, 1.5);
            }
            if (e.tx != null && e.ty != null) mv(e, e.tx, e.ty, 1, dt);
          }
          break;
        }
        case 'd': {
          if (fl(e, 4.5, 5, dt)) { e.s = 'walk'; break; }
          if (e.s === 'graze') {
            e.t -= dt;
            if (e.t <= 0) e.s = 'walk';
          } else {
            const r = mv(e, herd.x + (e.ox || 0), herd.y + (e.oy || 0), 0.9, dt);
            if (r) { e.s = 'graze'; e.t = rr(3, 8); }
          }
          break;
        }
        case 'r': {
          if (e.s === 'hop') {
            e.t += dt * 3;
            e.z = Math.sin(Math.min(e.t, 1) * 3.14) * 4;
            const nx = e.x + (e.vx || 0) * dt * 3, ny = e.y + (e.vy || 0) * dt * 3;
            if (ok(nx, ny)) { e.x = nx; e.y = ny; }
            if (e.t >= 1) { e.s = 'idle'; e.z = 0; e.t = rr(0.4, 3); }
          } else {
            e.t -= dt;
            const scared = ptr.on && Math.hypot(e.x - ptr.x, e.y - ptr.y) < 3.5;
            if (e.t <= 0 || scared) {
              let a = rr(0, 6.28);
              if (scared) a = Math.atan2(e.y - ptr.y, e.x - ptr.x) + rr(-0.5, 0.5);
              e.vx = Math.cos(a) * 1.2;
              e.vy = Math.sin(a) * 1.2;
              if (ok(e.x + e.vx, e.y + e.vy)) {
                e.s = 'hop'; e.t = 0; e.d = e.vx - e.vy >= 0 ? 1 : -1;
              } else e.t = 0.3;
            }
          }
          break;
        }
        case 'b': {
          if (night > 0.7) break;
          const q = e.f ? 1.7 : 0;
          const lx = (e.f ? 38 : C) + 13 * Math.sin(tm * 0.07 + q * 2);
          const ly = (e.f ? 38 : C) + 10 * Math.sin(tm * 0.053 * 1.3 + q * 3);
          e.x += (lx + (e.ox || 0) - e.x) * dt * 1.2;
          e.y += (ly + (e.oy || 0) - e.y) * dt * 1.2;
          e.d = Math.cos(tm * 0.07 + q * 2) >= 0 ? 1 : -1;
          e.z = 28 + (e.oz || 0) + Math.sin(tm * 1.2 + e.ph) * 3;
          break;
        }
        case 'y':
        case 'ff': {
          e.a = (e.a || 0) + rr(-1, 1) * dt * 4;
          const sp = e.k === 'y' ? 1.1 : 0.5;
          const nx = e.x + Math.cos(e.a) * sp * dt, ny = e.y + Math.sin(e.a) * sp * dt;
          if (ok(nx, ny)) { e.x = nx; e.y = ny; } else e.a += 2;
          e.z = 5 + Math.sin(tm * 2 + e.ph) * 3;
          break;
        }
        case 't':
          if (e.g != null && e.g < 1) {
            e.g = Math.min(1, e.g + dt / 35);
          }
          break;
        case 'h':
          if (Math.random() < dt * 1.2) {
            pp(e.x + 0.25, e.y - 0.25, 23, rr(-0.1, 0.2), 0, 5, 2.5, '#c9c5da');
          }
          break;
        case 'c': {
          if ((e.w || 0) > 0) {
            e.w! -= dt;
            break;
          }
          const q = RT[e.i || 0];
          const r = mv(e, q[0], q[1], 1.5, dt);
          if (r) {
            let n = (e.i || 0) + (e.dir || 1);
            if (n < 0 || n >= RT.length) {
              e.dir = (e.dir || 1) * -1;
              e.w = rr(5, 9);
              n = (e.i || 0) + e.dir;
            }
            e.i = n;
          }
          break;
        }
        case 'F':
          if (Math.random() < dt * 14) {
            pp(e.x + rr(-0.1, 0.1), e.y + rr(-0.1, 0.1), 6, rr(-0.2, 0.2), rr(-0.2, 0.2), rr(8, 16), rr(0.8, 1.8), pk(['#ffb43c', '#ff6a1a', '#9a9aa8']));
          }
          break;
      }
    }

    /* ---- drawing ---- */
    const disc = (cx: number, cy: number, rx: number, ry: number) => {
      for (let dy = -ry; dy <= ry; dy++) {
        const hw = Math.floor(rx * Math.sqrt(1 - (dy / ry) ** 2));
        ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
      }
    };

    const sh = (x: number, y: number, r: number, a?: number) => {
      ctx.globalAlpha = a ?? 0.3;
      ctx.fillStyle = '#0c0a2a';
      disc(x + 1, y, r, Math.max(1, r >> 1));
      ctx.globalAlpha = 1;
    };

    const fr = (e: Entity, sx: number, sy: number, dx: number, dy: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(e.d > 0 ? sx + dx : sx - dx - w + 1, sy + dy, w, h);
    };

    const pat = (sx: number, sy: number, rows: string[], c: string) => {
      ctx.fillStyle = c;
      rows.forEach((r, j) => [...r].forEach((ch, i) => {
        if (ch === 'x') ctx.fillRect(sx + i, sy + j, 1, 1);
      }));
    };

    const flag = (x: number, y: number, c: string) => {
      ctx.fillStyle = '#2a2438';
      ctx.fillRect(x, y - 6, 1, 7);
      ctx.fillStyle = c;
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 1 + i, y - 6 + Math.round(Math.sin(tm * 5 + i * 0.8 + x)), 1, 3);
      }
    };

    function drw(e: Entity, sx: number, sy: number) {
      switch (e.k) {
        case 't': {
          const s = e.sp!, g = Math.min(1, e.g ?? 1);
          const w = Math.round(s.width * (0.25 + 0.75 * g));
          const h = Math.round(s.height * (0.25 + 0.75 * g));
          const x0 = sx - (w >> 1), y0 = sy - h + 1;
          sh(sx + 2, sy, (w >> 2) + 2, 0.28);
          if (g < 1) {
            ctx.drawImage(s, x0, y0, w, h);
          } else {
            for (let yy = 0; yy < h; yy += 3) {
              const off = Math.round(Math.sin(tm * 1.3 + e.ph + yy * 0.04) * (wind * 1.4 + 0.3) * (1 - yy / h));
              ctx.drawImage(s, 0, yy, w, Math.min(3, h - yy), x0 + off, y0 + yy, w, Math.min(3, h - yy));
            }
          }
          break;
        }
        case 'n':
          sh(sx + 3, sy, 9, 0.3);
          ctx.drawImage(tent, sx - 10, sy - 11);
          break;
        case 'h':
          sh(sx + 4, sy, 12, 0.28);
          ctx.drawImage(e.sp!, sx - 11, sy - 22);
          ctx.fillStyle = '#6a6888';
          ctx.fillRect(sx + 4, sy - 23, 2, 4);
          break;
        case 'K':
          sh(sx + 6, sy, 36, 0.3);
          ctx.drawImage(keep, sx - 50, sy - 95);
          [[50, 8], [10, 29], [90, 29], [28, 9], [72, 9]].forEach(([a, b], i) => flag(sx - 50 + a, sy - 95 + b, i ? '#e8484f' : '#f0c850'));
          break;
        case 'T':
          sh(sx + 3, sy, 6, 0.3);
          ctx.drawImage(e.sp!, sx - (e.sp!.width >> 1), sy - e.sp!.height + 1);
          flag(sx - 1, sy - e.sp!.height + 3, '#e8484f');
          break;
        case 'S':
          sh(sx + 2, sy, 9, 0.25);
          ctx.drawImage(e.sp!, sx - 10, sy - 17);
          break;
        case 'W':
          ctx.drawImage(e.sp!, sx - 5, sy - 18);
          break;
        case 'A':
          ctx.drawImage(arch, sx - 20, sy - 33);
          break;
        case 'L':
          ctx.fillStyle = '#2a2438'; ctx.fillRect(sx, sy - 8, 1, 8);
          ctx.fillStyle = '#ffd27a'; ctx.fillRect(sx - 1, sy - 10, 3, 3);
          ctx.fillStyle = '#3b2a22'; ctx.fillRect(sx - 1, sy - 11, 3, 1);
          break;
        case 'c': {
          sh(sx, sy, 9);
          const f = (Math.floor(e.wk * 2) & 1);
          fr(e, sx, sy, -11, -7, 9, 5, '#8a5a30');
          fr(e, sx, sy, -11, -7, 9, 1, '#6b4228');
          fr(e, sx, sy, -11, -11, 9, 4, '#f1e6c4');
          fr(e, sx, sy, -10, -2, 2, 2, '#2a2438');
          fr(e, sx, sy, -5, -2, 2, 2, '#2a2438');
          fr(e, sx, sy, -10 + f, -2, 1, 1, '#ccc');
          fr(e, sx, sy, -2, -5, 2, 1, '#6b4228');
          fr(e, sx, sy, 0, -3, 1, 3, '#5a3818');
          fr(e, sx, sy, 4, -3, 1, 3, '#5a3818');
          fr(e, sx, sy, 0, -7, 6, 4, '#7a4a24');
          fr(e, sx, sy, 5, -10, 2, 4, '#7a4a24');
          fr(e, sx, sy, 6, -11, 3, 2, '#8a5a30');
          break;
        }
        case 'F': {
          sh(sx, sy, 6, 0.3);
          ctx.fillStyle = '#4a3224'; ctx.fillRect(sx - 4, sy - 2, 8, 2);
          ctx.fillStyle = '#6b4a36'; ctx.fillRect(sx - 3, sy - 3, 6, 1);
          const f = 1 + night * 0.8;
          for (let i = -1; i <= 1; i++) {
            const h = Math.round((3 + Math.random() * 4) * f * (i ? 0.7 : 1));
            ctx.fillStyle = '#ff6a1a'; ctx.fillRect(sx + i * 2 - 1, sy - 3 - h, 3, h);
            ctx.fillStyle = '#ffb43c'; ctx.fillRect(sx + i * 2, sy - 3 - ((h * 0.7) | 0), 1, (h * 0.7) | 0);
            ctx.fillStyle = '#fff1a8'; ctx.fillRect(sx + i * 2, sy - 3 - ((h * 0.35) | 0), 1, (h * 0.35) | 0);
          }
          break;
        }
        case 'v': {
          const sit = e.s === 'sit';
          if (sit) sy += 1;
          const walk = e.s === 'walk' || e.s === 'to', ph = walk && (Math.floor(e.wk * 2) & 1), bob = walk && ph ? 1 : 0;
          sh(sx, sy, 3);
          ctx.fillStyle = '#3b3355';
          if (!sit) {
            ctx.fillRect(sx - 1, sy - 2 + (ph ? 1 : 0), 1, 2 - (ph ? 1 : 0));
            ctx.fillRect(sx, sy - 2 + (ph ? 0 : 1), 1, 2 - (ph ? 0 : 1));
          }
          ctx.fillStyle = e.c || '#fff'; ctx.fillRect(sx - 1, sy - 5 - bob, 3, sit ? 2 : 3);
          ctx.fillStyle = e.sk || '#f1c9a0'; ctx.fillRect(sx - 1, sy - 8 - bob, 3, 3);
          ctx.fillStyle = e.h || '#2a1a12'; ctx.fillRect(sx - 1, sy - 8 - bob, 3, 1);
          ctx.fillStyle = '#222'; ctx.fillRect(sx + (e.d > 0 ? 1 : -1), sy - 6 - bob, 1, 1);
          if (e.ar) {
            ctx.fillStyle = '#b8bccc'; ctx.fillRect(sx - 1, sy - 9 - bob, 3, 2);
            ctx.fillStyle = '#d9484f'; ctx.fillRect(sx, sy - 11 - bob, 1, 2);
            ctx.fillStyle = '#d8d8e8'; ctx.fillRect(sx + (e.d > 0 ? 2 : -2), sy - 12, 1, 8);
          }
          if (e.say && e.say > 0) {
            ctx.fillStyle = '#fff'; ctx.fillRect(sx - 3, sy - 17, 7, 5); ctx.fillRect(sx, sy - 12, 1, 1);
            pat(sx - 2, sy - 16, ['.x.x.', 'xxxxx', '.xxx.', '..x..'], '#e8484f');
          }
          break;
        }
        case 'g': {
          sh(sx, sy, 4);
          const wag = (Math.floor(tm * 8) & 1);
          fr(e, sx, sy, -2, -3, 4, 2, '#8a5a36');
          fr(e, sx, sy, -2, -1, 1, 1, '#6b4228');
          fr(e, sx, sy, 1, -1, 1, 1, '#6b4228');
          fr(e, sx, sy, 2, -4, 2, 2, '#9a6a40');
          fr(e, sx, sy, 2, -4, 1, 1, '#4a2a18');
          fr(e, sx, sy, -3, -4 - wag, 1, 2, '#8a5a36');
          break;
        }
        case 'd': {
          const gr = e.s === 'graze';
          sh(sx, sy, 6);
          fr(e, sx, sy, -3, -3, 1, 3, '#8a5a30');
          fr(e, sx, sy, 2, -3, 1, 3, '#8a5a30');
          fr(e, sx, sy, -2, -3, 1, 2, '#6a421f');
          fr(e, sx, sy, 1, -3, 1, 2, '#6a421f');
          fr(e, sx, sy, -3, -6, 7, 3, '#b9783f');
          fr(e, sx, sy, -3, -4, 7, 1, '#d9a064');
          fr(e, sx, sy, -4, -6, 1, 1, '#fff');
          fr(e, sx, sy, -1, -5, 1, 1, '#f3d9b0');
          fr(e, sx, sy, 1, -6, 1, 1, '#f3d9b0');
          if (gr) {
            fr(e, sx, sy, 4, -4, 2, 3, '#b9783f');
            fr(e, sx, sy, 5, -2, 2, 2, '#c98a4f');
          } else {
            fr(e, sx, sy, 3, -9, 2, 4, '#b9783f');
            fr(e, sx, sy, 4, -10, 3, 2, '#c98a4f');
            fr(e, sx, sy, 4, -11, 1, 1, '#8a5a30');
            if (e.stag) {
              fr(e, sx, sy, 3, -14, 1, 3, '#d8c9a0');
              fr(e, sx, sy, 5, -13, 1, 2, '#d8c9a0');
              fr(e, sx, sy, 2, -14, 1, 1, '#d8c9a0');
            }
          }
          break;
        }
        case 'r':
          sh(sx, sy, 2, 0.25);
          fr(e, sx, sy, -1, -2 - (e.z | 0), 3, 2, '#d9d2c3');
          fr(e, sx, sy, 1, -3 - (e.z | 0), 2, 2, '#e8e2d4');
          fr(e, sx, sy, 1, -5 - (e.z | 0), 1, 2, '#d9d2c3');
          fr(e, sx, sy, -2, -2 - (e.z | 0), 1, 1, '#fff');
          break;
        case 'b': {
          if (night > 0.7) break;
          const up = (Math.floor(tm * 7 + e.ph) & 1), a = 1 - night * 1.4;
          sh(sx, sy + e.z, 2, 0.15 * a);
          ctx.globalAlpha = cl(a, 0, 1);
          ctx.fillStyle = '#2f2a4a'; ctx.fillRect(sx - 1, sy - e.z, 3, 1);
          ctx.fillStyle = '#4b4378'; ctx.fillRect(sx - 3, sy - e.z + (up ? -2 : 1), 2, 1);
          ctx.fillRect(sx + 2, sy - e.z + (up ? -2 : 1), 2, 1);
          ctx.fillStyle = '#e8c47a'; ctx.fillRect(sx + (e.d > 0 ? 2 : -2), sy - e.z, 1, 1);
          ctx.globalAlpha = 1;
          break;
        }
        case 'y': {
          if (night > 0.5) break;
          const f = (Math.floor(tm * 9 + e.ph) & 1);
          ctx.fillStyle = e.c || '#fff'; ctx.fillRect(sx - 1, sy - e.z - (f ? 1 : 0), 1, 2);
          ctx.fillRect(sx + 1, sy - e.z - (f ? 1 : 0), 1, 2);
          ctx.fillStyle = '#2a1a22'; ctx.fillRect(sx, sy - e.z, 1, 2);
          break;
        }
      }
    }

    function ripple(x: number, y: number) {
      RP.push({ x, y, t: 0 });
    }

    function act(sx: number, sy: number) {
      const u = (sx / S - OX) / 8;
      const v = (sy / S - OY) / 4;
      const x = (u + v) / 2;
      const y = (v - u) / 2;
      if (!inb(x, y)) return;
      if (ok(x, y)) {
        if (!E.some(o => o.k === 't' && Math.hypot(o.x - x, o.y - y) < 1)) {
          if (planted.length > 40) {
            const o = planted.shift()!;
            const idx = E.indexOf(o);
            if (idx !== -1) E.splice(idx, 1);
          }
          addTree(x, y, 0.05);
          for (let i = 0; i < 10; i++) {
            pp(x, y, 2, rr(-0.8, 0.8), rr(-0.8, 0.8), rr(6, 14), rr(0.6, 1.2), pk(['#b4c25a', '#f4d35e', '#fff']));
          }
        }
      } else {
        ripple(x, y);
      }
    }

    function setPtr(ev: MouseEvent | PointerEvent) {
      ptr.on = true;
      const u = (ev.clientX / S - OX) / 8;
      const v = (ev.clientY / S - OY) / 4;
      ptr.x = (u + v) / 2;
      ptr.y = (v - u) / 2;
      ptr.sx = ev.clientX / S;
      ptr.sy = ev.clientY / S;
    }

    let ptTimeout: number | null = null;
    const handlePointerMove = (ev: PointerEvent) => {
      setPtr(ev);
    };

    const handlePointerDown = (ev: PointerEvent) => {
      const target = ev.target;
      // Do not plant or ripple if interacting with UI controls
      if (target instanceof Element && target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, .cursor-grab, [tabindex="0"]')) {
        return;
      }
      setPtr(ev);
      act(ev.clientX, ev.clientY);
      if (ptTimeout) clearTimeout(ptTimeout);
      if (ev.pointerType !== 'mouse') {
        ptTimeout = window.setTimeout(() => { ptr.on = false; }, 1500);
      }
    };

    const handlePointerLeave = () => {
      ptr.on = false;
    };

    /* ---- Camera navigation & website scroll integration ---- */
    let cam = 0;
    let camT = 0;

    function camUpd(dt: number) {
      cam += (camT - cam) * Math.min(1, dt * 2.5);
      OY = (H >> 1) - C * 8 - 320 * cam;
    }

    // Scroll tracking: seamlessly travel from island (top of website) across bridge to kingdom (bottom of website)
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      camT = cl(progress, 0, 1);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerleave', handlePointerLeave);

    /* ---- main loop ---- */
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = performance.now();
    let hudT = 0;
    let animId: number;

    function frame(now: number) {
      if (!enabled) return;
      const dt = Math.min(0.05, (now - last) / 1000) * (RM ? 0.4 : 1);
      last = now;
      tm += dt;
      T = (tm / 110 + 0.3) % 1;
      wind = 0.5 + 0.5 * Math.sin(tm * 0.4);
      camUpd(dt);

      const s = Math.sin(6.2832 * (T - 0.25));
      night = cl((-s + 0.05) / 0.35, 0, 1);

      herd.t -= dt;
      if (herd.t < 0) {
        [herd.x, herd.y] = lp2(C, C, 12);
        herd.t = rr(12, 22);
      }

      E.forEach(e => upd(e, dt));

      for (const f of FS) {
        const gx = PX + Math.cos(tm * 0.4 + f.ph * 0.35) * 2 + Math.cos(f.ph) * 0.5;
        const gy = PY + Math.sin(tm * 0.31 + f.ph * 0.3) * 2 + Math.sin(f.ph) * 0.5;
        f.d = gx - f.x;
        f.x += (gx - f.x) * dt * 0.9;
        f.y += (gy - f.y) * dt * 0.9;
        f.j -= dt;
        if (f.j < 0) {
          f.j = rr(8, 24);
          f.z = 0.01;
        }
        if (f.z > 0) {
          f.z += dt * 1.6;
          if (f.z > 1) {
            f.z = 0;
            ripple(f.x, f.y);
          }
        }
      }

      for (let i = PR.length - 1; i >= 0; i--) {
        const p = PR[i];
        p.l -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        if (p.l <= 0) PR.splice(i, 1);
      }

      ctx.drawImage(tc, OX - WOX, OY - MY);

      ctx.fillStyle = '#cfeaff';
      for (const [wx0, wy0] of WL) {
        const wx = wx0 + OX - WOX, wy = wy0 + OY - MY;
        if (wx < 0 || wx > W || wy < 0 || wy > H) continue;
        const h = hs(wx0 * 0.7, wy0 + Math.floor(tm * 1.6 + wx0 * 0.3));
        if (h > 0.93) {
          ctx.globalAlpha = 0.7;
          ctx.fillRect(wx - 3 + (((h * 60) % 7) | 0), wy - 1 + (((h * 90) % 3) | 0), 2, 1);
          ctx.globalAlpha = 1;
        }
      }

      for (const f of FS) {
        if (f.z > 0) continue;
        const [sx, sy] = P(f.x, f.y), flFlip = Math.floor(tm * 6 + f.ph) & 1;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = f.c;
        ctx.fillRect(sx - 1, sy, 3, 1);
        ctx.fillRect((f.d || 0) > 0 ? sx - 2 : sx + 2, sy - (flFlip ? 1 : 0), 1, flFlip ? 2 : 1);
        ctx.globalAlpha = 1;
      }

      for (const f of FS) {
        if (f.z <= 0) continue;
        const [sx, sy] = P(f.x, f.y), z = Math.sin(f.z * 3.14) * 9;
        ctx.fillStyle = f.c;
        ctx.fillRect(sx - 1, (sy - z) | 0, 3, 1);
        ctx.fillRect(sx, (sy - z - 1) | 0, 1, 1);
      }

      for (let i = RP.length - 1; i >= 0; i--) {
        const r = RP[i];
        r.t += dt;
        if (r.t > 1.6) {
          RP.splice(i, 1);
          continue;
        }
        const [sx, sy] = P(r.x, r.y), rad = r.t * 12;
        ctx.fillStyle = '#e8f6ff';
        ctx.globalAlpha = 1 - r.t / 1.6;
        for (let a = 0; a < 6.28; a += 0.25) {
          ctx.fillRect(Math.round(sx + Math.cos(a) * rad), Math.round(sy + Math.sin(a) * rad * 0.5), 1, 1);
        }
        ctx.globalAlpha = 1;
      }

      const L = E.filter(e => e.k !== 'ff');
      L.forEach(e => {
        e.dk = e.x + e.y + (e.k === 'b' ? 8 : 0) + (e.k === 'y' ? 1 : 0);
      });
      L.sort((a, b) => (a.dk || 0) - (b.dk || 0));

      for (const e of L) {
        const [sx, sy] = P(e.x, e.y);
        if (sx < -60 || sx > W + 60 || sy < -70 || sy > H + 40) continue;
        drw(e, sx, sy);
      }

      for (const p of PR) {
        const [sx, sy] = P(p.x, p.y);
        ctx.globalAlpha = cl(p.l / p.m, 0, 1);
        ctx.fillStyle = p.c;
        ctx.fillRect(sx, (sy - p.z) | 0, 1, 1);
      }
      ctx.globalAlpha = 1;

      /* tint for time of day */
      const w = cl(1 - Math.abs(s + 0.02) / 0.3, 0, 1);
      const c = [255, 255, 255];
      [
        [255, 196, 160, w],
        [64, 78, 150, night * 0.92]
      ].forEach(([r, g, b, k]) => {
        c[0] = lp(c[0], r, k);
        c[1] = lp(c[1], g, k);
        c[2] = lp(c[2], b, k);
      });

      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';
      if (night > 0.05) {
        for (const e of E) {
          if (!'FLhKA'.includes(e.k)) continue;
          const [sx, sy] = P(e.x, e.y);
          if (sx < -40 || sx > W + 40 || sy < -60 || sy > H + 60) continue;

          if (e.k === 'F') {
            ctx.fillStyle = '#ff9a3c';
            for (let r = 34; r > 4; r -= 6) {
              ctx.globalAlpha = 0.05 * night * (1 + 0.15 * Math.sin(tm * 18 + r));
              disc(sx, sy - 4, r, r >> 1);
            }
          } else if (e.k === 'L') {
            ctx.fillStyle = '#ffd27a';
            ctx.globalAlpha = 0.08 * night;
            disc(sx, sy - 8, 11, 6);
            ctx.globalAlpha = night * 0.9;
            ctx.fillRect(sx - 1, sy - 10, 3, 3);
          } else if (e.k === 'h') {
            ctx.fillStyle = '#ffd27a';
            ctx.globalAlpha = night * 0.8;
            ctx.fillRect(sx - 7, sy - 11, 3, 3);
          } else if (e.k === 'A') {
            ctx.fillStyle = '#ffd27a';
            ctx.globalAlpha = night * 0.1;
            disc(sx, sy - 12, 16, 9);
            ctx.globalAlpha = night * 0.9;
            ctx.fillRect(sx - 12, sy - 11, 2, 3);
            ctx.fillRect(sx + 9, sy - 11, 2, 3);
          } else {
            ctx.fillStyle = '#ffd27a';
            ctx.globalAlpha = night * 0.8;
            CW.forEach(([a, b]) => ctx.fillRect(sx + a - 50, sy + b - 95, 2, 5));
          }
        }

        for (const e of E) {
          if (e.k !== 'ff') continue;
          const [sx, sy] = P(e.x, e.y), b = Math.max(0, Math.sin(tm * 1.7 + e.ph * 3));
          ctx.globalAlpha = night * b * 0.35;
          ctx.fillStyle = '#d8ff7a';
          ctx.fillRect(sx - 1, (sy - e.z - 1) | 0, 3, 3);
          ctx.globalAlpha = night * b;
          ctx.fillStyle = '#f4ffb0';
          ctx.fillRect(sx, (sy - e.z) | 0, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (ptr.on && ptr.sx != null) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#fff';
        ctx.fillRect(ptr.sx | 0, ptr.sy | 0, 1, 1);
        ctx.globalAlpha = 1;
      }

      hudT -= dt;
      if (hudT < 0 && hudRef.current) {
        hudT = 1;
        const hh = T * 24;
        const ph = night > 0.6 ? 'night' : w > 0.3 ? (T < 0.5 ? 'dawn' : 'dusk') : 'day';
        const region = cam < 0.3 ? 'island' : cam > 0.7 ? 'kingdom' : 'bridge';
        hudRef.current.textContent = `${String(hh | 0).padStart(2, '0')}:${String(((hh % 1) * 60) | 0).padStart(2, '0')} ${ph} · ${region} · ${V.length} villagers · ${E.filter(e => e.k === 'd').length} deer · ${E.filter(e => e.k === 'r').length} rabbits · ${E.filter(e => e.k === 't').length} trees`;
      }

      animId = requestAnimationFrame(frame);
    }

    let rz: number;
    const handleResize = () => {
      clearTimeout(rz);
      rz = window.setTimeout(build, 120);
    };
    window.addEventListener('resize', handleResize);

    build();
    if (enabled) {
      animId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerleave', handlePointerLeave);
      if (ptTimeout) clearTimeout(ptTimeout);
    };
  }, [enabled]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="pixel-valley"
        className="fixed inset-0 w-full h-full pointer-events-none select-none"
        style={{
          imageRendering: 'pixelated',
          zIndex: 0,
        }}
      />
      {/* Subtle Living World Clock, Region & Population HUD in bottom-left */}
      <div
        ref={hudRef}
        className="fixed bottom-2.5 left-3 z-10 text-[11px] font-mono text-[#fbf1d4] bg-[#272343]/90 px-3 py-1 border-2 border-[#4a4378] shadow-[3px_3px_0_#0c0a2a] pixel-corners-sm pointer-events-none select-none tracking-wider drop-shadow-md hidden sm:block"
      />
    </>
  );
};
