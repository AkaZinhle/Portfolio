import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PROJECTS } from '../../data/projects';
import { Project } from '../../types';
import { HoloPeelCard } from '../effects/HoloPeelCard';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InfiniteProjectCarouselProps {
  onSelectProject: (project: Project) => void;
}

export const InfiniteProjectCarousel: React.FC<InfiniteProjectCarouselProps> = ({ onSelectProject }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPeelingActive, setIsPeelingActive] = useState<boolean>(false);

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

  // Drag interaction handlers - Rotates carousel in 3D
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPeelingActive) return;
    setIsDragging(true);
    dragStartRef.current = e.clientX;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPeelingActive || !isDragging) return;
    const deltaX = e.clientX - dragStartRef.current;
    setDragOffset(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Drag threshold to rotate to previous/next project in 3D
    if (dragOffset > 60) {
      setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
    } else if (dragOffset < -60) {
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    }
    setDragOffset(0);
  };

  // Wheel scrubbing
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 35 || Math.abs(e.deltaY) > 50) {
      if (e.deltaX > 35 || e.deltaY > 50) {
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
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden select-none"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-sm px-3.5 py-1.5 bg-[#FC75B4]/15 text-[#FC75B4] border border-[#FC75B4]/40 uppercase tracking-widest font-bold pixel-corners-sm">
              The Engineering Foundry
            </span>
            <div className="h-[2px] w-16 bg-[#FC75B4]/30" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F0E5DB] font-display">
            Infinite Project Showcase
          </h2>

          <p className="text-lg sm:text-xl text-[#c7bcab] leading-relaxed font-light">
            Continuous 3D spatial carousel of all 7 flagship AI engineering systems. Drag or use arrows to rotate the showcase, then <strong className="text-[#FC75B4] font-bold">pull the top-right tab</strong> to peel any holographic card.
          </p>
        </div>

        {/* Carousel Navigation Controls (Manual only - AutoDrift completely removed) */}
        <div className="flex items-center gap-3 p-1.5 bg-[#1d1b15]/90 border-2 border-[#474329] shrink-0 pixel-corners">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects)}
            className="p-3 bg-white/5 hover:bg-[#FC75B4]/20 text-[#F0E5DB] hover:text-[#FC75B4] border border-white/10 hover:border-[#FC75B4]/40 transition-all cursor-pointer pixel-corners-sm"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-[#FC75B4] px-2">
            {activeProject.number} / 0{totalProjects}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % totalProjects)}
            className="p-3 bg-white/5 hover:bg-[#FC75B4]/20 text-[#F0E5DB] hover:text-[#FC75B4] border border-white/10 hover:border-[#FC75B4]/40 transition-all cursor-pointer pixel-corners-sm"
            aria-label="Next Project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D INFINITE CAROUSEL ROTATING STAGE */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[580px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ perspective: '1600px' }}
      >
        {PROJECTS.map((project, idx) => {
          // Relative circular index offset from current active card
          let baseOffset = (idx - currentIndex) % totalProjects;
          if (baseOffset > totalProjects / 2) baseOffset -= totalProjects;
          if (baseOffset < -totalProjects / 2) baseOffset += totalProjects;

          // Drag progress rotates the carousel continuously around cylinder in 3D
          const dragProgress = isDragging ? dragOffset / 320 : 0;
          const continuousOffset = baseOffset + dragProgress;

          // Cylindrical 3D rotation coordinates
          const angleDeg = continuousOffset * 48;
          const angleRad = (angleDeg * Math.PI) / 180;
          const radius = 580; // cylinder radius in pixels

          const xTranslate = Math.round(radius * Math.sin(angleRad));
          const zTranslate = Math.round(radius * (Math.cos(angleRad) - 1));
          const rotateY = -angleDeg;

          const absOffset = Math.abs(continuousOffset);
          const isActive = Math.abs(continuousOffset) < 0.45;

          // Smooth expanding and shrinking entry/exit animations
          let scale = 1;
          let opacity = 1;

          if (absOffset <= 1.8) {
            scale = Math.max(0.78, 1 - absOffset * 0.11);
            opacity = Math.max(0.35, 1 - absOffset * 0.32);
          } else if (absOffset <= 2.6) {
            // Gracefully shrink down to scale 0 and opacity 0 when exiting
            const shrinkProgress = Math.max(0, (2.6 - absOffset) / 0.8);
            scale = (1 - absOffset * 0.11) * shrinkProgress;
            opacity = (1 - absOffset * 0.32) * shrinkProgress;
          } else {
            scale = 0;
            opacity = 0;
          }

          const zIndex = Math.round(100 - absOffset * 20);
          const isInteractable = absOffset <= 2.2;

          return (
            <div
              key={project.id}
              onClick={() => {
                if (!isDragging && Math.abs(baseOffset) > 0.45) {
                  setCurrentIndex(idx);
                }
              }}
              className="absolute will-change-transform"
              style={{
                transform: `translateX(${xTranslate}px) translateZ(${zTranslate}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isInteractable ? 'auto' : 'none',
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease-out',
              }}
            >
              <HoloPeelCard
                project={project}
                isActive={isActive}
                onPeelComplete={onSelectProject}
                onPeelStateChange={setIsPeelingActive}
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
              className={`transition-all duration-300 cursor-pointer pixel-corners-sm ${
                idx === currentIndex
                  ? 'w-10 h-3 bg-[#FC75B4] shadow-[0_0_15px_rgba(252,117,180,0.7)]'
                  : 'w-3 h-3 bg-white/20 hover:bg-[#FC75B4]/50'
              }`}
              title={`Jump to ${p.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-[#c7bcab]">
          <span className="font-bold text-[#FC75B4] font-display">{activeProject.number}</span>
          <span className="text-[#F0E5DB] font-semibold">{activeProject.title}</span>
          <span className="text-[#8e8472]">• {activeProject.category}</span>
        </div>
      </div>
    </section>
  );
};
