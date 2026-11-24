import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PROJECTS } from '../../data/projects';
import { Project } from '../../types';
import { HoloPeelCard } from '../effects/HoloPeelCard';
import { SakugaButton } from '../effects/SakugaButton';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Eye, 
  Play, 
  Pause,
  Compass
} from 'lucide-react';

interface InfiniteProjectCarouselProps {
  onSelectProject: (project: Project) => void;
}

export const InfiniteProjectCarousel: React.FC<InfiniteProjectCarouselProps> = ({ onSelectProject }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<number>(0);
  const totalProjects = PROJECTS.length;

  // DOM Anchor registration for living environment (e.g. city rooftop architecture)
  useEffect(() => {
    if (containerRef.current) {
      globalAnchorManager.registerElement(
        'project-carousel-depot',
        containerRef.current,
        'building',
        'Engineering Carousel Workshop'
      );
    }
    return () => {
      globalAnchorManager.unregisterElement('project-carousel-depot');
    };
  }, []);

  // Auto-drift loop
  useEffect(() => {
    if (!autoPlay || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, isDragging, totalProjects]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % totalProjects);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalProjects]);

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current;
    setDragOffset(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 75) {
      setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
    } else if (dragOffset < -75) {
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    }
    setDragOffset(0);
  };

  // Wheel scrubbing
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 25 || Math.abs(e.deltaY) > 40) {
      if (e.deltaX > 25 || e.deltaY > 40) {
        setCurrentIndex((prev) => (prev + 1) % totalProjects);
      } else {
        setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
      }
    }
  }, [totalProjects]);

  const activeProject = PROJECTS[currentIndex];

  return (
    <section
      id="projects"
      ref={containerRef}
      onWheel={handleWheel}
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-sm px-3.5 py-1.5 rounded-xl bg-brand-aqua/15 text-brand-aqua border border-brand-aqua/40 uppercase tracking-widest font-bold">
              The Engineering Foundry
            </span>
            <div className="h-[2px] w-16 bg-brand-aqua/30" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Infinite Project Showcase
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
            Continuous 3D spatial carousel of all 7 flagship AI engineering systems. Drag or navigate to cycle cards, then <strong className="text-brand-aqua font-bold">peel any holographic sticker</strong> to open the full technical case study.
          </p>
        </div>

        {/* Carousel Action & AutoPlay Controls */}
        <div className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 shrink-0">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              autoPlay
                ? 'bg-brand-aqua/20 text-brand-aqua border border-brand-aqua/40 shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto Orbit"
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>Auto Drift</span>
          </button>

          <div className="h-5 w-[1px] bg-white/10" />

          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % totalProjects)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Next Project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D INFINITE CAROUSEL STAGE */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[580px] flex items-center justify-center overflow-visible touch-pan-y"
        style={{ perspective: '1400px' }}
      >
        {PROJECTS.map((project, idx) => {
          // Calculate relative circular offset from current active card
          let offset = idx - currentIndex;
          if (offset > totalProjects / 2) offset -= totalProjects;
          if (offset < -totalProjects / 2) offset += totalProjects;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          const xTranslate = offset * 340 + (isDragging ? dragOffset * 0.6 : 0);
          const zTranslate = -Math.abs(offset) * 160;
          const rotateY = offset * -18;
          const scale = Math.max(0.78, 1 - Math.abs(offset) * 0.12);
          const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.35);
          const zIndex = 100 - Math.abs(offset) * 10;

          return (
            <div
              key={project.id}
              onClick={() => {
                if (!isActive) setCurrentIndex(idx);
              }}
              className="absolute transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translateX(${xTranslate}px) translateZ(${zTranslate}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            >
              <HoloPeelCard
                project={project}
                isActive={isActive}
                onPeelComplete={onSelectProject}
              />
            </div>
          );
        })}
      </div>

      {/* BOTTOM THUMBNAIL TRACKER & QUICK JUMP PILLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          {PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-200 cursor-pointer ${
                idx === currentIndex
                  ? 'w-10 h-3 rounded-full bg-brand-aqua shadow-[0_0_12px_rgba(45,212,191,0.5)]'
                  : 'w-3 h-3 rounded-full bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to ${p.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="font-bold text-brand-aqua font-display">{activeProject.number}</span>
          <span className="text-white font-semibold">{activeProject.title}</span>
          <span className="text-slate-400">• {activeProject.category}</span>
        </div>
      </div>
    </section>
  );
};
