import { WorldAnchor } from '../world/DOMAnchors';

export interface Bird {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: 'perched' | 'flying';
  wingPhase: number;
  speed: number;
  color: string;
}

export interface Butterfly {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  wingPhase: number;
  color: string;
}

export interface TinyFish {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export class WildlifeManager {
  private birds: Bird[] = [];
  private butterflies: Butterfly[] = [];
  private fishSchool: TinyFish[] = [];
  private schoolTargetX: number = 0;
  private schoolTargetY: number = 0;

  constructor() {
    // Initialize birds
    const birdColors = ['#38bdf8', '#f8fafc', '#a855f7', '#fbbf24'];
    for (let i = 0; i < 4; i++) {
      this.birds.push({
        x: 100 + i * 180,
        y: 80,
        targetX: 100 + i * 180,
        targetY: 80,
        state: 'perched',
        wingPhase: Math.random() * Math.PI,
        speed: 1.5 + Math.random(),
        color: birdColors[i % birdColors.length],
      });
    }

    // Initialize butterflies
    const flyColors = ['#2dd4bf', '#a855f7', '#fbbf24', '#f43f5e'];
    for (let i = 0; i < 5; i++) {
      const bx = 120 + i * 220;
      const by = 200 + (i % 3) * 150;
      this.butterflies.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        wingPhase: Math.random() * Math.PI,
        color: flyColors[i % flyColors.length],
      });
    }

    // Initialize tiny fish school
    for (let i = 0; i < 7; i++) {
      this.fishSchool.push({
        x: 300 + (Math.random() - 0.5) * 30,
        y: 400 + (Math.random() - 0.5) * 20,
        vx: 1,
        vy: 0.2,
      });
    }
  }

  public update(dt: number, width: number, height: number, anchors: WorldAnchor[]) {
    // 1. Update Birds
    this.birds.forEach((bird, idx) => {
      bird.wingPhase += dt * 12;

      if (bird.state === 'perched') {
        if (Math.random() < 0.003) {
          bird.state = 'flying';
          bird.targetX = Math.random() * (width - 100) + 50;
          bird.targetY = Math.random() * 250 + 40;
        }
      } else {
        const dx = bird.targetX - bird.x;
        const dy = bird.targetY - bird.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          bird.x += (dx / dist) * bird.speed * 60 * dt;
          bird.y += (dy / dist) * bird.speed * 60 * dt;
        } else {
          bird.state = 'perched';
        }
      }
    });

    // 2. Update Butterflies
    this.butterflies.forEach((b, idx) => {
      b.wingPhase += dt * 10;
      b.x = b.baseX + Math.sin(b.wingPhase * 0.3 + idx) * 35;
      b.y = b.baseY + Math.cos(b.wingPhase * 0.2 + idx) * 20;
    });

    // 3. Update Tiny Fish School
    if (Math.random() < 0.01) {
      this.schoolTargetX = Math.random() * (width * 0.6) + width * 0.2;
      this.schoolTargetY = Math.random() * (height * 0.5) + height * 0.3;
    }

    const leadDx = this.schoolTargetX - (this.fishSchool[0]?.x || 0);
    const leadDy = this.schoolTargetY - (this.fishSchool[0]?.y || 0);
    const leadAngle = Math.atan2(leadDy, leadDx);

    this.fishSchool.forEach((fish, i) => {
      fish.vx = Math.cos(leadAngle) * 1.4 + (Math.random() - 0.5) * 0.2;
      fish.vy = Math.sin(leadAngle) * 1.4 + (Math.random() - 0.5) * 0.2;
      fish.x += fish.vx;
      fish.y += fish.vy;
    });
  }

  public draw(ctx: CanvasRenderingContext2D, time: number) {
    // 1. Draw Birds
    this.birds.forEach((bird) => {
      ctx.save();
      ctx.translate(Math.floor(bird.x), Math.floor(bird.y));

      const isFlying = bird.state === 'flying';
      const wingFlap = isFlying ? Math.sin(bird.wingPhase) * 4 : 0;

      // Body
      ctx.fillStyle = bird.color;
      ctx.fillRect(-3, -2, 6, 4);

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(3, -1, 2, 2);

      // Wings
      ctx.fillStyle = bird.color;
      if (isFlying) {
        ctx.fillRect(-2, -6 + wingFlap, 4, 3);
      } else {
        ctx.fillRect(-2, -3, 3, 2);
      }

      ctx.restore();
    });

    // 2. Draw Butterflies
    this.butterflies.forEach((b) => {
      ctx.save();
      ctx.translate(Math.floor(b.x), Math.floor(b.y));

      const wing = Math.abs(Math.sin(b.wingPhase)) * 3;

      // Left & Right Wings
      ctx.fillStyle = b.color;
      ctx.fillRect(-1 - wing, -3, wing, 4);
      ctx.fillRect(1, -3, wing, 4);

      // Body dot
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-0.5, -2, 1, 3);

      ctx.restore();
    });

    // 3. Draw Tiny Fish School
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    this.fishSchool.forEach((fish) => {
      ctx.fillRect(Math.floor(fish.x), Math.floor(fish.y), 4, 2);
    });

    // 4. Draw Duck bobbing near water
    const duckX = 140;
    const duckY = window.innerHeight * 0.75 + Math.sin(time * 0.003) * 2;
    ctx.save();
    ctx.translate(duckX, duckY);

    // Body (white/mallard)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, 2, 12, 6);
    // Green Head
    ctx.fillStyle = '#047857';
    ctx.fillRect(3, -3, 6, 6);
    // Orange Beak
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 0, 3, 2);

    ctx.restore();
  }
}

export const globalWildlifeManager = new WildlifeManager();
