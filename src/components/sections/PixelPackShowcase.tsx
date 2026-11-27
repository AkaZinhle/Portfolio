import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { PROJECTS } from '../../data/projects';
import { Project } from '../../types';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface PixelPackShowcaseProps {
  onSelectProject: (project: Project) => void;
}

// Rarity metadata for the 7 projects
const PROJECT_RARITIES: { r: number; label: string; color: string }[] = [
  { r: 3, label: 'ULTRA RARE', color: '#ff7ad9' }, // VoltStock
  { r: 2, label: 'RARE', color: '#ffd24a' },       // PCB Defect
  { r: 2, label: 'RARE', color: '#ffd24a' },       // UnderWrite.AI
  { r: 1, label: 'UNCOMMON', color: '#4cc9f0' },   // CV Traffic Sign
  { r: 1, label: 'UNCOMMON', color: '#4cc9f0' },   // YOLOv3
  { r: 3, label: 'ULTRA RARE', color: '#ff7ad9' }, // Mistral-7B
  { r: 0, label: 'COMMON', color: '#8d99ae' },     // Salary Prediction
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  l: number;
  m: number;
  c: string;
  s: number;
}

export const PixelPackShowcase: React.FC<PixelPackShowcaseProps> = ({ onSelectProject }) => {
  const [mode, setMode] = useState<'pack' | 'stack' | 'gallery'>('pack');
  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [revealedCards, setRevealedCards] = useState<boolean[]>(Array(7).fill(false));
  const [galleryPos, setGalleryPos] = useState<number>(0);
  const [tearProgress, setTearProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [showRays, setShowRays] = useState<boolean>(false);
  const [stageMessage, setStageMessage] = useState<string>('<b>SWIPE ACROSS THE TOP TO TEAR</b><br>or click to auto-open');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const packRef = useRef<HTMLDivElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bodyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const isTearingRef = useRef<boolean>(false);
  const tearStartRef = useRef<{ x: number; w: number }>({ x: 0, w: 260 });
  const lastTearTickRef = useRef<number>(-1);
  const isBusyRef = useRef<boolean>(false);
  const isRippedRef = useRef<boolean>(false);

  // Gallery dragging & direct DOM transform refs
  const slotNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const tiltNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const galleryPosRef = useRef<number>(0);
  const dragStartRef = useRef<{ x: number; p: number; moved: boolean } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!soundEnabled) return null;
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [soundEnabled]);

  const playTone = useCallback((f: number, d = 0.1, t: OscillatorType = 'square', v = 0.05, sl = 0, at = 0) => {
    try {
      const a = getAudioCtx();
      if (!a) return;
      const o = a.createOscillator();
      const g = a.createGain();
      const n = a.currentTime + at;
      o.type = t;
      o.frequency.setValueAtTime(f, n);
      if (sl) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + sl), n + d);
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
      o.connect(g).connect(a.destination);
      o.start(n);
      o.stop(n + d);
    } catch {}
  }, [getAudioCtx]);

  const playNoise = useCallback((d = 0.25, v = 0.08, f = 1800, at = 0) => {
    try {
      const a = getAudioCtx();
      if (!a) return;
      const n = a.currentTime + at;
      const b = a.createBuffer(1, Math.floor(a.sampleRate * d), a.sampleRate);
      const x = b.getChannelData(0);
      for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1;
      const s = a.createBufferSource();
      const fl = a.createBiquadFilter();
      const g = a.createGain();
      s.buffer = b;
      fl.type = 'bandpass';
      fl.frequency.value = f;
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
      s.connect(fl).connect(g).connect(a.destination);
      s.start(n);
    } catch {}
  }, [getAudioCtx]);

  const playArp = useCallback((notes: number[], t: OscillatorType = 'square', v = 0.04, s = 0.075) => {
    notes.forEach((f, i) => playTone(f, 0.22, t, v, 0, i * s));
  }, [playTone]);

  // Particle System
  const spawnBurst = useCallback((x: number, y: number, n: number, cols: string[], sp = 120, up = 30, life = 1) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const v = (0.25 + Math.random() * 0.75) * sp;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - up,
        g: 220,
        l: (0.5 + Math.random() * 0.5) * life,
        m: life,
        c: cols[Math.floor(Math.random() * cols.length)],
        s: Math.random() < 0.35 ? 3 : 2,
      });
    }
  }, []);

  const triggerScreenShake = useCallback((strength = 8) => {
    if (stageRef.current) {
      stageRef.current.style.setProperty('--sh', `${strength}px`);
      setIsShaking(false);
      void stageRef.current.offsetWidth;
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  }, []);

  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 700);
  }, []);

  const triggerRays = useCallback(() => {
    setShowRays(true);
    setTimeout(() => setShowRays(false), 1000);
  }, []);

  // DOM Anchor registration for living environment
  useEffect(() => {
    if (containerRef.current) {
      globalAnchorManager.registerElement(
        'project-pack-depot',
        containerRef.current,
        'building',
        'Engineering Pack Depot'
      );
    }
    return () => {
      globalAnchorManager.unregisterElement('project-pack-depot');
    };
  }, []);

  // Initialize and Render Pixel Pack Canvases & Card Textures
  useEffect(() => {
    const topCv = topCanvasRef.current;
    const bodyCv = bodyCanvasRef.current;
    const stage = stageRef.current;
    if (!topCv || !bodyCv || !stage) return;

    // 1. Pack Art
    const pa = document.createElement('canvas');
    pa.width = 96;
    pa.height = 132;
    const pg = pa.getContext('2d');
    if (!pg) return;

    const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const by = (x: number, y: number) => (BY[((y & 3) << 2) | (x & 3)] + 0.5) / 16;
    const hs = (x: number, y: number) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    // Dithered metallic purple foil background
    for (let y = 0; y < 132; y++) {
      for (let x = 0; x < 96; x++) {
        const t = y / 132 + (by(x, y) - 0.5) * 0.25 + Math.sin((x + y) * 0.12) * 0.06;
        pg.fillStyle = t < 0.3 ? '#6a3df0' : t < 0.55 ? '#4d2bc4' : t < 0.8 ? '#3a1f9a' : '#2a1470';
        pg.fillRect(x, y, 1, 1);
      }
    }

    // Stars & constellations
    for (let i = 0; i < 42; i++) {
      pg.fillStyle = ['#ffd24a', '#fff6dc', '#7ff0ff', '#ff9a3c'][i % 4];
      pg.fillRect((hs(i, 5) * 94 + 1) | 0, (8 + hs(i, 6) * 116) | 0, 1, 1);
    }

    // Crimped foil zig-zags top & bottom
    for (let x = 0; x < 96; x++) {
      const l = (x >> 1) & 1;
      pg.fillStyle = l ? '#c9c3e8' : '#8f88c0';
      pg.fillRect(x, 0, 1, 5);
      pg.fillRect(x, 127, 1, 5);
      pg.fillStyle = '#2a1470';
      pg.fillRect(x, 5, 1, 1);
      pg.fillRect(x, 126, 1, 1);
    }

    // Golden side sealed rails
    pg.fillStyle = '#ffd24a';
    pg.fillRect(0, 5, 1, 121);
    pg.fillRect(95, 5, 1, 121);

    // Pixel Star Badge
    const STAR = [
      '......x......', '......x......', '.....xxx.....', 'xxxxxxxxxxxxx',
      '.xxxxxxxxxxx.', '..xxxxxxxxx..', '...xxxxxxx...', '...xxxxxxx...',
      '..xxxx.xxxx..', '..xxx...xxx..', '.xx.......xx.'
    ];
    STAR.forEach((r, j) => {
      [...r].forEach((ch, i) => {
        if (ch === 'x') {
          pg.fillStyle = '#2a1470';
          pg.fillRect(37 + i * 2, 32 + j * 2, 2, 2);
          pg.fillStyle = '#ffd24a';
          pg.fillRect(35 + i * 2, 30 + j * 2, 2, 2);
          pg.fillStyle = '#fff6a8';
          pg.fillRect(35 + i * 2, 30 + j * 2, 1, 1);
        }
      });
    });

    topCv.width = 96;
    topCv.height = 22;
    topCv.getContext('2d')?.drawImage(pa, 0, 0);

    bodyCv.width = 96;
    bodyCv.height = 110;
    bodyCv.getContext('2d')?.drawImage(pa, 0, 22, 96, 110, 0, 0, 96, 110);

    // 2. Textures for Card Backs and Foil Glint
    const bk = document.createElement('canvas');
    bk.width = 8;
    bk.height = 8;
    const bg = bk.getContext('2d');
    if (bg) {
      bg.fillStyle = '#2e2080'; bg.fillRect(0, 0, 8, 8);
      bg.fillStyle = '#4a38b8';
      bg.fillRect(3, 0, 2, 2); bg.fillRect(0, 3, 2, 2);
      bg.fillRect(6, 3, 2, 2); bg.fillRect(3, 6, 2, 2);
      bg.fillStyle = '#7a66f0'; bg.fillRect(3, 3, 2, 2);
    }

    const sc = document.createElement('canvas');
    sc.width = 13;
    sc.height = 11;
    const scCtx = sc.getContext('2d');
    if (scCtx) {
      STAR.forEach((r, j) => [...r].forEach((ch, i) => {
        if (ch === 'x') {
          scCtx.fillStyle = '#ffd24a';
          scCtx.fillRect(i, j, 1, 1);
        }
      }));
    }

    const sp = document.createElement('canvas');
    sp.width = 32;
    sp.height = 32;
    const sg = sp.getContext('2d');
    if (sg) {
      for (let i = 0; i < 26; i++) {
        sg.fillStyle = ['#fff', '#fffbd0', '#bff'][i % 3];
        sg.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 1, 1);
      }
    }

    stage.style.setProperty('--bk', `url(${bk.toDataURL()})`);
    stage.style.setProperty('--st', `url(${sc.toDataURL()})`);
    stage.style.setProperty('--sp', `url(${sp.toDataURL()})`);
  }, []);

  // Particle Animation Loop
  useEffect(() => {
    const cv = fxCanvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let prev = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      if (cv.width !== cv.clientWidth || cv.height !== cv.clientHeight) {
        cv.width = cv.clientWidth;
        cv.height = cv.clientHeight;
      }

      ctx.clearRect(0, 0, cv.width, cv.height);

      const pts = particlesRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.l -= dt;
        if (p.l <= 0) {
          pts.splice(i, 1);
          continue;
        }
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        ctx.globalAlpha = Math.min(1, (p.l / p.m) * 1.5);
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.s, p.s);
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pack Tear Handlers
  const handleTearProgress = useCallback((pVal: number) => {
    const clamped = Math.max(0, Math.min(1, pVal));
    setTearProgress(clamped);

    const tickStep = Math.floor(clamped * 12);
    if (tickStep !== lastTearTickRef.current) {
      lastTearTickRef.current = tickStep;
      playTone(240 + tickStep * 55, 0.05, 'square', 0.04);
      playNoise(0.06, 0.05, 2400 + tickStep * 200);

      if (packRef.current) {
        const r = packRef.current.getBoundingClientRect();
        const stageR = stageRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const sparkX = r.left - stageR.left + r.width * clamped;
        const sparkY = r.top - stageR.top + r.height * 0.167;
        spawnBurst(sparkX, sparkY, 4, ['#fff', '#ffd24a', '#ff9a3c'], 80, 20, 0.5);
      }
    }
  }, [playTone, playNoise, spawnBurst]);

  const executePackRip = useCallback(() => {
    if (isRippedRef.current) return;
    isRippedRef.current = true;

    if (packRef.current && stageRef.current) {
      const r = packRef.current.getBoundingClientRect();
      const stageR = stageRef.current.getBoundingClientRect();
      const cx = r.left - stageR.left + r.width / 2;
      const cy = r.top - stageR.top + r.height * 0.4;
      spawnBurst(cx, cy, 100, ['#fff', '#ffd24a', '#7ff0ff', '#ff7ad9', '#ff9a3c'], 230, 75, 1.2);
    }

    playNoise(0.6, 0.28, 900);
    playNoise(0.3, 0.2, 4200);
    playTone(150, 0.45, 'sawtooth', 0.08, -100);
    playTone(660, 0.3, 'square', 0.05, 700, 0.04);
    playArp([523, 659, 784, 1047], 'square', 0.05, 0.06);

    triggerScreenShake(12);
    triggerFlash();
    triggerRays();

    setTimeout(() => {
      setMode('stack');
      setRevealIndex(0);
      setStageMessage('<b>TAP THE CARD TO REVEAL</b><br>Card 1 of 7');
    }, 750);
  }, [playNoise, playTone, playArp, spawnBurst, triggerScreenShake, triggerFlash, triggerRays]);

  const handlePointerDownPack = (e: React.PointerEvent) => {
    if (mode !== 'pack' || isRippedRef.current) return;
    isTearingRef.current = true;
    const w = packRef.current?.offsetWidth || 260;
    tearStartRef.current = { x: e.clientX, w };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMovePack = (e: React.PointerEvent) => {
    if (!isTearingRef.current || isRippedRef.current) return;
    const dx = e.clientX - tearStartRef.current.x;
    const pVal = dx / (tearStartRef.current.w * 0.85);
    handleTearProgress(pVal);

    if (pVal >= 1) {
      isTearingRef.current = false;
      executePackRip();
    }
  };

  const handlePointerUpPack = (e: React.PointerEvent) => {
    if (!isTearingRef.current) return;
    isTearingRef.current = false;
    const dx = e.clientX - tearStartRef.current.x;
    if (Math.abs(dx) < 10) {
      handleAutoTear();
    } else if (tearProgress < 1) {
      setTearProgress(0);
      lastTearTickRef.current = -1;
      playTone(220, 0.14, 'square', 0.05, -120);
    }
  };

  const handleAutoTear = useCallback(() => {
    if (isRippedRef.current || mode !== 'pack') return;
    isRippedRef.current = true;
    const t0 = performance.now();

    const animateTear = (now: number) => {
      const v = Math.min(1, (now - t0) / 520);
      const ease = v * v * (3 - 2 * v);
      handleTearProgress(ease);
      if (v < 1) {
        requestAnimationFrame(animateTear);
      } else {
        isRippedRef.current = false;
        executePackRip();
      }
    };
    requestAnimationFrame(animateTear);
  }, [mode, handleTearProgress, executePackRip]);

  // Card Reveal Fanfare based on Project Rarity
  const triggerRevealFanfare = useCallback((idx: number) => {
    const meta = PROJECT_RARITIES[idx];
    const r = meta.r;

    if (stageRef.current) {
      const stageR = stageRef.current.getBoundingClientRect();
      const cx = stageR.width / 2;
      const cy = stageR.height / 2;
      const colors = [
        ['#8d99ae', '#fff'],
        ['#4cc9f0', '#bff', '#fff'],
        ['#ffd24a', '#fff6a8', '#fff', '#ff9a3c'],
        ['#ff7ad9', '#ffd24a', '#4dffb8', '#4d9bff', '#c04dff', '#fff']
      ][r];
      const count = [20, 35, 65, 120][r];
      const speed = [110, 150, 210, 290][r];
      spawnBurst(cx, cy, count, colors, speed, 40, 1.2);
    }

    if (r === 0) {
      playTone(660, 0.12, 'triangle', 0.06);
    } else if (r === 1) {
      playArp([660, 880], 'triangle', 0.06);
    } else if (r === 2) {
      playArp([523, 659, 784, 1047], 'square', 0.05);
      triggerScreenShake(6);
    } else if (r === 3) {
      triggerFlash();
      triggerRays();
      triggerScreenShake(10);
      playArp([523, 659, 784, 1047, 1319, 1568], 'square', 0.05, 0.07);
      playArp([262, 330, 392, 523], 'triangle', 0.08, 0.07);
      playNoise(0.4, 0.12, 3200);
    }
  }, [playTone, playArp, playNoise, spawnBurst, triggerScreenShake, triggerFlash, triggerRays]);

  // Flip active card in stack mode
  const flipCardInStack = useCallback(() => {
    if (isBusyRef.current || revealedCards[revealIndex]) return;
    isBusyRef.current = true;

    const idx = revealIndex;
    playTone(520, 0.06);
    playTone(780, 0.08, 'square', 0.04, 0, 0.05);

    setRevealedCards(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });

    setTimeout(() => {
      triggerRevealFanfare(idx);
      isBusyRef.current = false;
      setStageMessage(`<b>TAP TO CONTINUE</b><br>Revealed ${idx + 1} of 7`);
    }, 320);
  }, [revealIndex, revealedCards, playTone, triggerRevealFanfare]);

  // Advance to next card in stack mode
  const advanceStack = useCallback(() => {
    if (isBusyRef.current || !revealedCards[revealIndex]) return;
    isBusyRef.current = true;
    playTone(420, 0.05, 'square', 0.04, 250);

    const nextIdx = revealIndex + 1;
    if (nextIdx >= 7) {
      setTimeout(() => {
        setMode('gallery');
        setGalleryPos(0);
        galleryPosRef.current = 0;
        isBusyRef.current = false;
        playArp([523, 659, 784, 1047], 'triangle', 0.06, 0.08);
      }, 400);
    } else {
      setRevealIndex(nextIdx);
      setTimeout(() => {
        isBusyRef.current = false;
        setStageMessage(`<b>TAP THE CARD TO REVEAL</b><br>Card ${nextIdx + 1} of 7`);
      }, 250);
    }
  }, [revealIndex, revealedCards, playTone, playArp]);

  // Skip reveal sequence directly to original carousel layout
  const handleSkipToGallery = useCallback(() => {
    setRevealedCards(Array(7).fill(true));
    setMode('gallery');
    setGalleryPos(0);
    galleryPosRef.current = 0;
    isBusyRef.current = false;
    playArp([523, 784], 'triangle', 0.05, 0.08);
  }, [playArp]);

  // Re-pack / Open New Pack
  const handleNewPack = useCallback(() => {
    setMode('pack');
    setRevealIndex(0);
    setGalleryPos(0);
    galleryPosRef.current = 0;
    setRevealedCards(Array(7).fill(false));
    setTearProgress(0);
    isRippedRef.current = false;
    isBusyRef.current = false;
    lastTearTickRef.current = -1;
    setStageMessage('<b>SWIPE ACROSS THE TOP TO TEAR</b><br>or click to auto-open');
    playTone(330, 0.08);
    playTone(494, 0.1, 'square', 0.05, 0, 0.07);
  }, [playTone]);

  // Original Carousel Layout Calculation from pixel-pack.html
  const computeGalleryLayout = useCallback((i: number, pos: number) => {
    const wide = typeof window !== 'undefined' ? window.innerWidth > 760 : true;
    const cw = wide ? 370 : 315;
    const d = i - pos;
    const a = Math.abs(d);

    // Exact formula from pixel-pack.html:
    // translate3d(d*cw*(wide?.62:.55)px, 0, -a*90px) rotateY(cl(-d*30,-60,60)deg) scale(max(.5, 1-a*.1))
    const xTrans = Math.round(d * cw * (wide ? 0.62 : 0.55));
    const zTrans = Math.round(-a * 90);
    const rotY = Math.max(-60, Math.min(60, Math.round(-d * 30)));
    const scale = Math.max(0.5, +(1 - a * 0.1).toFixed(3));
    const opacity = a > 3.2 ? 0 : 1;
    const zIndex = 80 - Math.round(a * 10);

    return {
      transform: `translate3d(${xTrans}px, 0, ${zTrans}px) rotateY(${rotY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: opacity ? ('auto' as const) : ('none' as const),
    };
  }, []);

  // Direct DOM Gallery Transform Application for zero-render 120 FPS
  const applyGalleryTransforms = useCallback((pos: number) => {
    PROJECTS.forEach((_, idx) => {
      const el = slotNodesRef.current[idx];
      if (!el) return;
      const layout = computeGalleryLayout(idx, pos);
      el.style.transform = layout.transform;
      el.style.opacity = `${layout.opacity}`;
      el.style.zIndex = `${layout.zIndex}`;
      el.style.pointerEvents = layout.pointerEvents;
    });
  }, [computeGalleryLayout]);

  // Gallery Dragging & 3D Interactive Tilt Handlers
  const handlePointerDownGallery = (e: React.PointerEvent) => {
    if (mode !== 'gallery') return;
    dragStartRef.current = { x: e.clientX, p: galleryPosRef.current, moved: false };

    slotNodesRef.current.forEach(el => {
      if (el) el.style.transition = 'none';
    });
  };

  const handlePointerMoveGallery = (e: React.PointerEvent) => {
    if (mode !== 'gallery') return;

    // 1. Drag Panning
    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      if (Math.abs(dx) > 6) {
        if (!dragStartRef.current.moved) {
          dragStartRef.current.moved = true;
          try {
            (stageRef.current as HTMLElement).setPointerCapture(e.pointerId);
          } catch {}
        }
      }
      if (dragStartRef.current.moved) {
        const wide = window.innerWidth > 760;
        const cw = wide ? 370 : 315;
        const newPos = Math.max(0, Math.min(6, dragStartRef.current.p - dx / (cw * 0.6)));
        galleryPosRef.current = newPos;

        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            applyGalleryTransforms(galleryPosRef.current);
            rafIdRef.current = null;
          });
        }
        return;
      }
    }

    // 2. 3D Hover Tilt & Holographic reflection angle
    const activeIdx = Math.round(galleryPosRef.current);
    const activeSlot = slotNodesRef.current[activeIdx];
    const activeTilt = tiltNodesRef.current[activeIdx];
    const activeCard = cardNodesRef.current[activeIdx];

    tiltNodesRef.current.forEach((q, idx) => {
      if (q && idx !== activeIdx) q.style.transform = '';
    });

    if (activeSlot && activeTilt && activeCard && !dragStartRef.current?.moved) {
      const b = activeSlot.getBoundingClientRect();
      const inside = e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom;
      if (inside) {
        const mx = Math.max(0, Math.min(1, (e.clientX - b.left) / b.width));
        const my = Math.max(0, Math.min(1, (e.clientY - b.top) / b.height));
        activeTilt.style.transform = `rotateX(${(0.5 - my) * 12}deg) rotateY(${(mx - 0.5) * 16}deg)`;
        activeCard.style.setProperty('--mx', `${mx}`);
        activeCard.style.setProperty('--my', `${my}`);
      } else {
        activeTilt.style.transform = '';
      }
    }
  };

  const handlePointerUpGallery = (e: React.PointerEvent) => {
    if (mode !== 'gallery' || !dragStartRef.current) return;
    const wasMoved = dragStartRef.current.moved;
    dragStartRef.current = null;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    try {
      (stageRef.current as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Restore smooth CSS transitions
    slotNodesRef.current.forEach(el => {
      if (el) el.style.transition = 'transform .6s cubic-bezier(.2,.9,.25,1.08), opacity .4s';
    });

    if (wasMoved) {
      const snapped = Math.round(galleryPosRef.current);
      galleryPosRef.current = snapped;
      setGalleryPos(snapped);
      applyGalleryTransforms(snapped);
      playTone(500, 0.04, 'square', 0.04);
    } else {
      // Tap or click without drag -> trigger card open / selection
      const target = e.target as HTMLElement;
      const slotEl = target.closest('.pk-slot') as HTMLElement | null;
      if (slotEl && slotEl.dataset.idx !== undefined) {
        const idx = parseInt(slotEl.dataset.idx, 10);
        handleCardClick(idx);
      } else {
        handleCardClick(Math.round(galleryPosRef.current));
      }
    }
  };

  // Card click handler: clicking any card opens project details modal!
  const handleCardClick = (idx: number) => {
    if (mode === 'stack') {
      if (revealedCards[idx]) advanceStack();
      else flipCardInStack();
    } else if (mode === 'gallery') {
      galleryPosRef.current = idx;
      setGalleryPos(idx);
      applyGalleryTransforms(idx);
      onSelectProject(PROJECTS[idx]);
      playTone(660, 0.06);
    }
  };

  // Mouse wheel step navigation
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (mode !== 'gallery') return;
      const delta = Math.sign(e.deltaY || e.deltaX);
      const newPos = Math.max(0, Math.min(6, Math.round(galleryPosRef.current) + delta));
      galleryPosRef.current = newPos;
      setGalleryPos(newPos);
      applyGalleryTransforms(newPos);
      playTone(500, 0.04, 'square', 0.04);
    };

    stage.addEventListener('wheel', handleWheel, { passive: true });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, [mode, applyGalleryTransforms, playTone]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'pack' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleAutoTear();
      } else if (mode === 'stack' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (revealedCards[revealIndex]) advanceStack();
        else flipCardInStack();
      } else if (mode === 'gallery') {
        if (e.key === 'ArrowLeft') {
          const next = Math.max(0, Math.round(galleryPosRef.current) - 1);
          galleryPosRef.current = next;
          setGalleryPos(next);
          applyGalleryTransforms(next);
          playTone(500, 0.04, 'square', 0.04);
        } else if (e.key === 'ArrowRight') {
          const next = Math.min(6, Math.round(galleryPosRef.current) + 1);
          galleryPosRef.current = next;
          setGalleryPos(next);
          applyGalleryTransforms(next);
          playTone(500, 0.04, 'square', 0.04);
        } else if (e.key === 'Enter') {
          onSelectProject(PROJECTS[Math.round(galleryPosRef.current)]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, revealIndex, revealedCards, handleAutoTear, advanceStack, flipCardInStack, applyGalleryTransforms, playTone, onSelectProject]);

  const activeProject = PROJECTS[Math.round(galleryPos)];

  return (
    <section
      id="projects"
      data-rm-ignore
      ref={containerRef}
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden select-none"
    >
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl p-5 sm:p-6 bg-[#272343]/88 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="text-sm px-3.5 py-1.5 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 uppercase tracking-widest font-bold pixel-corners-sm">
              The Engineering Foundry
            </span>
            <div className="h-[2px] w-16 bg-[#ff9a3c]/40" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fbf1d4] font-display">
            Projects
          </h2>

          <p className="text-lg sm:text-xl text-[#fbf1d4] leading-relaxed font-light">
            {mode === 'pack' && 'Open your AI Systems Booster Pack to discover 7 flagship engineering projects.'}
            {mode === 'stack' && 'Tap each card to reveal its holographic schematic and specifications.'}
            {mode === 'gallery' && 'Drag or use arrows to browse the card carousel. Click any card to inspect full project details.'}
          </p>
        </div>

        {/* TOP INTERACTIVE ACTIONS */}
        <div className="flex items-center gap-2.5 p-2 bg-[#272343]/90 border-2 border-[#4a4378] backdrop-blur-md shrink-0 pixel-corners shadow-xl">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Mute Pack Audio' : 'Enable Pack Audio'}
            aria-label="Toggle Pack Chimes"
            className={`p-2.5 border text-xs flex items-center gap-1.5 transition-all cursor-pointer pixel-corners-sm ${
              soundEnabled
                ? 'bg-[#ff9a3c]/20 text-[#ff9a3c] border-[#ff9a3c]/60 hover:bg-[#ff9a3c]/30'
                : 'bg-[#1b1830] text-[#b8b0d4] border-[#4a4378]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mode Specific Action Buttons */}
          {mode === 'pack' && (
            <button
              onClick={handleAutoTear}
              className="px-4 py-2.5 bg-[#ff9a3c] hover:bg-[#e8741a] text-[#0c0a2a] font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 transition-all cursor-pointer pixel-corners-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEAR PACK</span>
            </button>
          )}

          {mode === 'stack' && (
            <button
              onClick={handleSkipToGallery}
              className="px-4 py-2.5 bg-[#ff9a3c] hover:bg-[#e8741a] text-[#0c0a2a] font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 transition-all cursor-pointer pixel-corners-sm shadow-md"
            >
              <span>SKIP ALL &gt;&gt;</span>
            </button>
          )}

          {mode === 'gallery' && (
            <>
              <button
                onClick={() => {
                  const next = Math.max(0, Math.round(galleryPosRef.current) - 1);
                  galleryPosRef.current = next;
                  setGalleryPos(next);
                  applyGalleryTransforms(next);
                  playTone(500, 0.04, 'square', 0.03);
                }}
                className="p-3 bg-[#1b1830] hover:bg-[#352f5a] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/50 transition-all cursor-pointer pixel-corners-sm"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-mono font-bold text-[#ff9a3c] px-2">
                0{Math.round(galleryPos) + 1} / 07
              </span>

              <button
                onClick={() => {
                  const next = Math.min(6, Math.round(galleryPosRef.current) + 1);
                  galleryPosRef.current = next;
                  setGalleryPos(next);
                  applyGalleryTransforms(next);
                  playTone(500, 0.04, 'square', 0.03);
                }}
                className="p-3 bg-[#1b1830] hover:bg-[#352f5a] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/50 transition-all cursor-pointer pixel-corners-sm"
                aria-label="Next Project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleNewPack}
                title="Seal & Open New Pack"
                className="ml-2 px-3 py-2 bg-[#352f5a] hover:bg-[#ff9a3c] text-[#fbf1d4] hover:text-[#0c0a2a] border border-[#4a4378] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer pixel-corners-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>NEW PACK</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3D PACK & CAROUSEL INTERACTION STAGE */}
      <div
        ref={stageRef}
        onPointerDown={mode === 'gallery' ? handlePointerDownGallery : undefined}
        onPointerMove={mode === 'gallery' ? handlePointerMoveGallery : undefined}
        onPointerUp={mode === 'gallery' ? handlePointerUpGallery : undefined}
        onPointerCancel={mode === 'gallery' ? handlePointerUpGallery : undefined}
        className={`relative w-full h-[680px] flex items-center justify-center overflow-visible touch-pan-y ${
          isShaking ? 'pk-shake' : ''
        } ${mode === 'gallery' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ perspective: '1100px' }}
      >
        {/* Particle Canvas Overlay */}
        <canvas
          ref={fxCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-40 image-pixelated"
        />

        {/* Victory Flash & Rays Overlays */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white pointer-events-none z-50 animate-[pk-fs_0.7s_ease-out]" />
        )}
        {showRays && (
          <div
            className="absolute left-1/2 top-1/2 w-[160vmax] h-[160vmax] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-[pk-ry_1s_steps(10)]"
            style={{
              background: 'repeating-conic-gradient(rgba(255,236,150,0.6) 0 5deg, transparent 5deg 16deg)',
              WebkitMaskImage: 'radial-gradient(circle, #000, transparent 58%)',
              maskImage: 'radial-gradient(circle, #000, transparent 58%)',
            }}
          />
        )}

        {/* ======================================================== */}
        {/* 1. RETRO FOIL BOOSTER PACK                               */}
        {/* ======================================================== */}
        {mode === 'pack' && (
          <div
            ref={packRef}
            onPointerDown={handlePointerDownPack}
            onPointerMove={handlePointerMovePack}
            onPointerUp={handlePointerUpPack}
            onPointerCancel={handlePointerUpPack}
            className="relative w-[270px] aspect-[96/132] cursor-grab active:cursor-grabbing touch-none select-none z-20 group"
            style={{
              animation: isRippedRef.current ? 'none' : 'pk-fl 3s steps(8) infinite',
            }}
          >
            {/* Booster Casing with brightness & gold glow proportional to tear */}
            <div
              className="absolute inset-0 transition-all duration-150"
              style={{
                filter: `brightness(${1 + tearProgress * 0.7}) drop-shadow(0 0 ${tearProgress * 22}px #ffd24a)`,
              }}
            >
              {/* Top Tear Strip Canvas */}
              <canvas
                ref={topCanvasRef}
                className={`ptop absolute left-0 top-0 w-full image-pixelated ${
                  isRippedRef.current ? 'gone' : ''
                }`}
                style={{
                  transformOrigin: '100% 100%',
                  transform: isRippedRef.current
                    ? undefined
                    : `translate(${tearProgress * 14}px, ${tearProgress * -10}px) rotate(${tearProgress * -9}deg)`,
                }}
              />

              {/* Main Pack Body Canvas */}
              <canvas
                ref={bodyCanvasRef}
                className={`pbody absolute left-0 top-[16.67%] w-full image-pixelated ${
                  isRippedRef.current ? 'gone' : ''
                }`}
              />

              {/* Pack Center Foil Badge */}
              <div
                className={`pt absolute inset-x-0 top-[48%] text-center text-[#fbf1d4] font-display pointer-events-none drop-shadow-[2px_2px_0_#2a1470] ${
                  isRippedRef.current ? 'gone' : ''
                }`}
              >
                <div className="text-lg tracking-wider font-bold">PORTFOLIO</div>
                <div className="text-[10px] text-[#ffd24a] font-mono tracking-widest mt-1">SET 01 • 7 CARDS</div>
              </div>

              {/* Glowing Tear Seam */}
              <div
                className="seam absolute left-0 top-[calc(16.67%-2px)] h-[4px] bg-white pointer-events-none"
                style={{
                  width: `${tearProgress * 100}%`,
                  boxShadow: `0 0 ${4 + tearProgress * 24}px 2px #ffd24a`,
                  opacity: Math.min(1, tearProgress * 3),
                }}
              />

              {/* Animated Guiding Hand Prompt */}
              {tearProgress === 0 && (
                <div
                  className="hand absolute top-[calc(16.67%-6px)] left-0 w-[14%] h-[12px] bg-gradient-to-r from-transparent to-white pointer-events-none"
                  style={{ animation: 'pk-hn 1.8s steps(14) infinite' }}
                />
              )}

              {/* Rainbow Holo Sheen Sweep */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
                  backgroundSize: '300% 100%',
                  animation: 'pk-sh 3.2s linear infinite',
                }}
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2 & 3. CARDS STAGE (Stack Mode & Original Carousel Mode)  */}
        {/* ======================================================== */}
        {mode !== 'pack' && (
          <div className="absolute inset-0 transform-style-3d">
            {PROJECTS.map((project, idx) => {
              const meta = PROJECT_RARITIES[idx];
              const isRevealed = revealedCards[idx];
              const isCurrentStack = mode === 'stack' && idx === revealIndex;
              const isGalleryActive = mode === 'gallery' && idx === Math.round(galleryPos);

              // 3D positioning logic
              let transform = '';
              let zIndex = 0;
              let opacity = 1;
              let pointerEvents: 'auto' | 'none' = 'auto';

              if (mode === 'stack') {
                if (idx < revealIndex) {
                  // Collected cards
                  const spreadX = (idx - 3) * 38;
                  transform = `translate3d(${spreadX}px, 230px, 0px) scale(0.24)`;
                  zIndex = idx;
                  opacity = 0.75;
                } else if (idx === revealIndex) {
                  // Current revealing card in center
                  transform = 'translate3d(0, 0, 40px) scale(1)';
                  zIndex = 60;
                } else {
                  // Cards stacked behind
                  const d = idx - revealIndex;
                  transform = `translate3d(${d * 2}px, ${-d * 2}px, ${-d * 12}px) rotate(${d % 2 ? 1 : -1}deg)`;
                  zIndex = 50 - d;
                }
              } else {
                // Original Carousel layout from pixel-pack.html
                const layout = computeGalleryLayout(idx, galleryPos);
                transform = layout.transform;
                zIndex = layout.zIndex;
                opacity = layout.opacity;
                pointerEvents = layout.pointerEvents;
              }

              return (
                <div
                  key={project.id}
                  ref={el => { slotNodesRef.current[idx] = el; }}
                  onClick={() => handleCardClick(idx)}
                  data-idx={idx}
                  className={`pk-slot r${meta.r} ${isCurrentStack ? 'hint' : ''} ${isGalleryActive ? 'shine' : ''}`}
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    pointerEvents,
                    ['--rc' as string]: meta.color,
                  }}
                  title={mode === 'gallery' ? `Click card to open ${project.title} case study` : undefined}
                >
                  {/* Ambient Rarity Glow */}
                  <div className="pk-glow" />

                  {/* 3D Tilt Container */}
                  <div
                    ref={el => { tiltNodesRef.current[idx] = el; }}
                    className="pk-tilt"
                  >
                    {/* Flipping Card Container */}
                    <div
                      ref={el => { cardNodesRef.current[idx] = el; }}
                      className={`pk-card ${isRevealed ? 'up' : ''}`}
                    >
                      {/* ============================================== */}
                      {/* BACK FACE (Foil Texture + Star Emblem)         */}
                      {/* ============================================== */}
                      <div className="pk-face pk-back">
                        <i>
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
                            <div className="w-10 h-10 border border-[#ffd24a]/80 bg-[#1a1240]/80 flex items-center justify-center pixel-corners-sm shadow-[0_0_12px_rgba(255,210,74,0.5)] mb-2">
                              <Sparkles className="w-5 h-5 text-[#ffd24a]" />
                            </div>
                            <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffd24a]">AI PACK</span>
                            <span className="text-[9px] font-mono text-[#b8b0d4] mt-0.5">TAP TO REVEAL</span>
                          </div>
                        </i>
                      </div>

                      {/* ============================================== */}
                      {/* FRONT FACE (Full Pixel-Pack Card Shape & Info) */}
                      {/* ============================================== */}
                      <div className="pk-face pk-front cursor-pointer">
                        <div className="pk-in">
                          {/* 1. Header: Name & Number */}
                          <div className="flex items-center justify-between pb-1 border-b border-[#4a4378] shrink-0">
                            <span className="text-base font-bold font-display text-[#fbf1d4] truncate pr-2">
                              {project.title}
                            </span>
                            <span className="text-xs font-mono font-bold shrink-0" style={{ color: meta.color }}>
                              {project.number}/07
                            </span>
                          </div>

                          {/* 2. Category Subtitle */}
                          <div className="text-[11px] font-mono font-semibold text-[#ff9a3c] truncate shrink-0 -mt-1">
                            {project.category}
                          </div>

                          {/* 3. Pixel-Bordered Art Window (Stretches edge-to-edge up to card border) */}
                          <div className="pk-art relative -mx-[14px] w-[calc(100%+28px)] h-[160px] sm:h-[170px] bg-[#0c0a2a] my-1 shrink-0 overflow-hidden">
                            <img
                              src={project.heroImage}
                              alt={project.title}
                              draggable={false}
                              className="w-full h-full object-cover pointer-events-none select-none"
                            />
                          </div>

                          {/* 4. Useful Information: Description Box (4 full lines) */}
                          <div className="p-2.5 bg-[#0c0a2a]/80 border border-[#4a4378] text-xs font-light leading-relaxed text-[#d8cff5] pixel-corners-sm line-clamp-4 shrink-0 my-1">
                            {project.problemStatement || project.tagline}
                          </div>

                          {/* 5. Decoupled Tech Stack Badges */}
                          <div className="flex flex-wrap gap-1 max-h-[30px] overflow-hidden shrink-0 my-1">
                            {project.technologies.slice(0, 4).map(tech => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 bg-[#272343] text-[#fbf1d4] border border-[#4a4378] text-[10px] font-mono pixel-corners-sm truncate max-w-[125px]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* 6. Footer: Year on left, RARITY in BOTTOM-RIGHT corner */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-[#4a4378] text-[11px] font-mono mt-auto shrink-0">
                            <span className="text-[#b8b0d4] text-[10px]">
                              {project.timeline.split('–')[0].trim() || '2026'}
                            </span>
                            <span
                              className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#0a0719] pixel-corners-sm shadow-sm"
                              style={{ background: meta.color }}
                            >
                              {meta.label}
                            </span>
                          </div>
                        </div>

                        {/* Holographic Diffraction Foil Layer (Active on front card) */}
                        {(isGalleryActive || isCurrentStack) && (
                          <div className="pk-foil" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM STAGE HUD & PROMPT */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#272343]/90 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
        {mode === 'gallery' ? (
          <>
            <div className="flex items-center gap-2">
              {PROJECTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    galleryPosRef.current = idx;
                    setGalleryPos(idx);
                    applyGalleryTransforms(idx);
                    playTone(500, 0.04, 'square', 0.03);
                  }}
                  className={`transition-all duration-300 cursor-pointer pixel-corners-sm ${
                    idx === Math.round(galleryPos)
                      ? 'w-10 h-3 bg-[#ff9a3c] shadow-[0_0_15px_rgba(255,154,60,0.7)]'
                      : 'w-3 h-3 bg-[#4a4378] hover:bg-[#8fc3e8]/60'
                  }`}
                  title={`Jump to ${p.title}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-[#fbf1d4]">
              <span className="font-bold text-[#ff9a3c] font-display">0{Math.round(galleryPos) + 1}</span>
              <span className="text-[#fbf1d4] font-semibold">{activeProject.title}</span>
              <span className="text-[#b8b0d4]">• {activeProject.category}</span>
              <span className="text-xs text-[#ffd24a] font-mono hidden sm:inline">(Click card to open case study)</span>
            </div>
          </>
        ) : (
          <div
            className="w-full text-center text-xs sm:text-sm font-mono tracking-wide text-[#fbf1d4] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: stageMessage }}
          />
        )}
      </div>
    </section>
  );
};

export const MemoizedPixelPackShowcase = memo(PixelPackShowcase);
