import React, { useState, useEffect, useRef } from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { Award, Briefcase, GraduationCap, Sparkles, Layers, Cpu, Database, Code2 } from 'lucide-react';

export type BookTab = 'skills' | 'experience' | 'education';

interface RetroWindowsCardProps {
  title: string;
  items: string[];
}

export const RetroWindowsCard: React.FC<RetroWindowsCardProps> = ({ title, items }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 104;
    const H = 114;
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);

    const px = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
    const rect = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

    const C_BASE = '#C1DAEC';
    const C_LIGHT = '#ECEBE4';
    const C_SHADOW = '#7A9FC6';
    const C_NAVY = '#162E6E';
    const C_STEEL = '#46699C';
    const C_TRACK = '#80A3C9';
    const C_WHITE = '#FFFFFF';

    function bevelBox(x: number, y: number, w: number, h: number) {
      rect(x, y, w, h, C_BASE);
      rect(x, y, w - 1, 1, C_LIGHT);
      rect(x, y, 1, h - 1, C_LIGHT);
      rect(x + w - 1, y, 1, h, C_SHADOW);
      rect(x, y + h - 1, w, 1, C_SHADOW);
    }

    // 1. Outer Window Bevel (0..W-1 x 0..H-1)
    rect(1, 1, W - 2, H - 2, C_BASE);
    rect(0, 0, W - 1, 1, C_LIGHT);
    rect(0, 0, 1, H - 1, C_LIGHT);
    rect(W - 1, 0, 1, H, C_SHADOW);
    rect(0, H - 1, W, 1, C_SHADOW);

    // 2. Top-Right Window Control Buttons (7x7 at y=3..9)
    // Maximize / Restore (x=W-32..W-26)
    bevelBox(W - 32, 3, 7, 7);
    rect(W - 30, 5, 3, 3, C_NAVY);
    px(W - 29, 6, C_BASE);

    // Minimize (x=W-22..W-16)
    bevelBox(W - 22, 3, 7, 7);
    rect(W - 20, 6, 3, 1, C_NAVY);

    // Close X (x=W-12..W-6)
    bevelBox(W - 12, 3, 7, 7);
    px(W - 10, 5, C_NAVY); px(W - 8, 5, C_NAVY);
    px(W - 9, 6, C_NAVY);
    px(W - 10, 7, C_NAVY); px(W - 8, 7, C_NAVY);

    // 3. Recessed Content & Scrollbar Outer Frame (x=4..W-5, y=12..H-5)
    rect(4, 12, W - 9, 1, C_SHADOW);
    rect(4, 13, W - 16, 1, C_STEEL);
    px(4, 14, C_STEEL);
    rect(4, 15, 1, H - 20, C_SHADOW);
    rect(W - 5, 12, 1, H - 16, C_STEEL);
    rect(4, H - 5, W - 8, 1, C_SHADOW);

    // White content viewport (x=5..W-13, y=14..H-6)
    rect(5, 14, W - 17, H - 19, C_WHITE);

    // 4. Vertical Scrollbar on Right Side (x=W-12..W-6, y=13..H-6)
    rect(W - 12, 13, 7, H - 18, C_TRACK);

    // Top Scroll Up Button (x=W-12..W-6, y=13..19)
    bevelBox(W - 12, 13, 7, 7);
    rect(W - 12, 19, 7, 1, C_STEEL);
    px(W - 9, 15, C_NAVY);
    px(W - 10, 16, C_NAVY);
    px(W - 8, 16, C_NAVY);

    // Scrollbar Thumb (x=W-12..W-6, y=20..thumbBottom, 7xthumbH)
    const thumbH = Math.max(14, Math.round((H - 34) * 0.32));
    bevelBox(W - 12, 20, 7, thumbH);
    rect(W - 12, 20 + thumbH, 7, 1, C_STEEL);

    // Bottom Scroll Down Button (x=W-12..W-6, y=H-12..H-6)
    bevelBox(W - 12, H - 12, 7, 7);
    px(W - 10, H - 10, C_NAVY);
    px(W - 8, H - 10, C_NAVY);
    px(W - 9, H - 9, C_NAVY);
  }, []);

  return (
    <div className="relative w-full aspect-[104/114] overflow-hidden select-none shadow-sm">
      <canvas
        ref={canvasRef}
        width={104}
        height={114}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Title bar text */}
      <div
        className="absolute pointer-events-none font-mono font-bold text-[#162E6E] truncate select-none leading-none tracking-tight"
        style={{
          top: '3.5%',
          left: '5%',
          width: '63%',
          fontSize: 'clamp(8px, 1.1vw, 11px)',
        }}
      >
        {title}
      </div>

      {/* Recessed white content viewport */}
      <div
        className="absolute pointer-events-auto flex flex-col justify-evenly font-mono font-bold text-[#162E6E] overflow-hidden"
        style={{
          top: '13%',
          left: '6%',
          width: '78%',
          height: '81%',
          padding: '2px 3px',
          fontSize: 'clamp(8px, 1.15vw, 11px)',
          lineHeight: '1.25',
        }}
      >
        {items.map((it, idx) => (
          <p key={idx} className="m-0 truncate" title={it}>
            • {it}
          </p>
        ))}
      </div>
    </div>
  );
};

export const SkillBook: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookTab>('skills');
  const [hoveredSlot, setHoveredSlot] = useState<{ name: string; level: string; desc: string } | null>(null);

  const bookCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const skillsTabCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const expTabCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eduTabCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 30 Inventory Skills for the 5x6 Grid
  const inventorySlots = [
    // Row 1
    { name: 'Python', icon: '/assets/images/PythonLogo.png', level: 'Expert (7 Yrs)', desc: 'FastAPI, PyTorch, OpenCV, Mistral fine-tuning' },
    { name: 'JavaScript', icon: '/assets/images/JSLogo.png', level: 'Expert (6 Yrs)', desc: 'ESNext, Canvas 2D/WebGL, reactive web applications' },
    { name: 'HTML5', icon: '/assets/images/HTMLLogo.png', level: 'Expert (7 Yrs)', desc: 'Semantic structure, Canvas, Audio, Web APIs' },
    { name: 'CSS3', icon: '/assets/images/CSSLogo.png', level: 'Expert (7 Yrs)', desc: 'Tailwind CSS, 3D Transforms, PBR Holo Shaders' },
    { name: 'TypeScript', placeholder: 'TS', level: 'Expert (4 Yrs)', desc: 'Type-safe React 19, strict contracts & schemas' },
    // Row 2
    { name: 'C++', placeholder: 'C++', level: 'Advanced (3 Yrs)', desc: 'Systems programming, DSA, memory optimization' },
    { name: 'Java', placeholder: 'JV', level: 'Advanced (4 Yrs)', desc: 'Oracle Certified, OOP architectures, GotGame instruction' },
    { name: 'C#', placeholder: 'C#', level: 'Proficient (2 Yrs)', desc: 'Object-oriented programming, data structures' },
    { name: 'FastAPI', placeholder: 'FA', level: 'Expert', desc: 'Asynchronous REST APIs, SSE streaming, Pydantic v2' },
    { name: 'Flask', placeholder: 'FL', level: 'Expert', desc: 'Thread-safe REST services & OpenCV video streaming' },
    // Row 3
    { name: 'PyTorch', placeholder: 'PT', level: 'Advanced', desc: 'Deep learning models, CUDA training & optimization' },
    { name: 'TensorFlow', placeholder: 'TF', level: 'Advanced', desc: 'Sequential Keras CNN models & GTSRB evaluation' },
    { name: 'YOLOv8', placeholder: 'Y8', level: 'Expert', desc: 'Sub-millimeter PCB defect detection, OpenCV pipelines' },
    { name: 'YOLOv3', placeholder: 'Y3', level: 'Advanced', desc: 'Darknet edge video feed detection & NMS filtering' },
    { name: 'OpenCV', placeholder: 'CV', level: 'Expert', desc: 'Real-time frame filters, RTSP processing, image arrays' },
    // Row 4
    { name: 'MCP Protocol', placeholder: 'MCP', level: 'Expert', desc: 'Model Context Protocol schema-aware DB tools' },
    { name: 'Google AP2', placeholder: 'AP2', level: 'Advanced', desc: 'Agent Payments Protocol verifiable purchase mandates' },
    { name: 'Dify.ai', placeholder: 'DF', level: 'Expert', desc: 'ReAct agent orchestration, vector RAG pipelines' },
    { name: 'Agentic RAG', placeholder: 'RAG', level: 'Expert', desc: 'Decoupled retrieval & policy document synthesis' },
    { name: 'SSE Streaming', placeholder: 'SSE', level: 'Expert', desc: 'Server-Sent Events streaming client with retry backoff' },
    // Row 5
    { name: 'MongoDB', placeholder: 'MDB', level: 'Advanced', desc: 'Atlas clusters, JSON schema validation, audit logs' },
    { name: 'SQLite', placeholder: 'SQL', level: 'Expert', desc: 'Thread-safe concurrent inspection session logging' },
    { name: 'Docker', placeholder: 'DK', level: 'Advanced', desc: 'Containerized ML inference, microservice architecture' },
    { name: 'AWS Cloud', placeholder: 'AWS', level: 'Certified', desc: 'AWS Certified Cloud Practitioner, EC2, S3, IAM' },
    { name: 'Custom Hardware', placeholder: 'HW', level: '5 Builds', desc: 'High-performance AI workstation rigs & thermals' },
    // Row 6
    { name: 'Mistral 7B', placeholder: 'M7B', level: 'Advanced', desc: 'Local parameter-efficient LLM fine-tuning via QLoRA' },
    { name: 'Unsloth AI', placeholder: 'UN', level: 'Advanced', desc: 'Fast Mistral 7B 4-bit QLoRA fine-tuning' },
    { name: 'Next.js 16', placeholder: 'N16', level: 'Expert', desc: 'React 19, server components, command center UI' },
    { name: 'React 19', placeholder: 'R19', level: 'Expert', desc: 'Modern reactive state, optimistic updates, canvas UI' },
    { name: 'Git & GitHub', placeholder: 'GIT', level: 'Expert', desc: 'CI/CD workflows, open source, telemetry hooks' },
  ];

  // 1. Draw Open Book Pixel Art Canvas (160x100) exactly per user spec
  useEffect(() => {
    const canvas = bookCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 160, 100);

    const px = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
    const rect = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

    // 1. Organic rounded leather cover (Warm Dark Earthy Palette)
    rect(5, 14, 150, 83, '#50406C');
    rect(4, 15, 152, 81, '#50406C');
    rect(3, 17, 154, 77, '#50406C');
    rect(6, 14, 148, 1, '#69578A');
    rect(5, 96, 150, 1, '#3E3056');
    rect(73, 96, 14, 2, '#50406C');
    rect(74, 98, 12, 1, '#3E3056');

    // 2. Arched parchment pages with layered page-stack contours
    const halfWidth = 74;
    for (let i = 0; i < halfWidth; i++) {
      const t = i / (halfWidth - 1);
      const topArch = Math.round(Math.sin(Math.pow(t, 0.85) * Math.PI) * 3.2);
      const topY = 13 - topArch;
      const bottomCurve = t < 0.06 ? 1 : (t > 0.88 ? Math.round(((t - 0.88) / 0.12) * 2) : 0);
      const bottomY = 93 + bottomCurve;
      const leftX = 6 + i;
      const rightX = 153 - i;

      for (let y = topY; y <= bottomY; y++) {
        const c = y === topY ? '#FAE1A8' : (y === bottomY ? '#DFB368' : '#F3D08B');
        px(leftX, y, c);
        px(rightX, y, c);
      }
      px(leftX, bottomY + 1, '#C89448');
      px(rightX, bottomY + 1, '#C89448');
      if (i >= 1 && i <= halfWidth - 3) {
        px(leftX, bottomY + 2, '#DFB368');
        px(rightX, bottomY + 2, '#DFB368');
      }
    }
    for (let y = 15; y <= 93; y++) {
      px(5, y, '#C89448'); px(6, y, '#DFB368');
      px(153, y, '#DFB368'); px(154, y, '#C89448');
    }

    // 3. Straight, centered vertical spine (x = 79..80)
    rect(75, 13, 2, 83, '#DFB268');
    rect(77, 13, 2, 83, '#C89448');
    rect(79, 13, 2, 83, '#F7DC9B');
    rect(81, 13, 2, 83, '#C89448');
    rect(83, 13, 2, 83, '#DFB268');
    rect(78, 13, 4, 1, '#C89448');
    rect(79, 13, 2, 1, '#F7DC9B');

    // 4. Centered 5x6 left inventory slots (x: 10..71, y: 16..90) for skills tab
    if (activeTab === 'skills') {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const x = 10 + c * 13;
          const y = 16 + r * 13;
          rect(x, y, 10, 10, '#C89448');
          rect(x + 1, y + 1, 8, 8, '#DFB268');
          px(x, y, '#F3D08B');
          px(x + 9, y, '#F3D08B');
          px(x, y + 9, '#F3D08B');
          px(x + 9, y + 9, '#F3D08B');
        }
      }
    } else {
      // Clean parchment divider lines for Experience & Education
      rect(10, 26, 60, 1, '#C89448');
      rect(89, 26, 60, 1, '#C89448');
    }
  }, [activeTab]);

  // 2. Draw Bookmark Tab Sprites (34x68)
  useEffect(() => {
    // Skills Tab
    const sCanvas = skillsTabCanvasRef.current;
    if (sCanvas) {
      const sCtx = sCanvas.getContext('2d');
      if (sCtx) {
        sCtx.imageSmoothingEnabled = false;
        sCtx.clearRect(0, 0, 34, 68);
        const px = (x: number, y: number, c: string) => { sCtx.fillStyle = c; sCtx.fillRect(x, y, 1, 1); };
        const rect = (x: number, y: number, w: number, h: number, c: string) => { sCtx.fillStyle = c; sCtx.fillRect(x, y, w, h); };
        const MAIN = '#C47D22', HIGHLIGHT = '#D99336', INK = '#A66316';

        rect(2, 0, 30, 1, HIGHLIGHT); rect(1, 1, 32, 1, HIGHLIGHT); rect(0, 2, 34, 66, MAIN);
        rect(0, 2, 1, 66, HIGHLIGHT); rect(33, 2, 1, 66, HIGHLIGHT);
        px(1, 1, INK); px(32, 1, INK);

        const scroll = [
          '###########....', '############...', '##..########...', '##...#######...',
          '.....##..###...', '.....#######...', '.....##..###...', '.....#######...',
          '.....##..###...', '.....#######...', '.....##########', '.....##########',
          '......########.', '.......######..'
        ];
        scroll.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(9 + c, 5 + r, INK); }));
        const label = [
          '.###..#.......#..#........', '#.....#..#...##.##...###..',
          '.###..#.#.....#..#..#.....', '....#.###..#..#..#...###..', '####..#..#.#..#..#..####..'
        ];
        label.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(4 + c, 24 + r, INK); }));
      }
    }

    // Experience Tab
    const eCanvas = expTabCanvasRef.current;
    if (eCanvas) {
      const eCtx = eCanvas.getContext('2d');
      if (eCtx) {
        eCtx.imageSmoothingEnabled = false;
        eCtx.clearRect(0, 0, 34, 68);
        const px = (x: number, y: number, c: string) => { eCtx.fillStyle = c; eCtx.fillRect(x, y, 1, 1); };
        const rect = (x: number, y: number, w: number, h: number, c: string) => { eCtx.fillStyle = c; eCtx.fillRect(x, y, w, h); };
        const MAIN = '#C47D22', HIGHLIGHT = '#D99336', INK = '#A66316';

        rect(2, 0, 30, 1, HIGHLIGHT); rect(1, 1, 32, 1, HIGHLIGHT); rect(0, 2, 34, 66, MAIN);
        rect(0, 2, 1, 66, HIGHLIGHT); rect(33, 2, 1, 66, HIGHLIGHT);
        px(1, 1, INK); px(32, 1, INK);

        const briefcase = [
          '.....######.....', '....########....', '....##....##....', '.##############.',
          '################', '################', '######....######', '######.##.######',
          '......####......', '################', '################', '################', '################'
        ];
        briefcase.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(9 + c, 5 + r, INK); }));
        const word = [
          ['###', '#..', '##.', '#..', '###'], ['#.#', '.#.', '#.#', '.#.', '#.#'],
          ['##.', '#.#', '##.', '#..', '#..'], ['##.', '###', '#..', '###', '###'],
          ['##.', '#.#', '#..', '#..', '#..'], ['#', '.', '#', '#', '#'],
          ['##.', '###', '#..', '###', '###'], ['##.', '#.#', '#.#', '#.#', '#.#'],
          ['##.', '#..', '#..', '#..', '##.'], ['##.', '###', '#..', '###', '###']
        ];
        let cx = 2;
        word.forEach((glyph, gi) => {
          glyph.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(cx + c, 24 + r, INK); }));
          cx += glyph[0].length + (gi === 4 || gi === 5 ? 0 : 1);
        });
      }
    }

    // Education Tab
    const edCanvas = eduTabCanvasRef.current;
    if (edCanvas) {
      const edCtx = edCanvas.getContext('2d');
      if (edCtx) {
        edCtx.imageSmoothingEnabled = false;
        edCtx.clearRect(0, 0, 34, 68);
        const px = (x: number, y: number, c: string) => { edCtx.fillStyle = c; edCtx.fillRect(x, y, 1, 1); };
        const rect = (x: number, y: number, w: number, h: number, c: string) => { edCtx.fillStyle = c; edCtx.fillRect(x, y, w, h); };
        const MAIN = '#C67D22', TOP_HI = '#E09636', RIGHT_HI = '#D88D2E', OUTLINE = '#A86416', INK = '#915210';

        rect(1, 0, 32, 1, TOP_HI); rect(0, 1, 34, 1, TOP_HI); rect(0, 2, 34, 66, MAIN);
        rect(0, 2, 1, 66, OUTLINE); rect(33, 2, 1, 66, RIGHT_HI);
        px(1, 0, OUTLINE); px(32, 0, OUTLINE);

        const mortarboard = [
          '..........##..........', '........######........', '......##########......',
          '....##############....', '..##################..', '######################',
          '..##################..', '....###.######.###....', '....##..######..##....',
          '....#...######...#....', '...#....######........', '...#.....####.........',
          '..##..................', '..##..................', '.#..#.................'
        ];
        mortarboard.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(6 + c, 5 + r, INK); }));
        rect(8, 17, 2, 2, INK);
        const word = [
          ['###', '#..', '##.', '#..', '###'], ['..#', '..#', '###', '#.#', '###'],
          ['#.#', '#.#', '#.#', '#.#', '###'], ['###', '#..', '#..', '#..', '###'],
          ['.##', '..#', '###', '#.#', '###'], ['.#.', '###', '.#.', '.#.', '.##'],
          ['#', '.', '#', '#', '#'], ['###', '#.#', '#.#', '#.#', '###'], ['##.', '#.#', '#.#', '#.#', '#.#']
        ];
        let cx = 2;
        word.forEach((glyph, gi) => {
          glyph.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') px(cx + c, 24 + r, INK); }));
          cx += glyph[0].length + (gi === 4 || gi === 5 ? 0 : 1);
        });
      }
    }
  }, []);

  return (
    <section id="capabilities" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl p-5 sm:p-6 bg-[#272343]/88 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
        <div className="flex items-center gap-2.5">
          <span className="text-sm px-3.5 py-1.5 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 uppercase tracking-widest font-bold pixel-corners-sm">
            The Living Codex
          </span>
          <div className="h-[2px] w-16 bg-[#ff9a3c]/40" />
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fbf1d4] font-display">
          Skills, Experience & Education
        </h2>

        <p className="text-lg sm:text-xl text-[#fbf1d4] leading-relaxed font-light">
          Click the bookmark tags to change sections
        </p>
      </div>

      {/* THE BOOK & SLIDING BOOKMARK TABS WRAPPER */}
      <div className="relative isolate max-w-5xl mx-auto pt-6">
        
        {/* SLIDING BOOKMARK TABS (Lowered slightly with half slide-up height delta) */}
        <div className="absolute -top-4 sm:-top-6 left-8 sm:left-16 flex items-end gap-3 sm:gap-6 z-10 pointer-events-auto">
          
          {/* TAB 1: SKILLS */}
          <button
            onClick={() => setActiveTab('skills')}
            className={`
              relative h-[75px] sm:h-[85px] overflow-visible transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group focus:outline-none pointer-events-auto
              ${activeTab === 'skills' ? 'translate-y-1 sm:translate-y-2 shadow-[0_0_20px_rgba(255,154,60,0.6)]' : 'translate-y-8 sm:translate-y-10 hover:translate-y-5 opacity-90 hover:opacity-100'}
            `}
            title="Skills Inventory Tab"
          >
            <canvas
              ref={skillsTabCanvasRef}
              width={34}
              height={68}
              className="w-14 sm:w-16 h-auto image-pixelated block"
              style={{ imageRendering: 'pixelated' }}
            />
            {activeTab === 'skills' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ff9a3c] shadow-[0_0_8px_#ff9a3c]" />
            )}
          </button>

          {/* TAB 2: EXPERIENCE */}
          <button
            onClick={() => setActiveTab('experience')}
            className={`
              relative h-[75px] sm:h-[85px] overflow-visible transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group focus:outline-none pointer-events-auto
              ${activeTab === 'experience' ? 'translate-y-1 sm:translate-y-2 shadow-[0_0_20px_rgba(255,154,60,0.6)]' : 'translate-y-8 sm:translate-y-10 hover:translate-y-5 opacity-90 hover:opacity-100'}
            `}
            title="Work Experience Tab"
          >
            <canvas
              ref={expTabCanvasRef}
              width={34}
              height={68}
              className="w-14 sm:w-16 h-auto image-pixelated block"
              style={{ imageRendering: 'pixelated' }}
            />
            {activeTab === 'experience' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ff9a3c] shadow-[0_0_8px_#ff9a3c]" />
            )}
          </button>

          {/* TAB 3: EDUCATION */}
          <button
            onClick={() => setActiveTab('education')}
            className={`
              relative h-[75px] sm:h-[85px] overflow-visible transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group focus:outline-none pointer-events-auto
              ${activeTab === 'education' ? 'translate-y-1 sm:translate-y-2 shadow-[0_0_20px_rgba(255,154,60,0.6)]' : 'translate-y-8 sm:translate-y-10 hover:translate-y-5 opacity-90 hover:opacity-100'}
            `}
            title="Education & Certifications Tab"
          >
            <canvas
              ref={eduTabCanvasRef}
              width={34}
              height={68}
              className="w-14 sm:w-16 h-auto image-pixelated block"
              style={{ imageRendering: 'pixelated' }}
            />
            {activeTab === 'education' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ff9a3c] shadow-[0_0_8px_#ff9a3c]" />
            )}
          </button>

        </div>

        {/* MAIN OPEN BOOK CANVAS CONTAINER */}
        <div className="relative z-20 w-full overflow-visible shadow-2xl pointer-events-none">
          <canvas
            ref={bookCanvasRef}
            width={160}
            height={100}
            className="w-full h-auto block image-pixelated select-none pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* INTERACTIVE PAGE CONTENT (Inked directly on the parchment) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            
            {/* ========================================================= */}
            {/* TAB 1: SKILLS OVERLAY (Left 5x6 Grid, Right 4 Windows)    */}
            {/* ========================================================= */}
            {activeTab === 'skills' && (
              <div className="w-full h-full relative pointer-events-none">
                
                {/* Left Page: Full 5x6 (30 Slots) Interactive Grid Mathematically Aligned to Canvas Slots */}
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: '6.25%',
                    top: '16%',
                    width: '38.75%',
                    height: '75%',
                  }}
                >
                  <div className="relative w-full h-full">
                    {inventorySlots.map((slot, idx) => {
                      const r = Math.floor(idx / 5);
                      const c = idx % 5;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredSlot(slot)}
                          onMouseLeave={() => setHoveredSlot(null)}
                          style={{
                            position: 'absolute',
                            left: `${(c * 13 / 62) * 100}%`,
                            top: `${(r * 13 / 75) * 100}%`,
                            width: `${(10 / 62) * 100}%`,
                            height: `${(10 / 75) * 100}%`,
                          }}
                          className="group rounded-none bg-[#272343]/60 hover:bg-[#ff9a3c]/30 border border-[#4a4378]/60 hover:border-[#ff9a3c] transition-all flex items-center justify-center cursor-pointer p-0.5 sm:p-1 shadow-sm"
                        >
                          {slot.icon ? (
                            <img
                              src={slot.icon}
                              alt={slot.name}
                              className="w-4 h-4 sm:w-6 sm:h-6 object-contain group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <span className="text-[9px] sm:text-xs font-bold text-[#fbf1d4] group-hover:text-[#ff9a3c] transition-colors font-display select-none">
                              {slot.placeholder}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tooltip bar beneath grid */}
                  <div className="absolute top-[101.5%] left-0 right-0 text-center text-[10px] sm:text-xs text-[#1b1830] font-bold truncate select-none px-1">
                    {hoveredSlot ? (
                      <span><strong className="text-[#ff9a3c]">{hoveredSlot.name}:</strong> <span className="text-[#1b1830] font-normal">{hoveredSlot.desc} ({hoveredSlot.level})</span></span>
                    ) : (
                      <span className="text-[#4a4378] italic">Hover over any slot to inspect skill capabilities</span>
                    )}
                  </div>
                </div>

                {/* Right Page: 4 Separate Retro Windows-Style Subsystems */}
                <div
                  className="absolute pointer-events-auto pr-1 sm:pr-2 pt-1 sm:pt-2 space-y-1.5 sm:space-y-2"
                  style={{
                    left: '54.5%',
                    top: '16%',
                    width: '39%',
                    height: '75%',
                  }}
                >
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 h-full content-start">
                    <RetroWindowsCard
                      title="AI_VISION.EXE"
                      items={[
                        'YOLOv8 Sub-mm AOI',
                        'Ollama Vision (Llava)',
                        'Mistral 7B QLoRA',
                        'PyTorch & OpenCV',
                        'CNN GTSRB (43 Cls)',
                      ]}
                    />
                    <RetroWindowsCard
                      title="AGENT_PROTO.EXE"
                      items={[
                        'Model Context (MCP)',
                        'Google AP2 Mandates',
                        'ReAct Multi-Tool (5-Iter)',
                        'Decoupled Agentic RAG',
                        'Typed SSE Streaming',
                      ]}
                    />
                    <RetroWindowsCard
                      title="BACKEND.EXE"
                      items={[
                        'FastAPI & Flask APIs',
                        'Next.js 16 & React 19',
                        'TypeScript & ESNext',
                        'C++, Java, C# Core',
                        'Tailwind CSS & Canvas',
                      ]}
                    />
                    <RetroWindowsCard
                      title="DATA_INFRA.EXE"
                      items={[
                        'MongoDB Atlas Schema',
                        'Thread-Safe SQLite',
                        'AWS Cloud Pract.',
                        '5 AI PC Builds',
                        'OpenPyXL & ReportLab',
                      ]}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: WORK EXPERIENCE (Directly inked on parchment)      */}
            {/* ========================================================= */}
            {activeTab === 'experience' && (
              <div className="absolute inset-x-0 bottom-0 top-[16%] flex flex-col lg:flex-row justify-between gap-8 pointer-events-auto px-4 sm:px-8 lg:px-12 pb-4 text-[#2b271d]">
                
                {/* Left Page: Asrix BHD */}
                <div className="w-full lg:w-[46%] h-full flex flex-col justify-start pt-1 pl-1 space-y-2">
                  <div className="space-y-0.5 pb-1 border-b-2 border-[#C89448]">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#C89448] text-[#FAF2DE] font-bold uppercase tracking-wider">
                      Industry Placement
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#3b3628]">
                      Asrix BHD
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#756f45]">AI Engineering WBL • Sept 2025 – June 2026</p>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm text-[#474329] leading-relaxed font-semibold">
                    <p>• Engineered sequential computer vision detection pipelines using YOLO architectures for real-time video feeds.</p>
                    <p>• Fine-tuned open-source local LLM (Mistral 7B) on custom HuggingFace datasets for structured telemetry extraction.</p>
                    <p>• Partnered with engineering teams to bridge model inference loops with high-availability production APIs.</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-[#C89448]">
                    {['YOLOv8', 'Mistral 7B', 'Unsloth', 'OpenCV', 'FastAPI'].map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#DFB368]/50 text-xs font-bold text-[#3b3628] pixel-corners-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Page: GotGame */}
                <div className="w-full lg:w-[46%] h-full flex flex-col justify-start pt-1 pr-1 space-y-2">
                  <div className="space-y-0.5 pb-1 border-b-2 border-[#C89448]">
                    <span className="text-[11px] px-2 py-0.5 bg-[#C89448] text-[#FAF2DE] font-bold uppercase tracking-wider pixel-corners-sm">
                      Teaching & Instruction
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#3b3628]">
                      GotGame / WeCode (Nokia)
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#756f45]">Assistant Coding Teacher • 2019</p>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm text-[#474329] leading-relaxed font-semibold">
                    <p>• Translated complex engineering logic, data structures, and algorithms into accessible workshop modules.</p>
                    <p>• Conducted live debugging and refactored student implementations across Java and Python.</p>
                    <p>• Mentored attendees in clean code architecture and test-driven development.</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#C89448]">
                    {['Java', 'Python', 'Data Structures', 'OOP', 'Live Debugging'].map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#DFB368]/50 text-xs font-bold text-[#3b3628] pixel-corners-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: EDUCATION (Directly inked on parchment)            */}
            {/* ========================================================= */}
            {activeTab === 'education' && (
              <div className="absolute inset-x-0 bottom-0 top-[16%] flex flex-col lg:flex-row justify-between gap-8 pointer-events-auto px-4 sm:px-8 lg:px-12 pb-4 text-[#2b271d]">
                
                {/* Left Page: Degree & Honors */}
                <div className="w-full lg:w-[46%] h-full flex flex-col justify-start pt-1 pl-1 space-y-2">
                  <div className="space-y-0.5 pb-1 border-b-2 border-[#C89448]">
                    <span className="text-[11px] px-2 py-0.5 bg-[#C89448] text-[#FAF2DE] font-bold uppercase tracking-wider pixel-corners-sm">
                      Dual Award Degree
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#3b3628]">
                      Taylor's & UWE Bristol
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#756f45]">
                      BSc (Hons) Computer Science — AI Specialisation (Sept 2023 – June 2026)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#3b3628]">
                    <div className="p-2 bg-[#DFB368]/40 border border-[#C89448] pixel-corners-sm">
                      <div className="text-[10px] text-[#756f45]">Standing</div>
                      <div className="text-xl font-bold text-[#3b3628]">CGPA 3.49</div>
                    </div>
                    <div className="p-2 bg-[#DFB368]/40 border border-[#C89448] pixel-corners-sm">
                      <div className="text-[10px] text-[#756f45]">Honours</div>
                      <div className="text-xs sm:text-sm font-bold text-[#3b3628]">Dean's List 2025</div>
                    </div>
                  </div>

                  <div className="p-2 bg-[#DFB368]/40 border border-[#C89448] text-xs text-[#3b3628] pixel-corners-sm">
                    <strong>Leadership:</strong> Founding Treasurer, African Society (Oct 2024 – Ongoing)
                  </div>
                </div>

                {/* Right Page: Certifications */}
                <div className="w-full lg:w-[46%] h-full flex flex-col justify-start pt-1 pr-1 space-y-1.5">
                  <div className="pb-1 border-b-2 border-[#C89448]">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#3b3628] font-display">
                      Certified Credentials & Diplomas
                    </h3>
                  </div>

                  <ul className="space-y-1 text-xs text-[#3b3628] font-semibold">
                    <li className="p-1.5 bg-[#DFB368]/40 border border-[#C89448] flex items-center justify-between pixel-corners-sm">
                      <div>
                        <div className="font-bold text-[#3b3628]">CS50 Introduction to AI with Python</div>
                        <div className="text-[10px] text-[#756f45]">Harvard University / edX (2024)</div>
                      </div>
                      <Award className="w-4 h-4 text-[#756f45]" />
                    </li>
                    <li className="p-1.5 bg-[#DFB368]/40 border border-[#C89448] flex items-center justify-between pixel-corners-sm">
                      <div>
                        <div className="font-bold text-[#3b3628]">AWS Certified Cloud Practitioner</div>
                        <div className="text-[10px] text-[#756f45]">Amazon Web Services (2024)</div>
                      </div>
                      <Award className="w-4 h-4 text-[#756f45]" />
                    </li>
                    <li className="p-1.5 bg-[#DFB368]/40 border border-[#C89448] flex items-center justify-between pixel-corners-sm">
                      <div>
                        <div className="font-bold text-[#3b3628]">Oracle Java Foundations Certified</div>
                        <div className="text-[10px] text-[#756f45]">Oracle Corporation (2023)</div>
                      </div>
                      <Award className="w-4 h-4 text-[#756f45]" />
                    </li>
                    <li className="p-1.5 bg-[#DFB368]/40 border border-[#C89448] flex items-center justify-between pixel-corners-sm">
                      <div>
                        <div className="font-bold text-[#3b3628]">Salesforce Certified Trailblazer</div>
                        <div className="text-[10px] text-[#756f45]">Salesforce (2023)</div>
                      </div>
                      <Award className="w-4 h-4 text-[#756f45]" />
                    </li>
                  </ul>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
