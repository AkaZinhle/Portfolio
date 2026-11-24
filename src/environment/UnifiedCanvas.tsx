import React, { useEffect, useRef, useState } from 'react';

interface UnifiedCanvasProps {
  enabled?: boolean;
  intensity?: number; // 0.1 to 1.0
  onKoiClick?: () => void;
  onExplorerClick?: () => void;
}

// Calculate astronomical moon phase (0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter)
function getMoonPhase(): { phase: number; name: string; symbol: string } {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    const y = year - 1;
    const m = month + 12;
    c = 365.25 * y;
    e = 30.6 * m;
    jd = c + e + day - 694039.09;
  } else {
    c = 365.25 * year;
    e = 30.6 * (month + 1);
    jd = c + e + day - 694039.09;
  }
  b = jd / 29.5305882;
  b -= Math.floor(b);
  const phase = b;

  if (phase < 0.03 || phase > 0.97) return { phase, name: 'New Moon', symbol: '🌑' };
  if (phase < 0.22) return { phase, name: 'Waxing Crescent', symbol: '🌒' };
  if (phase < 0.28) return { phase, name: 'First Quarter', symbol: '🌓' };
  if (phase < 0.47) return { phase, name: 'Waxing Gibbous', symbol: '🌔' };
  if (phase < 0.53) return { phase, name: 'Full Moon', symbol: '🌕' };
  if (phase < 0.72) return { phase, name: 'Waning Gibbous', symbol: '🌖' };
  if (phase < 0.78) return { phase, name: 'Last Quarter', symbol: '🌗' };
  return { phase, name: 'Waning Crescent', symbol: '🌘' };
}

// PixelFX particle definition
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'dust' | 'glyph' | 'firefly' | 'ripple' | 'petal' | 'spark';
  char?: string;
  radius?: number;
}

export const UnifiedCanvas: React.FC<UnifiedCanvasProps> = ({
  enabled = true,
  intensity = 1,
  onKoiClick,
  onExplorerClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [moonInfo, setMoonInfo] = useState(getMoonPhase());
  const mouseRef = useRef<{ x: number; y: number; isHoveringKoi: boolean }>({
    x: -1000,
    y: -1000,
    isHoveringKoi: false,
  });

  useEffect(() => {
    setMoonInfo(getMoonPhase());
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particles system
    const particles: Particle[] = [];
    const glyphs = ['·', '✧', '◇', '✦', '+', '°', '~', 'x'];

    // Spawn initial dust & glyphs
    const dustCount = Math.floor(45 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.25,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.5 + 0.1,
        maxAlpha: Math.random() * 0.4 + 0.2,
        life: Math.random() * 500 + 300,
        maxLife: 800,
        color: Math.random() > 0.6 ? '#2dd4bf' : Math.random() > 0.3 ? '#a855f7' : '#94a3b8',
        type: Math.random() > 0.85 ? 'glyph' : 'dust',
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
      });
    }

    // Spawn fireflies
    const fireflyCount = Math.floor(8 * intensity);
    for (let i = 0; i < fireflyCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 2.2,
        alpha: 0.1,
        maxAlpha: 0.8,
        life: Math.random() * 300 + 200,
        maxLife: 500,
        color: '#fbbf24',
        type: 'firefly',
      });
    }

    // Koi fish state
    const koi = {
      x: width * 0.75,
      y: height * 0.4,
      targetX: width * 0.65,
      targetY: height * 0.45,
      angle: 0,
      speed: 1.1,
      turnSpeed: 0.04,
      bodyColor: '#38bdf8',
      bellyColor: '#f8fafc',
      finColor: 'rgba(56, 189, 248, 0.45)',
      tailPhase: 0,
      length: 32,
      width: 10,
      swimTime: 0,
    };

    // Explorer character state
    const explorer = {
      x: Math.min(width * 0.82, width - 120),
      y: Math.min(height * 0.26, 260),
      targetX: Math.min(width * 0.82, width - 120),
      facing: -1, // -1 left, 1 right
      state: 'idle', // 'idle' | 'walk' | 'look' | 'jump'
      animFrame: 0,
      actionTimer: 0,
      blinkTimer: 0,
    };

    // Dog companion state
    const dog = {
      x: explorer.x - 28,
      y: explorer.y + 4,
      facing: -1,
      tailWag: 0,
      state: 'sit',
      actionTimer: 0,
    };

    // Click handler to create ripples / sparks
    const handleClick = (e: MouseEvent) => {
      // Add water ripple
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: 0,
        vy: 0,
        size: 1,
        radius: 2,
        alpha: 0.7,
        maxAlpha: 0.7,
        life: 0,
        maxLife: 45,
        color: '#2dd4bf',
        type: 'ripple',
      });

      // Add sparks
      for (let s = 0; s < 6; s++) {
        const ang = (s / 6) * Math.PI * 2 + Math.random() * 0.5;
        const spd = Math.random() * 2 + 1;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 2 + 1,
          alpha: 0.9,
          maxAlpha: 0.9,
          life: 0,
          maxLife: 30,
          color: Math.random() > 0.5 ? '#38bdf8' : '#a855f7',
          type: 'spark',
        });
      }
    };
    window.addEventListener('click', handleClick);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // --- LAYER 0: ATMOSPHERIC STARS & CONSTELLATIONS ---
      // Draw sparse constellation lines between close dust particles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== 'dust') continue;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== 'dust') continue;
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === 'ripple') {
          if (p.radius !== undefined) {
            p.radius += 1.8;
            p.alpha = Math.max(0, p.maxAlpha * (1 - p.life / p.maxLife));
            ctx.strokeStyle = `rgba(45, 212, 191, ${p.alpha * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Double secondary ring
            if (p.radius > 8) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha * 0.3})`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 0.65, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        } else if (p.type === 'spark') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.alpha = Math.max(0, p.maxAlpha * (1 - p.life / p.maxLife));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
          ctx.globalAlpha = 1;
        } else if (p.type === 'firefly') {
          p.x += p.vx + Math.sin(time * 0.002 + i) * 0.3;
          p.y += p.vy + Math.cos(time * 0.002 + i) * 0.3;
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + i * 2);
          p.alpha = p.maxAlpha * pulse;

          // Glow halo
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
          glowGrad.addColorStop(0, `rgba(251, 191, 36, ${p.alpha * 0.4})`);
          glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
        } else {
          // Dust & Glyphs
          p.x += p.vx;
          p.y += p.vy;

          // Wrap screen
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const twinkle = 0.6 + 0.4 * Math.sin(time * 0.002 + i);
          const curAlpha = p.alpha * twinkle;

          if (p.type === 'glyph' && p.char) {
            ctx.font = '10px "ByteBounce", monospace';
            ctx.fillStyle = p.color;
            ctx.globalAlpha = curAlpha * 0.6;
            ctx.fillText(p.char, p.x, p.y);
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = curAlpha;
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            ctx.globalAlpha = 1;
          }
        }

        if (p.life >= p.maxLife && (p.type === 'ripple' || p.type === 'spark')) {
          particles.splice(i, 1);
        }
      }

      // --- LAYER 1: GIT KOI (DEVELOPMENT ACTIVITY FISH) ---
      koi.swimTime += dt;
      koi.tailPhase += dt * 8;

      // Koi waypoint navigation
      const distToTarget = Math.hypot(koi.targetX - koi.x, koi.targetY - koi.y);
      if (distToTarget < 30 || Math.random() < 0.005) {
        // Pick new random waypoint in safe zone
        koi.targetX = width * 0.2 + Math.random() * (width * 0.6);
        koi.targetY = height * 0.2 + Math.random() * (height * 0.6);
      }

      // Mouse evasion / attraction
      const distToMouse = Math.hypot(mouseRef.current.x - koi.x, mouseRef.current.y - koi.y);
      let desiredAngle = Math.atan2(koi.targetY - koi.y, koi.targetX - koi.x);

      if (distToMouse < 140) {
        // Gently steer away from cursor
        desiredAngle = Math.atan2(koi.y - mouseRef.current.y, koi.x - mouseRef.current.x);
        koi.speed = 2.4; // spurt of speed
      } else {
        koi.speed = 1.2;
      }

      // Smooth angle interpolation
      let angleDiff = desiredAngle - koi.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      koi.angle += angleDiff * koi.turnSpeed;

      // Advance koi
      koi.x += Math.cos(koi.angle) * koi.speed;
      koi.y += Math.sin(koi.angle) * koi.speed;

      // Draw Koi
      ctx.save();
      ctx.translate(koi.x, koi.y);
      ctx.rotate(koi.angle);

      // Ripple trails
      if (Math.random() < 0.15) {
        particles.push({
          x: koi.x - Math.cos(koi.angle) * 16,
          y: koi.y - Math.sin(koi.angle) * 16,
          vx: -Math.cos(koi.angle) * 0.2,
          vy: -Math.sin(koi.angle) * 0.2,
          size: 1,
          radius: 1,
          alpha: 0.35,
          maxAlpha: 0.35,
          life: 0,
          maxLife: 35,
          color: '#38bdf8',
          type: 'ripple',
        });
      }

      // Side fins
      const finFlap = Math.sin(koi.tailPhase * 0.7) * 0.35;
      ctx.fillStyle = koi.finColor;
      ctx.beginPath();
      ctx.ellipse(-2, -9, 8, 3, -0.4 + finFlap, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-2, 9, 8, 3, 0.4 - finFlap, 0, Math.PI * 2);
      ctx.fill();

      // Main Torpedo Body
      const bodyGrad = ctx.createLinearGradient(12, 0, -18, 0);
      bodyGrad.addColorStop(0, '#38bdf8');
      bodyGrad.addColorStop(0.4, '#0284c7');
      bodyGrad.addColorStop(0.8, '#0369a1');
      bodyGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal markings (pixel pattern)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(3, 0, 7, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Black accent scale
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(-2, -2, 4, 4);

      // Tail with oscillating sine wave
      const tailAngle = Math.sin(koi.tailPhase) * 0.45;
      ctx.save();
      ctx.translate(-14, 0);
      ctx.rotate(tailAngle);

      // Tail fin
      ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, -7);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-12, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Head eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -4, 2, 2);
      ctx.fillRect(8, 2, 2, 2);

      ctx.restore();

      // --- LAYER 2: PROCEDURAL PIXEL EXPLORER & COMPANION DOG ---
      // Update explorer action timers
      explorer.actionTimer += dt;
      explorer.blinkTimer += dt;

      // Character looks towards cursor
      const exDx = mouseRef.current.x - explorer.x;
      if (Math.abs(exDx) > 30) {
        explorer.facing = exDx > 0 ? 1 : -1;
      }

      // Draw Floating Habitat Platform
      const platX = explorer.x - 30;
      const platY = explorer.y + 24;
      const platW = 75;
      const platH = 14;

      // Platform top grass/cyber ledge
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(platX, platY, platW, platH);
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(platX, platY, platW, 2); // Neon border trim

      // Small glowing rune light on platform
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(platX + 6, platY + 4, 3, 3);
      ctx.fillRect(platX + platW - 9, platY + 4, 3, 3);

      // Draw Explorer (24x36 Pixel Art procedural rendering)
      ctx.save();
      ctx.translate(explorer.x, explorer.y);
      if (explorer.facing === 1) {
        ctx.scale(-1, 1);
      }

      const isBlinking = explorer.blinkTimer % 4.5 < 0.15;
      const breathe = Math.sin(time * 0.003) * 1;

      // Cloak / Body
      ctx.fillStyle = '#0f172a'; // dark coat
      ctx.fillRect(-6, 2 + breathe, 12, 14);

      // Scarf (Vibrant cyan/teal)
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(-7, 0 + breathe, 14, 4);
      // Scarf tail waving
      const scarfWave = Math.sin(time * 0.004) * 2;
      ctx.fillRect(5, 2 + breathe, 5, 6 + scarfWave);

      // Head / Hood
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-5, -12 + breathe, 10, 11);
      ctx.fillStyle = '#0f172a'; // Hood shadow
      ctx.fillRect(-4, -11 + breathe, 8, 9);

      // Face skin
      ctx.fillStyle = '#f3c49d';
      ctx.fillRect(-3, -8 + breathe, 6, 6);

      // Eyes tracking mouse
      ctx.fillStyle = '#0f172a';
      if (!isBlinking) {
        ctx.fillRect(-2, -6 + breathe, 2, 2);
        ctx.fillRect(1, -6 + breathe, 2, 2);
      } else {
        ctx.fillRect(-2, -5 + breathe, 5, 1); // blink line
      }

      // Boots
      ctx.fillStyle = '#475569';
      ctx.fillRect(-5, 16, 4, 6);
      ctx.fillRect(1, 16, 4, 6);

      ctx.restore();

      // Draw Dog Companion
      ctx.save();
      ctx.translate(dog.x, dog.y);
      if (explorer.facing === 1) {
        ctx.scale(-1, 1);
      }

      const dogBreathe = Math.sin(time * 0.004 + 1) * 0.5;
      const tailWag = Math.sin(time * 0.012) * 3;

      // Dog body (warm amber / golden)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-7, 10 + dogBreathe, 14, 8);

      // Dog Head
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(3, 4 + dogBreathe, 8, 8);
      // Snout
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(7, 8 + dogBreathe, 5, 4);
      // Nose
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(11, 8 + dogBreathe, 2, 2);
      // Ear
      ctx.fillStyle = '#b45309';
      ctx.fillRect(3, 2 + dogBreathe, 3, 4);
      // Eye
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(7, 6 + dogBreathe, 2, 2);

      // Legs
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-5, 18, 3, 4);
      ctx.fillRect(4, 18, 3, 4);

      // Tail
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-10, 8 + tailWag, 4, 3);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [enabled, intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
