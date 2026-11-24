import { WorldAnchor } from '../world/DOMAnchors';

export type ExplorerState = 'idle' | 'walk' | 'jump' | 'sit' | 'inspect' | 'wave';

export class ExplorerActor {
  public x: number = 0;
  public y: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;
  public facing: 1 | -1 = -1;
  public state: ExplorerState = 'idle';
  public stateTimer: number = 0;
  public blinkTimer: number = 0;
  public onGround: boolean = true;
  public currentAnchorId: string | null = null;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
  }

  public update(dt: number, anchors: WorldAnchor[], mouseX: number, mouseY: number) {
    this.stateTimer += dt;
    this.blinkTimer += dt;

    // Look towards mouse
    const dxMouse = mouseX - this.x;
    if (Math.abs(dxMouse) > 30) {
      this.facing = dxMouse > 0 ? 1 : -1;
    }

    // Find nearest active anchor to stand on if none selected
    if (!this.currentAnchorId && anchors.length > 0) {
      const activePlatform = anchors.find(a => a.active && (a.type === 'platform' || a.type === 'building' || a.type === 'sign'));
      if (activePlatform) {
        this.currentAnchorId = activePlatform.id;
        this.targetX = activePlatform.x + activePlatform.width * 0.8;
        this.targetY = activePlatform.y - 12;
      }
    }

    // Behavior State Machine
    if (this.state === 'walk') {
      const dx = this.targetX - this.x;
      if (Math.abs(dx) > 4) {
        this.vx = Math.sign(dx) * 45; // walk speed
        this.x += this.vx * dt;
        this.facing = Math.sign(dx) as 1 | -1;
      } else {
        this.vx = 0;
        this.state = 'idle';
        this.stateTimer = 0;
      }
    } else if (this.state === 'idle') {
      if (this.stateTimer > 4.5) {
        const r = Math.random();
        if (r < 0.4) {
          // Walk a short distance along the ledge
          this.state = 'walk';
          this.targetX = this.x + (Math.random() - 0.5) * 80;
        } else if (r < 0.7) {
          this.state = 'sit';
        } else if (r < 0.9) {
          this.state = 'inspect';
        } else {
          this.state = 'wave';
        }
        this.stateTimer = 0;
      }
    } else if (this.state === 'sit' || this.state === 'inspect' || this.state === 'wave') {
      if (this.stateTimer > 3.0) {
        this.state = 'idle';
        this.stateTimer = 0;
      }
    }

    // Follow target anchor smoothly if anchor moved (e.g. scroll)
    if (this.currentAnchorId) {
      const anchor = anchors.find(a => a.id === this.currentAnchorId);
      if (anchor && anchor.active) {
        this.targetY = anchor.y - 12;
        this.y += (this.targetY - this.y) * Math.min(1, dt * 10);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    if (this.facing === 1) {
      ctx.scale(-1, 1);
    }

    const isBlinking = this.blinkTimer % 4.5 < 0.15;
    const breathe = Math.sin(time * 0.003) * 1;
    const walkBob = this.state === 'walk' ? Math.abs(Math.sin(time * 0.012)) * 2 : 0;
    const isSitting = this.state === 'sit';

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body / Cloak (Warm Dark)
    ctx.fillStyle = '#1e1c15';
    if (isSitting) {
      ctx.fillRect(-6, 8, 12, 10);
    } else {
      ctx.fillRect(-6, 2 + breathe - walkBob, 12, 14);
    }

    // Scarf (Vibrant Pink #FC75B4)
    ctx.fillStyle = '#FC75B4';
    ctx.fillRect(-7, 0 + breathe - walkBob, 14, 4);
    // Scarf trailing tail waving
    const scarfWave = Math.sin(time * 0.005) * 3;
    ctx.fillRect(5, 2 + breathe - walkBob, 5, 7 + scarfWave);

    // Head / Hood
    ctx.fillStyle = '#2b271d';
    ctx.fillRect(-5, -12 + breathe - walkBob, 10, 11);
    ctx.fillStyle = '#181611';
    ctx.fillRect(-4, -11 + breathe - walkBob, 8, 9);

    // Face skin
    ctx.fillStyle = '#F0E5DB';
    ctx.fillRect(-3, -8 + breathe - walkBob, 6, 6);

    // Eyes tracking direction
    ctx.fillStyle = '#181611';
    if (!isBlinking) {
      ctx.fillRect(-2, -6 + breathe - walkBob, 2, 2);
      ctx.fillRect(1, -6 + breathe - walkBob, 2, 2);
    } else {
      ctx.fillRect(-2, -5 + breathe - walkBob, 5, 1);
    }

    // Waving Hand
    if (this.state === 'wave') {
      const armWave = Math.sin(time * 0.015) * 4;
      ctx.fillStyle = '#FC75B4';
      ctx.fillRect(-9, -10 + armWave, 3, 8);
      ctx.fillStyle = '#F0E5DB';
      ctx.fillRect(-10, -12 + armWave, 4, 3);
    }

    // Boots
    ctx.fillStyle = '#756f45';
    if (isSitting) {
      ctx.fillRect(-5, 16, 10, 4);
    } else {
      const legStride = this.state === 'walk' ? Math.sin(time * 0.012) * 3 : 0;
      ctx.fillRect(-5 + legStride, 16, 4, 6);
      ctx.fillRect(1 - legStride, 16, 4, 6);
    }

    ctx.restore();
  }
}
