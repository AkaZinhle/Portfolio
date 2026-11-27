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
  const [isPeelingActive, setIsPeelingActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartRef = useRef<number>(0);
  const dragOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
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

  // Compute 3D cylinder layout properties for card at index
  const computeCardLayout = (idx: number, currIdx: number, dragPx: number) => {
    let baseOffset = (idx - currIdx) % totalProjects;
    if (baseOffset > totalProjects / 2) baseOffset -= totalProjects;
    if (baseOffset < -totalProjects / 2) baseOffset += totalProjects;

    const dragProgress = dragPx / 320;
    const continuousOffset = baseOffset + dragProgress;

    const angleDeg = continuousOffset * 48;
    const angleRad = (angleDeg * Math.PI) / 180;
    const radius = 580; // cylinder radius in pixels

    const xTranslate = Math.round(radius * Math.sin(angleRad));
    const zTranslate = Math.round(radius * (Math.cos(angleRad) - 1));
    const rotateY = -angleDeg;

    const absOffset = Math.abs(continuousOffset);

    // Smooth expanding and shrinking entry/exit animations
    let scale = 1;
    let opacity = 1;

    if (absOffset <= 1.8) {
      scale = Math.max(0.78, 1 - absOffset * 0.11);
      opacity = Math.max(0.35, 1 - absOffset * 0.32);
    } else if (absOffset <= 2.6) {
      const shrinkProgress = Math.max(0, (2.6 - absOffset) / 0.8);
      scale = (1 - absOffset * 0.11) * shrinkProgress;
      opacity = (1 - absOffset * 0.32) * shrinkProgress;
    } else {
      scale = 0;
      opacity = 0;
    }

    const zIndex = Math.round(100 - absOffset * 20);
    const isInteractable = absOffset <= 2.2;
    const isVisible = absOffset <= 2.55;

    return {
      transform: `translateX(${xTranslate}px) translateZ(${zTranslate}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: isInteractable ? ('auto' as const) : ('none' as const),
      display: isVisible ? 'block' : 'none',
    };
  };

  // Direct DOM style application on RAF during drag for zero-render 120 FPS
  const applyDragTransforms = (offset: number) => {
    PROJECTS.forEach((_, idx) => {
      const el = cardNodesRef.current[idx];
      if (!el) return;
      const layout = computeCardLayout(idx, currentIndex, offset);
      el.style.transform = layout.transform;
      el.style.opacity = `${layout.opacity}`;
      el.style.zIndex = `${layout.zIndex}`;
      el.style.pointerEvents = layout.pointerEvents;
      el.style.display = layout.display;
    });
  };

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPeelingActive) return;
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
    dragOffsetRef.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    // Disable CSS transition during direct drag manipulation
    cardNodesRef.current.forEach((el) => {
      if (el) el.style.transition = 'none';
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPeelingActive || !isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current;
    dragOffsetRef.current = deltaX;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        applyDragTransforms(dragOffsetRef.current);
        rafIdRef.current = null;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    isDraggingRef.current = false;
    const finalOffset = dragOffsetRef.current;
    dragOffsetRef.current = 0;

    // Restore smooth CSS transitions
    cardNodesRef.current.forEach((el) => {
      if (el) el.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease-out';
    });

    if (finalOffset > 60) {
      setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
    } else if (finalOffset < -60) {
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    } else {
      applyDragTransforms(0);
    }
  };

  const activeProject = PROJECTS[currentIndex];

  return (
    <section
      id="projects"
      data-rm-ignore
      ref={containerRef}
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden select-none"
    >
      {/* Section Header */}
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
            Drag or use arrows to rotate the showcase, then <strong className="text-[#ff9a3c] font-bold">pull the top-right tab</strong> to peel any holographic card.
          </p>
        </div>

        {/* Carousel Navigation Controls (Manual only - AutoDrift completely removed) */}
        <div className="flex items-center gap-3 p-2 bg-[#272343]/90 border-2 border-[#4a4378] backdrop-blur-md shrink-0 pixel-corners shadow-xl">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects)}
            className="p-3 bg-[#1b1830] hover:bg-[#352f5a] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/50 transition-all cursor-pointer pixel-corners-sm"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-[#ff9a3c] px-2">
            {activeProject.number} / 0{totalProjects}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % totalProjects)}
            className="p-3 bg-[#1b1830] hover:bg-[#352f5a] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/50 transition-all cursor-pointer pixel-corners-sm"
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
          const layout = computeCardLayout(idx, currentIndex, 0);
          const isActive = idx === currentIndex;

          return (
            <div
              key={project.id}
              ref={(el) => {
                cardNodesRef.current[idx] = el;
              }}
              onClick={() => {
                if (!isDraggingRef.current && idx !== currentIndex) {
                  setCurrentIndex(idx);
                }
              }}
              className="absolute will-change-transform"
              style={{
                transform: layout.transform,
                opacity: layout.opacity,
                zIndex: layout.zIndex,
                pointerEvents: layout.pointerEvents,
                display: layout.display,
                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease-out',
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#272343]/90 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
        <div className="flex items-center gap-2">
          {PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 cursor-pointer pixel-corners-sm ${
                idx === currentIndex
                  ? 'w-10 h-3 bg-[#ff9a3c] shadow-[0_0_15px_rgba(255,154,60,0.7)]'
                  : 'w-3 h-3 bg-[#4a4378] hover:bg-[#8fc3e8]/60'
              }`}
              title={`Jump to ${p.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-[#fbf1d4]">
          <span className="font-bold text-[#ff9a3c] font-display">{activeProject.number}</span>
          <span className="text-[#fbf1d4] font-semibold">{activeProject.title}</span>
          <span className="text-[#b8b0d4]">• {activeProject.category}</span>
        </div>
      </div>
    </section>
  );
};
