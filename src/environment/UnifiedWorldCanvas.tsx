import React, { useEffect, useRef } from 'react';
import { globalAnchorManager } from './world/DOMAnchors';
import { globalWorldCoordinator } from './world/WorldCoordinator';
import { ExplorerActor } from './actors/Explorer';
import { DogActor } from './actors/Dog';
import { GitKoiActor } from './actors/GitKoi';
import { globalCityInhabitants } from './actors/CityInhabitants';
import { globalWildlifeManager } from './actors/Wildlife';
import { PixelFXEngine } from './fx/PixelFXEngine';
import { globalWorldZoneRenderer } from './scenes/WorldZones';
import { globalCityArchitecture } from './scenes/CityArchitecture';

interface UnifiedWorldCanvasProps {
  enabled?: boolean;
  intensity?: number;
  onKoiClick?: () => void;
  onExplorerClick?: () => void;
}

export const UnifiedWorldCanvas: React.FC<UnifiedWorldCanvasProps> = ({
  enabled = true,
  intensity = 1,
  onKoiClick,
  onExplorerClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fxEngine = new PixelFXEngine();
    const explorer = new ExplorerActor(width * 0.82, 220);
    const dog = new DogActor(width * 0.82 - 28, 224);
    const koi = new GitKoiActor(width * 0.7, height * 0.45);

    // Initial background dust and glyph particles
    const dustParticles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string; char?: string }[] = [];
    const glyphs = ['·', '✧', '◇', '✦', '+', '°', '~', 'x'];

    for (let i = 0; i < Math.floor(45 * intensity); i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.2,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.6 ? '#FC75B4' : Math.random() > 0.3 ? '#c9be83' : '#F0E5DB',
        char: Math.random() > 0.8 ? glyphs[Math.floor(Math.random() * glyphs.length)] : undefined,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      globalAnchorManager.updateAll();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleClick = (e: MouseEvent) => {
      fxEngine.spawnRipple(e.clientX, e.clientY);
      fxEngine.spawnSparks(e.clientX, e.clientY, 7);
    };
    window.addEventListener('click', handleClick);

    const handleScroll = () => {
      globalAnchorManager.updateAll();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const anchors = globalAnchorManager.getAnchors();
      const currentZone = globalWorldCoordinator.getActiveZone();

      // --- LAYER 0: DISTANT CYBER CITY SKYLINE & STARS ---
      globalCityArchitecture.drawSkyline(ctx, width, time);

      // Star Constellations
      ctx.strokeStyle = 'rgba(252, 117, 180, 0.08)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < dustParticles.length; i++) {
        const p1 = dustParticles[i];
        for (let j = i + 1; j < dustParticles.length; j++) {
          const p2 = dustParticles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw Dust Particles
      for (const p of dustParticles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulse = 0.6 + 0.4 * Math.sin(time * 0.002 + p.x);
        ctx.globalAlpha = p.alpha * pulse;
        if (p.char) {
          ctx.font = '10px "ByteBounce", monospace';
          ctx.fillStyle = p.color;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        }
        ctx.globalAlpha = 1;
      }

      // --- LAYER 1: WATER RESERVOIR, GIT KOI & WILDLIFE ---
      koi.update(dt, width, height, mouseRef.current.x, mouseRef.current.y, (rx, ry) => {
        fxEngine.spawnRipple(rx, ry);
      });
      koi.draw(ctx);

      globalWildlifeManager.update(dt, width, height, anchors);
      globalWildlifeManager.draw(ctx, time);

      // --- LAYER 2: CITY ROOFTOP ARCHITECTURE, LADDERS & LANTERNS ON CARDS ---
      globalCityArchitecture.drawCardInfrastructure(ctx, anchors, time);

      // Zone specific background scenery
      if (currentZone === 'highlands') {
        globalWorldZoneRenderer.drawHighlands(ctx, time, anchors, width, height);
      } else if (currentZone === 'workshop') {
        globalWorldZoneRenderer.drawWorkshop(ctx, time, anchors, width, height);
      } else if (currentZone === 'wilderness') {
        globalWorldZoneRenderer.drawWilderness(ctx, time, anchors, width, height);
        // Periodic campfire ember emission
        if (Math.random() < 0.15) {
          const contactAnchor = anchors.find(a => a.id === 'contact-campfire' || a.id === 'contact');
          const fireX = contactAnchor && contactAnchor.active ? contactAnchor.x + 35 : width * 0.2;
          const fireY = contactAnchor && contactAnchor.active ? contactAnchor.y + contactAnchor.height - 30 : height * 0.85;
          fxEngine.spawnCampfireEmber(fireX, fireY);
        }
      }

      // --- LAYER 3: LIVING INHABITANTS & CITIZENS ---
      // Update & Draw City Citizens (Welder, Courier, Mage, Fisherman, Cat, Ninja)
      globalCityInhabitants.update(dt, anchors, fxEngine);
      globalCityInhabitants.draw(ctx, time);

      // Update & Draw Explorer & Companion Dog
      explorer.update(dt, anchors, mouseRef.current.x, mouseRef.current.y);
      explorer.draw(ctx, time);

      dog.update(dt, explorer.x, explorer.y, explorer.facing);
      dog.draw(ctx, time);

      // --- LAYER 4: PIXELFX SIMULATIONS (Sparks, Ripples, Embers) ---
      fxEngine.update(dt);
      fxEngine.draw(ctx, time);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      fxEngine.clear();
    };
  }, [enabled, intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
