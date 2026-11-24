export interface BaseFX {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  dead: boolean;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D, time: number): void;
}

export class WaterRippleFX implements BaseFX {
  public x: number;
  public y: number;
  public radius: number = 2;
  public maxRadius: number = 42;
  public life: number = 0;
  public maxLife: number = 45;
  public dead: boolean = false;
  public color: string = '#FC75B4';

  constructor(x: number, y: number, color: string = '#FC75B4') {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public update(dt: number) {
    this.life++;
    this.radius += 1.8;
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, 0.65 * (1 - this.life / this.maxLife));
    ctx.strokeStyle = `rgba(252, 117, 180, ${alpha * 0.7})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (this.radius > 8) {
      ctx.strokeStyle = `rgba(240, 229, 219, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export class SparkBurstFX implements BaseFX {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public size: number;
  public color: string;
  public life: number = 0;
  public maxLife: number = 32;
  public dead: boolean = false;

  constructor(x: number, y: number, color: string = '#38bdf8', angle?: number, speed?: number) {
    this.x = x;
    this.y = y;
    const ang = angle !== undefined ? angle : Math.random() * Math.PI * 2;
    const spd = speed !== undefined ? speed : Math.random() * 2.5 + 1;
    this.vx = Math.cos(ang) * spd;
    this.vy = Math.sin(ang) * spd;
    this.size = Math.random() * 2 + 1;
    this.color = color;
  }

  public update(dt: number) {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06; // gravity
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, 0.9 * (1 - this.life / this.maxLife));
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

export class SmokeEmberFX implements BaseFX {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public size: number;
  public life: number = 0;
  public maxLife: number = 60;
  public dead: boolean = false;
  public isEmber: boolean;

  constructor(x: number, y: number, isEmber: boolean = false) {
    this.x = x;
    this.y = y;
    this.isEmber = isEmber;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = isEmber ? -0.8 - Math.random() * 0.6 : -0.5 - Math.random() * 0.4;
    this.size = isEmber ? Math.random() * 1.5 + 1 : Math.random() * 3 + 2;
    this.maxLife = isEmber ? 40 : 70;
  }

  public update(dt: number) {
    this.life++;
    this.x += this.vx + Math.sin(this.life * 0.1) * 0.2;
    this.y += this.vy;
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const progress = this.life / this.maxLife;
    const alpha = Math.max(0, (1 - progress) * (this.isEmber ? 0.9 : 0.35));

    if (this.isEmber) {
      ctx.fillStyle = progress < 0.5 ? '#fbbf24' : '#ef4444';
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 + progress * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

export class PixelFXEngine {
  private effects: BaseFX[] = [];

  public spawnRipple(x: number, y: number, color?: string) {
    this.effects.push(new WaterRippleFX(x, y, color));
  }

  public spawnSparks(x: number, y: number, count: number = 6, color: string = '#38bdf8') {
    for (let i = 0; i < count; i++) {
      this.effects.push(new SparkBurstFX(x, y, color));
    }
  }

  public spawnCampfireEmber(x: number, y: number) {
    this.effects.push(new SmokeEmberFX(x, y, true));
    if (Math.random() < 0.4) {
      this.effects.push(new SmokeEmberFX(x, y, false));
    }
  }

  public update(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const fx = this.effects[i];
      fx.update(dt);
      if (fx.dead) {
        this.effects.splice(i, 1);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, time: number) {
    for (const fx of this.effects) {
      fx.draw(ctx, time);
    }
  }

  public clear() {
    this.effects = [];
  }
}
