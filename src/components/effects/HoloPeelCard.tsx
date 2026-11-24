import React, { useState, useRef, useCallback } from 'react';
import { Project } from '../../types';
import { ThinkingOrb } from './ThinkingOrb';
import { Sparkles, Eye, ArrowUpRight, Github } from 'lucide-react';

interface HoloPeelCardProps {
  project: Project;
  isActive: boolean;
  onPeelComplete: (project: Project) => void;
}

export const HoloPeelCard: React.FC<HoloPeelCardProps> = ({
  project,
  isActive,
  onPeelComplete,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [peelProgress, setPeelProgress] = useState(0); // 0 to 1
  const [isPeeling, setIsPeeling] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPeeling) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((centerY - y) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;
    setTilt({ x: rotX, y: rotY });
  }, [isPeeling]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isPeeling) {
      setTilt({ x: 0, y: 0 });
      setPeelProgress(0);
    }
  };

  // Peel drag handlers
  const handlePeelStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsPeeling(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePeelMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPeeling || !cardRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = cardRef.current.getBoundingClientRect();

    // Calculate peel drag distance from top-right corner
    const dx = dragStartRef.current.x - clientX;
    const dy = clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    const progress = Math.min(1, Math.max(0, dist / (rect.width * 0.75)));
    setPeelProgress(progress);

    if (progress > 0.65) {
      setIsPeeling(false);
      setPeelProgress(1);
      setTimeout(() => {
        onPeelComplete(project);
        setPeelProgress(0);
      }, 250);
    }
  };

  const handlePeelEnd = () => {
    if (!isPeeling) return;
    setIsPeeling(false);
    if (peelProgress > 0.45) {
      setPeelProgress(1);
      setTimeout(() => {
        onPeelComplete(project);
        setPeelProgress(0);
      }, 250);
    } else {
      setPeelProgress(0);
    }
  };

  // Click on peel button directly
  const handleQuickPeel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPeelProgress(1);
    setTimeout(() => {
      onPeelComplete(project);
      setPeelProgress(0);
    }, 300);
  };

  // Holographic diffraction angle
  const holoAngle = (tilt.y * 15 + tilt.x * 10 + 135) % 360;
  const peelPercent = Math.round(peelProgress * 100);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMoveCapture={isPeeling ? handlePeelMove : undefined}
      onTouchMove={isPeeling ? handlePeelMove : undefined}
      onMouseUp={handlePeelEnd}
      onTouchEnd={handlePeelEnd}
      className={`
        relative w-[340px] sm:w-[380px] md:w-[420px] h-[520px] rounded-3xl select-none cursor-grab active:cursor-grabbing
        transition-all duration-300 ease-out will-change-transform
      `}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isActive ? 1.02 : 0.94})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* CARD BACKING / EXPOSED CASE STUDY PREVIEW LAYER */}
      <div className="absolute inset-0 rounded-3xl bg-[#181611] border-2 border-[#FC75B4]/50 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs px-2.5 py-1 rounded bg-[#FC75B4]/20 text-[#FC75B4] font-semibold">
              UNCOVERED SCHEMATIC
            </span>
            <ThinkingOrb state="working" size={22} theme="cyan" />
          </div>
          <h4 className="text-2xl font-bold text-[#F0E5DB] font-display">{project.title}</h4>
          <p className="text-sm text-[#c7bcab] leading-relaxed font-light">{project.problemStatement}</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="text-xs text-[#FC75B4] uppercase font-semibold">Decoupled Tech Stack:</div>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2.5 py-0.5 rounded bg-white/10 text-xs text-[#F0E5DB]">
                {tech}
              </span>
            ))}
          </div>
          <button
            onClick={() => onPeelComplete(project)}
            className="w-full mt-3 py-2.5 rounded-xl bg-[#FC75B4] text-[#12110d] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ffa3d1] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Open Deep-Dive Case Study
          </button>
        </div>
      </div>

      {/* FRONT HOLOGRAPHIC FOIL STICKER LAYER (Curls on peel) */}
      <div
        className="absolute inset-0 rounded-3xl bg-[#1d1b15] border-2 border-white/15 overflow-hidden transition-all duration-200 ease-out flex flex-col justify-between shadow-2xl"
        style={{
          clipPath: peelProgress > 0 
            ? `polygon(0 0, ${100 - peelPercent}% 0, 100% ${peelPercent}%, 100% 100%, 0 100%)`
            : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          boxShadow: isHovered 
            ? '0 16px 48px -8px rgba(252, 117, 180, 0.4), 0 0 0 2px rgba(252, 117, 180, 0.5)' 
            : '0 8px 32px 0 rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Project Image Header with Holo Sheen */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border-b-2 border-white/10">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Identifier & Number Badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12110d]/90 border border-white/15 backdrop-blur-md">
            <span className="text-base font-bold text-[#FC75B4] font-display">{project.number}</span>
            <span className="text-xs text-[#F0E5DB] uppercase tracking-wider">{project.category.split('&')[0]}</span>
          </div>

          {/* PBR Holographic Rainbow Diffraction Sweep */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70 transition-opacity duration-200"
            style={{
              background: `linear-gradient(${holoAngle}deg, 
                rgba(252, 117, 180, 0.3) 0%, 
                rgba(240, 229, 219, 0.25) 25%, 
                rgba(117, 111, 69, 0.3) 50%, 
                rgba(255, 163, 209, 0.3) 75%, 
                rgba(252, 117, 180, 0.3) 100%)`,
            }}
          />
        </div>

        {/* Card Body Info */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-3xl font-bold text-[#F0E5DB] tracking-tight font-display">{project.title}</h3>
            <p className="text-base font-semibold text-[#ffa3d1] leading-snug">{project.subtitle}</p>
            <p className="text-sm text-[#c7bcab] leading-relaxed font-light line-clamp-3">{project.tagline}</p>
          </div>

          {/* Key Concepts Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.keyConcepts.slice(0, 3).map((concept) => (
              <span key={concept} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F0E5DB]">
                {concept}
              </span>
            ))}
          </div>

          {/* Bottom Action Footer with Peel Prompt */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#8e8472] font-mono">{project.timeline}</span>
            <button
              onClick={handleQuickPeel}
              className="px-3 py-1.5 rounded-xl bg-[#FC75B4]/20 text-[#FC75B4] border border-[#FC75B4]/50 text-xs font-bold hover:bg-[#FC75B4]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              PEEL CASE STUDY
            </button>
          </div>
        </div>
      </div>

      {/* 3D PEELED CORNER BACKING LINER (Realistic metallic brushed silver fold) */}
      {peelProgress > 0 && (
        <div
          onMouseDown={handlePeelStart}
          onTouchStart={handlePeelStart}
          className="absolute top-0 right-0 z-30 pointer-events-auto cursor-grabbing"
          style={{
            width: `${peelPercent}%`,
            height: `${peelPercent}%`,
            transformOrigin: 'top right',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 40%, #f1f5f9 70%, #94a3b8 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
            boxShadow: '-6px 6px 18px rgba(0, 0, 0, 0.75)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Adhesive Sheen Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/20" />
        </div>
      )}

      {/* CORNER PEEL TAB INDICATOR (Top-Right) */}
      {peelProgress === 0 && (
        <button
          onClick={handleQuickPeel}
          onMouseDown={handlePeelStart}
          onTouchStart={handlePeelStart}
          title="Drag or click to peel holographic card"
          className="absolute -top-2 -right-2 z-40 p-2.5 rounded-2xl bg-gradient-to-br from-brand-aqua via-brand-sky to-brand-violet text-slate-950 font-bold shadow-[0_0_20px_rgba(45,212,191,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
        </button>
      )}
    </div>
  );
};
