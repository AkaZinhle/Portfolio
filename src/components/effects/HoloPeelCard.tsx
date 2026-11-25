import React, { useState, useRef, useCallback, memo } from 'react';
import { Project } from '../../types';
import { ThinkingOrb } from './ThinkingOrb';
import { Eye } from 'lucide-react';

interface HoloPeelCardProps {
  project: Project;
  isActive: boolean;
  onPeelComplete: (project: Project) => void;
  onPeelStateChange?: (isPeeling: boolean) => void;
}

const HoloPeelCardComponent: React.FC<HoloPeelCardProps> = ({
  project,
  isActive,
  onPeelComplete,
  onPeelStateChange,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [peelProgress, setPeelProgress] = useState(0); // 0 to 1
  const [isPeeling, setIsPeeling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 10% micro-tilt (1.0 degree max) using direct CSS custom properties for 120fps zero-render mousemove
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || isPeeling) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reduced to 10% of previous 10 degrees -> 1.0 degree max micro-tilt
    const rotX = ((centerY - y) / centerY) * 1.0;
    const rotY = ((x - centerX) / centerX) * 1.0;
    const px = Math.round((x / rect.width) * 100);
    const py = Math.round((y / rect.height) * 100);
    const holoAngle = Math.round((rotY * 14 + rotX * 10 + 135) % 360);

    card.style.setProperty('--card-rot-x', `${rotX.toFixed(2)}deg`);
    card.style.setProperty('--card-rot-y', `${rotY.toFixed(2)}deg`);
    card.style.setProperty('--pointer-x', `${px}%`);
    card.style.setProperty('--pointer-y', `${py}%`);
    card.style.setProperty('--holo-angle', `${holoAngle}deg`);
  }, [isPeeling]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isPeeling) {
      const card = cardRef.current;
      if (card) {
        card.style.setProperty('--card-rot-x', '0deg');
        card.style.setProperty('--card-rot-y', '0deg');
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
        card.style.setProperty('--holo-angle', '135deg');
      }
      setPeelProgress(0);
      setIsExpanded(false);
    }
  };

  // Complete peel transition with expanding animation
  const triggerPeelComplete = useCallback(() => {
    setIsPeeling(false);
    onPeelStateChange?.(false);
    setPeelProgress(1);
    setIsExpanded(true);

    // Let user experience the expanding description animation before opening modal
    setTimeout(() => {
      onPeelComplete(project);
      setTimeout(() => {
        setPeelProgress(0);
        setIsExpanded(false);
      }, 300);
    }, 600);
  }, [onPeelComplete, onPeelStateChange, project]);

  // Peel drag handlers (isolated from carousel drag)
  const handlePeelStart = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();
    setIsPeeling(true);
    onPeelStateChange?.(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePeelMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPeeling || !cardRef.current) return;
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = cardRef.current.getBoundingClientRect();

    // Calculate peel drag distance from top-right corner
    const dx = dragStartRef.current.x - clientX;
    const dy = clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    const progress = Math.min(1, Math.max(0, dist / (rect.width * 0.7)));
    setPeelProgress(progress);

    if (progress > 0.6) {
      triggerPeelComplete();
    }
  };

  const handlePeelEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!isPeeling) return;
    if (e) e.stopPropagation();
    setIsPeeling(false);
    onPeelStateChange?.(false);
    if (peelProgress > 0.4) {
      triggerPeelComplete();
    } else {
      setPeelProgress(0);
    }
  };

  // Click on peel pull-tab directly
  const handleQuickPeel = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPeelComplete();
  };

  const peelPercent = Math.round(peelProgress * 100);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMoveCapture={isPeeling ? handlePeelMove : undefined}
      onTouchMove={isPeeling ? handlePeelMove : undefined}
      onMouseUp={isPeeling ? handlePeelEnd : undefined}
      onTouchEnd={isPeeling ? handlePeelEnd : undefined}
      className={`
        relative w-[340px] sm:w-[380px] md:w-[410px] h-[520px] select-none cursor-grab active:cursor-grabbing
        transition-transform duration-300 ease-out will-change-transform pixel-corners-lg
      `}
      style={{
        transform: `perspective(1000px) rotateX(var(--card-rot-x, 0deg)) rotateY(var(--card-rot-y, 0deg)) scale(${isActive ? 1.02 : 0.94})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ======================================================== */}
      {/* 1. CARD BACKING / EXPOSED CASE STUDY PREVIEW LAYER       */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-0 bg-[#1b1830] border-2 border-[#ff9a3c]/70 p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pixel-corners-lg ${
          isExpanded ? 'scale-100 ring-4 ring-[#ff9a3c]/40 shadow-[0_0_50px_rgba(255,154,60,0.5)]' : 'scale-95'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#4a4378]">
            <span className="text-xs px-2.5 py-1 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 font-semibold tracking-wider font-mono pixel-corners-sm">
              UNCOVERED SCHEMATIC
            </span>
            <ThinkingOrb state="working" size={22} theme="amber" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-[#fbf1d4] font-display">{project.title}</h4>
          
          {/* EXPANDING DESCRIPTION ANIMATION (Expands on complete peel) */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden space-y-2.5 ${
              isExpanded
                ? 'max-h-[300px] opacity-100 scale-100 translate-y-0'
                : 'max-h-24 opacity-85 scale-95'
            }`}
          >
            <p className="text-sm text-[#b8b0d4] leading-relaxed font-light">{project.problemStatement}</p>
            <p className="text-xs text-[#fbf1d4] font-mono leading-relaxed bg-[#272343] p-2.5 border border-[#4a4378] pixel-corners-sm">
              <strong className="text-[#ff9a3c]">Architecture Solution:</strong> {project.architecture?.summary || project.problemStatement}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-[#4a4378]">
          <div className="text-xs text-[#ff9a3c] uppercase font-semibold font-mono">Decoupled Tech Stack:</div>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2.5 py-1 bg-[#272343] text-[#fbf1d4] border border-[#4a4378] text-xs font-mono pixel-corners-sm">
                {tech}
              </span>
            ))}
          </div>
          <button
            onClick={() => onPeelComplete(project)}
            className="w-full mt-2 py-2.5 bg-[#ff9a3c] text-[#0c0a2a] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e8741a] transition-all cursor-pointer shadow-lg active:scale-98 pixel-corners-sm"
          >
            <Eye className="w-4 h-4" />
            Open Deep-Dive Case Study
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FRONT HOLOGRAPHIC FOIL STICKER LAYER (Curls on peel)  */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 bg-[#272343] border-2 overflow-hidden transition-all duration-200 ease-out flex flex-col justify-between shadow-2xl pixel-corners-lg"
        style={{
          borderColor: isHovered ? '#ff9a3c' : '#4a4378',
          clipPath: peelProgress > 0 
            ? `polygon(0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0, ${100 - peelPercent}% 0, 100% ${peelPercent}%, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px))`
            : 'polygon(0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px))',
          boxShadow: isHovered 
            ? '0 20px 50px -10px rgba(255, 154, 60, 0.45), 0 0 25px rgba(255, 154, 60, 0.3)' 
            : '0 10px 30px rgba(12, 10, 42, 0.85)',
        }}
      >
        {/* TOP ~74%: FULL PREVIEW IMAGE (Non-draggable so dragging on image rotates carousel) */}
        <div className="relative w-full h-[385px] overflow-hidden bg-[#1b1830] select-none">
          <img
            src={project.heroImage}
            alt={project.title}
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitUserDrag: 'none',
            } as React.CSSProperties}
            loading="lazy"
          />

          {/* Minimalist Top Identifier & Number Badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 bg-[#1b1830]/90 border border-[#4a4378] backdrop-blur-md pixel-corners-sm pointer-events-none select-none">
            <span className="text-sm font-bold text-[#ff9a3c] font-display">{project.number}</span>
            <span className="text-[11px] text-[#fbf1d4] uppercase tracking-wider font-semibold font-mono">{project.category.split('&')[0]}</span>
          </div>
        </div>

        {/* BOTTOM ~26%: ONLY PROJECT NAME & TAGLINE */}
        <div className="h-[135px] w-full bg-[#272343] border-t-2 border-[#4a4378] px-5 py-4 flex flex-col justify-center select-none pointer-events-none">
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#fbf1d4] tracking-tight truncate">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#b8b0d4] font-light leading-snug line-clamp-2 mt-1">
            {project.tagline}
          </p>
        </div>

        {/* ======================================================== */}
        {/* FULL-CARD HOLOGRAPHIC FOIL LAYERS (Rainbow Sheen & Glare) */}
        {/* ======================================================== */}
        {/* Layer 1: PBR Iridescent Rainbow Diffraction Sweep */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.75 : 0.45,
            background: `linear-gradient(var(--holo-angle, 135deg), 
              rgba(255, 154, 60, 0.35) 0%, 
              rgba(216, 255, 122, 0.3) 20%, 
              rgba(143, 195, 232, 0.35) 45%, 
              rgba(251, 241, 212, 0.3) 70%, 
              rgba(255, 111, 111, 0.3) 85%, 
              rgba(255, 154, 60, 0.35) 100%)`,
          }}
        />

        {/* Layer 2: Dynamic Radial Specular Glare following pointer */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200"
          style={{
            opacity: isHovered ? 0.8 : 0.35,
            background: `radial-gradient(circle 300px at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(251, 241, 212, 0.5) 0%, rgba(251, 241, 212, 0.15) 35%, transparent 70%)`,
          }}
        />

        {/* Layer 3: Micro-Prism Refractor Foil Pattern */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(251, 241, 212, 0.18) 0px, rgba(251, 241, 212, 0.18) 2px, transparent 2px, transparent 8px)',
          }}
        />

        {/* Layer 4: Subtle Iridescent Edge Glow */}
        <div
          className="pointer-events-none absolute inset-0 pixel-corners-lg"
          style={{
            border: '1.5px solid rgba(255, 154, 60, 0.45)',
            boxShadow: isHovered ? 'inset 0 0 20px rgba(255, 154, 60, 0.25)' : 'none',
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 3. 3D PEELED CORNER BACKING LINER (Metallic fold)        */}
      {/* ======================================================== */}
      {peelProgress > 0 && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          className="absolute top-0 right-0 z-30 pointer-events-auto cursor-grabbing"
          style={{
            width: `${peelPercent}%`,
            height: `${peelPercent}%`,
            transformOrigin: 'top right',
            background: 'linear-gradient(135deg, #4a4378 0%, #272343 40%, #1b1830 70%, #0c0a2a 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
            boxShadow: '-6px 6px 18px rgba(12, 10, 42, 0.9)',
            borderLeft: '1px solid rgba(251, 241, 212, 0.6)',
            borderBottom: '1px solid rgba(251, 241, 212, 0.6)',
          }}
        >
          {/* Adhesive Sheen Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/40" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CORNER PEEL LIP / PULL-TAB INDICATOR (Top-Right)      */}
      {/* ======================================================== */}
      {peelProgress === 0 && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handlePeelStart(e);
          }}
          onClick={handleQuickPeel}
          title="Drag or click pull-tab to peel holographic card"
          className="absolute -top-1 -right-1 z-40 group/tab cursor-grab active:cursor-grabbing select-none"
        >
          {/* Peeling folded dog-ear corner effect */}
          <div className="relative w-14 h-14 flex items-start justify-end">
            {/* Folded triangular corner shadow */}
            <div
              className="absolute top-0 right-0 w-11 h-11 transition-transform duration-300 group-hover/tab:scale-110"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                background: 'linear-gradient(135deg, #4a4378 0%, #272343 50%, #0c0a2a 100%)',
                boxShadow: '-4px 4px 10px rgba(12, 10, 42, 0.8)',
                borderLeft: '1px solid rgba(251, 241, 212, 0.7)',
                borderBottom: '1px solid rgba(251, 241, 212, 0.7)',
              }}
            />
            {/* Protruding pull-tab ribbon badge */}
            <div className="absolute top-1 right-1 px-2.5 py-0.5 rounded-bl-lg rounded-tr-md bg-gradient-to-br from-[#ff9a3c] via-[#e8741a] to-[#ff6f6f] text-[#0c0a2a] font-bold text-[10px] font-mono tracking-wider shadow-[0_0_15px_rgba(255,154,60,0.85)] border border-white/50 flex items-center gap-1 group-hover/tab:-translate-x-0.5 group-hover/tab:translate-y-0.5 transition-transform">
              <span className="tracking-tighter opacity-70">///</span>
              <span>PULL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HoloPeelCard = memo(HoloPeelCardComponent);
