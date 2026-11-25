import React, { useEffect, useRef } from 'react';
import { ThinkingOrbState } from '../../types';

interface ThinkingOrbProps {
  state?: ThinkingOrbState;
  size?: number;
  className?: string;
  speed?: number;
  paused?: boolean;
  theme?: 'dark' | 'light' | 'cyan' | 'violet' | 'amber';
  'aria-label'?: string;
}

const STATE_LABELS: Record<ThinkingOrbState, string> = {
  working: 'Agent Working: Processing parameters…',
  searching: 'Agent Searching: Scanning vector database & web…',
  solving: 'Agent Solving: Multi-step ReAct reasoning…',
  listening: 'Agent Listening: Streaming telemetry & input…',
  connecting: 'Agent Connecting: Schema-aware tool discovery…',
  weaving: 'Agent Weaving: Synthesizing policy & evidence…',
  composing: 'Agent Composing: Generating structured outputs…',
  breathing: 'Agent Thinking: Deep model inference…',
  shaping: 'Agent Shaping: Sub-millimeter visual localization…'
};

export const ThinkingOrb: React.FC<ThinkingOrbProps> = ({
  state = 'working',
  size = 48,
  className = '',
  speed = 1,
  paused = false,
  theme = 'cyan',
  'aria-label': ariaLabel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    const drawOrb = (tSec: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = (size / 2) * 0.85;

      // Color scheme aligned to Pixel Valley palette
      let baseHue = 28; // Ember (#ff9a3c)
      let accentHue = 205; // Pond (#8fc3e8)
      if (theme === 'violet') {
        baseHue = 250; // Border violet (#4a4378)
        accentHue = 28;
      } else if (theme === 'amber') {
        baseHue = 28; // Ember
        accentHue = 78; // Firefly (#d8ff7a)
      } else if (theme === 'cyan') {
        baseHue = 205; // Pond (#8fc3e8)
        accentHue = 28; // Ember
      } else if (theme === 'light') {
        baseHue = 45; // Warm Cream (#fbf1d4)
        accentHue = 28;
      }

      ctx.save();

      if (state === 'working') {
        // Tilted orbit rings + moving particles
        const orbits = 3;
        const ptsPerOrbit = 32;
        for (let o = 0; o < orbits; o++) {
          const tilt = (o * Math.PI) / orbits + tSec * 0.2 * speed;
          const rx = r * 0.9;
          const ry = r * 0.35;

          // Orbit path
          for (let i = 0; i < ptsPerOrbit; i++) {
            const angle = (i / ptsPerOrbit) * Math.PI * 2;
            const px = cx + Math.cos(angle) * rx * Math.cos(tilt) - Math.sin(angle) * ry * Math.sin(tilt);
            const py = cy + Math.cos(angle) * rx * Math.sin(tilt) + Math.sin(angle) * ry * Math.cos(tilt);
            const z = Math.sin(angle) * ry;
            const alpha = 0.25 + 0.35 * (z / ry + 1) * 0.5;

            ctx.fillStyle = `hsla(${baseHue}, 85%, 65%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }

          // Active particle
          const activeAngle = tSec * (1.2 + o * 0.4) * speed;
          const ax = cx + Math.cos(activeAngle) * rx * Math.cos(tilt) - Math.sin(activeAngle) * ry * Math.sin(tilt);
          const ay = cy + Math.cos(activeAngle) * rx * Math.sin(tilt) + Math.sin(activeAngle) * ry * Math.cos(tilt);

          ctx.fillStyle = `hsla(${accentHue}, 100%, 75%, 0.95)`;
          ctx.beginPath();
          ctx.arc(ax, ay, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Glow around particle
          ctx.fillStyle = `hsla(${accentHue}, 100%, 75%, 0.25)`;
          ctx.beginPath();
          ctx.arc(ax, ay, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center core
        ctx.fillStyle = `hsla(${baseHue}, 90%, 60%, 0.6)`;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5 + Math.sin(tSec * 3) * 0.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (state === 'searching') {
        // Globe with sweeping scan meridian line
        const latCount = 5;
        const lonCount = 8;
        const rot = tSec * 0.6 * speed;

        for (let lat = 1; lat <= latCount; lat++) {
          const latAngle = (lat / (latCount + 1)) * Math.PI - Math.PI / 2;
          const latR = r * Math.cos(latAngle);
          const latY = cy + r * Math.sin(latAngle) * 0.9;
          const count = Math.max(4, Math.floor(latR / 2));

          for (let i = 0; i < count; i++) {
            const lonAngle = (i / count) * Math.PI * 2 + rot;
            const px = cx + latR * Math.cos(lonAngle);
            const z = Math.sin(lonAngle);
            if (z > -0.2) {
              const alpha = (z + 0.2) * 0.7;
              ctx.fillStyle = `hsla(${baseHue}, 80%, 65%, ${alpha})`;
              ctx.beginPath();
              ctx.arc(px, latY, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Radar sweep arm
        const scanAngle = tSec * 2 * speed;
        const sx = cx + Math.cos(scanAngle) * r;
        const sy = cy + Math.sin(scanAngle) * r;
        const grad = ctx.createLinearGradient(cx, cy, sx, sy);
        grad.addColorStop(0, `hsla(${accentHue}, 100%, 70%, 0.8)`);
        grad.addColorStop(1, `hsla(${baseHue}, 100%, 50%, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.stroke();

      } else if (state === 'solving') {
        // Rotating concentric rings with clicking alignment notches
        const rings = 3;
        for (let ring = 0; ring < rings; ring++) {
          const rr = r * (0.35 + ring * 0.28);
          const dir = ring % 2 === 0 ? 1 : -1;
          const angle = tSec * (0.8 + ring * 0.3) * dir * speed;
          const dots = 8 + ring * 6;

          for (let i = 0; i < dots; i++) {
            const a = (i / dots) * Math.PI * 2 + angle;
            const px = cx + Math.cos(a) * rr;
            const py = cy + Math.sin(a) * rr;
            const isKey = (i + ring) % 4 === 0;

            ctx.fillStyle = isKey
              ? `hsla(${accentHue}, 100%, 75%, 0.95)`
              : `hsla(${baseHue}, 70%, 60%, 0.4)`;
            ctx.beginPath();
            ctx.arc(px, py, isKey ? 1.8 : 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      } else if (state === 'connecting') {
        // Constellation nodes with dynamic energy pulses
        const nodes = [
          { x: cx - r * 0.5, y: cy - r * 0.3 },
          { x: cx + r * 0.4, y: cy - r * 0.5 },
          { x: cx + r * 0.6, y: cy + r * 0.2 },
          { x: cx - r * 0.3, y: cy + r * 0.5 },
          { x: cx + r * 0.1, y: cy + r * 0.6 },
          { x: cx - r * 0.1, y: cy - r * 0.1 }
        ];

        // Draw connections
        ctx.strokeStyle = `hsla(${baseHue}, 70%, 60%, 0.25)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Energy pulses along lines
        const edgeIdx = Math.abs(Math.floor(tSec * 2)) % nodes.length;
        const nextIdx = (edgeIdx + 1) % nodes.length;
        const progress = Math.abs((tSec * 2) % 1);
        const pulseX = nodes[edgeIdx].x + (nodes[nextIdx].x - nodes[edgeIdx].x) * progress;
        const pulseY = nodes[edgeIdx].y + (nodes[nextIdx].y - nodes[edgeIdx].y) * progress;

        ctx.fillStyle = `hsla(${accentHue}, 100%, 80%, 0.9)`;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw nodes
        nodes.forEach((n, idx) => {
          const pulse = 1 + Math.sin(tSec * 3 + idx) * 0.3;
          ctx.fillStyle = `hsla(${baseHue}, 90%, 70%, 0.9)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2 * pulse, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (state === 'weaving') {
        // 3 intertwined helical strands
        const strands = 3;
        const steps = 40;
        for (let s = 0; s < strands; s++) {
          const phaseOffset = (s * Math.PI * 2) / strands;
          for (let step = 0; step < steps; step++) {
            const u = (step / steps) * Math.PI * 2;
            const waveX = cx + Math.cos(u) * r * 0.8;
            const waveY = cy + Math.sin(u * 2 + tSec * 2 * speed + phaseOffset) * (r * 0.45);
            const depth = (Math.sin(u + phaseOffset) + 1) / 2;

            ctx.fillStyle = `hsla(${baseHue + s * 30}, 85%, 65%, ${0.2 + depth * 0.7})`;
            ctx.beginPath();
            ctx.arc(waveX, waveY, 1 + depth * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      } else if (state === 'composing') {
        // Flowing multi-band waveform
        const bands = 4;
        const points = 30;
        for (let b = 0; b < bands; b++) {
          const bOff = (b / bands) * Math.PI;
          for (let p = 0; p < points; p++) {
            const px = cx - r * 0.8 + (p / points) * (r * 1.6);
            const freq = (p / points) * Math.PI * 3 + tSec * 3 * speed + bOff;
            const py = cy + Math.sin(freq) * (r * 0.35) * (1 - Math.abs(p - points / 2) / (points / 2));

            ctx.fillStyle = `hsla(${baseHue + b * 20}, 90%, 65%, ${0.3 + (b / bands) * 0.6})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      } else if (state === 'listening') {
        // Radial audio equalizer pulses
        const bars = 16;
        for (let i = 0; i < bars; i++) {
          const angle = (i / bars) * Math.PI * 2;
          const mag = 0.4 + 0.5 * Math.abs(Math.sin(tSec * 4 * speed + i * 0.8));
          const len = r * mag;
          const x1 = cx + Math.cos(angle) * (r * 0.3);
          const y1 = cy + Math.sin(angle) * (r * 0.3);
          const x2 = cx + Math.cos(angle) * len;
          const y2 = cy + Math.sin(angle) * len;

          ctx.strokeStyle = `hsla(${baseHue}, 85%, 65%, 0.7)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Peak dot
          ctx.fillStyle = `hsla(${accentHue}, 100%, 75%, 0.9)`;
          ctx.beginPath();
          ctx.arc(x2, y2, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (state === 'breathing') {
        // Deep breathing organic pulse
        const breath = 0.5 + 0.5 * Math.sin(tSec * 1.8 * speed);
        const curR = r * (0.6 + 0.35 * breath);
        const dots = 36;
        for (let i = 0; i < dots; i++) {
          const a = (i / dots) * Math.PI * 2 + tSec * 0.3;
          const px = cx + Math.cos(a) * curR;
          const py = cy + Math.sin(a) * curR;
          ctx.fillStyle = `hsla(${baseHue}, 80%, 65%, ${0.3 + 0.6 * breath})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.3 + breath * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner core
        ctx.fillStyle = `hsla(${accentHue}, 90%, 70%, ${0.4 + 0.5 * breath})`;
        ctx.beginPath();
        ctx.arc(cx, cy, curR * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else if (state === 'shaping') {
        // Morphing polygon: Circle -> Triangle -> Square -> Hexagon
        const cycle = Math.abs((tSec * 0.6 * speed) % 3);
        const phase = cycle % 1;
        const stage = Math.floor(cycle) % 3;
        const dots = 32;

        for (let i = 0; i < dots; i++) {
          const a = (i / dots) * Math.PI * 2;
          let px = 0;
          let py = 0;

          if (stage === 0) {
            // Circle to Square
            const circX = cx + Math.cos(a) * r * 0.8;
            const circY = cy + Math.sin(a) * r * 0.8;
            const sqSide = r * 0.75;
            const sqX = cx + Math.max(-sqSide, Math.min(sqSide, Math.cos(a) * 1.4 * sqSide));
            const sqY = cy + Math.max(-sqSide, Math.min(sqSide, Math.sin(a) * 1.4 * sqSide));
            px = circX + (sqX - circX) * phase;
            py = circY + (sqY - circY) * phase;
          } else if (stage === 1) {
            // Square to Triangle
            const sqSide = r * 0.75;
            const sqX = cx + Math.max(-sqSide, Math.min(sqSide, Math.cos(a) * 1.4 * sqSide));
            const sqY = cy + Math.max(-sqSide, Math.min(sqSide, Math.sin(a) * 1.4 * sqSide));
            // Triangle
            const triA = a - Math.PI / 2;
            const triR = r * 0.85 / (Math.cos((triA % ((2 * Math.PI) / 3)) - Math.PI / 3));
            const triX = cx + Math.cos(a) * Math.min(r * 0.85, Math.abs(triR));
            const triY = cy + Math.sin(a) * Math.min(r * 0.85, Math.abs(triR));
            px = sqX + (triX - sqX) * phase;
            py = sqY + (triY - sqY) * phase;
          } else {
            // Triangle to Circle
            const triA = a - Math.PI / 2;
            const triR = r * 0.85 / (Math.cos((triA % ((2 * Math.PI) / 3)) - Math.PI / 3));
            const triX = cx + Math.cos(a) * Math.min(r * 0.85, Math.abs(triR));
            const triY = cy + Math.sin(a) * Math.min(r * 0.85, Math.abs(triR));
            const circX = cx + Math.cos(a) * r * 0.8;
            const circY = cy + Math.sin(a) * r * 0.8;
            px = triX + (circX - triX) * phase;
            py = triY + (circY - triY) * phase;
          }

          ctx.fillStyle = `hsla(${baseHue}, 85%, 65%, 0.85)`;
          ctx.beginPath();
          ctx.arc(px, py, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    if (paused) {
      drawOrb(1.0);
      return;
    }

    const loop = (now: number) => {
      const tSec = (now - startTime) / 1000;
      drawOrb(tSec);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [state, size, speed, paused, theme]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel || STATE_LABELS[state]}
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
