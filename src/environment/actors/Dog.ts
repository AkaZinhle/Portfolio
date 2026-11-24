export type DogState = 'sit' | 'trot' | 'sniff' | 'sleep' | 'happy_jump';

export class DogActor {
  public x: number = 0;
  public y: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;
  public facing: 1 | -1 = -1;
  public state: DogState = 'sit';
  public stateTimer: number = 0;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
  }

  public update(dt: number, explorerX: number, explorerY: number, explorerFacing: 1 | -1) {
    this.stateTimer += dt;

    // Follow Explorer offset
    this.targetX = explorerX - explorerFacing * 28;
    this.targetY = explorerY + 4;
    this.facing = explorerFacing;

    const dx = this.targetX - this.x;
    if (Math.abs(dx) > 12) {
      this.state = 'trot';
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), 55 * dt);
    } else {
      if (this.state === 'trot') {
        this.state = 'sit';
        this.stateTimer = 0;
      } else if (this.stateTimer > 4.0 && this.state === 'sit') {
        const r = Math.random();
        if (r < 0.4) {
          this.state = 'sniff';
        } else if (r < 0.7) {
          this.state = 'happy_jump';
        } else {
          this.state = 'sleep';
        }
        this.stateTimer = 0;
      } else if ((this.state === 'sniff' || this.state === 'happy_jump' || this.state === 'sleep') && this.stateTimer > 3.0) {
        this.state = 'sit';
        this.stateTimer = 0;
      }
    }

    // Smooth Y tracking
    this.y += (this.targetY - this.y) * Math.min(1, dt * 10);
  }

  public draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    if (this.facing === 1) {
      ctx.scale(-1, 1);
    }

    const dogBreathe = Math.sin(time * 0.004 + 1) * 0.5;
    const tailWag = Math.sin(time * (this.state === 'happy_jump' ? 0.025 : 0.012)) * 3;
    const jumpOffset = this.state === 'happy_jump' ? Math.abs(Math.sin(time * 0.015)) * 6 : 0;
    const trotBob = this.state === 'trot' ? Math.abs(Math.sin(time * 0.015)) * 2 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (warm amber / golden coat)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-7, 10 + dogBreathe - jumpOffset - trotBob, 14, 8);

    // Head
    ctx.fillStyle = '#f59e0b';
    const sniffY = this.state === 'sniff' ? 3 : 0;
    ctx.fillRect(3, 4 + dogBreathe + sniffY - jumpOffset - trotBob, 8, 8);

    // Snout
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(7, 8 + dogBreathe + sniffY - jumpOffset - trotBob, 5, 4);

    // Nose
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(11, 8 + dogBreathe + sniffY - jumpOffset - trotBob, 2, 2);

    // Ear
    ctx.fillStyle = '#b45309';
    ctx.fillRect(3, 2 + dogBreathe + sniffY - jumpOffset - trotBob, 3, 4);

    // Eye
    ctx.fillStyle = '#0f172a';
    if (this.state === 'sleep') {
      ctx.fillRect(7, 7 + dogBreathe - jumpOffset, 3, 1); // closed eye
    } else {
      ctx.fillRect(7, 6 + dogBreathe + sniffY - jumpOffset - trotBob, 2, 2);
    }

    // Legs
    ctx.fillStyle = '#b45309';
    if (this.state === 'trot') {
      const stride = Math.sin(time * 0.015) * 3;
      ctx.fillRect(-5 + stride, 18 - jumpOffset, 3, 4);
      ctx.fillRect(4 - stride, 18 - jumpOffset, 3, 4);
    } else {
      ctx.fillRect(-5, 18 - jumpOffset, 3, 4);
      ctx.fillRect(4, 18 - jumpOffset, 3, 4);
    }

    // Tail
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-10, 8 + tailWag - jumpOffset - trotBob, 4, 3);

    ctx.restore();
  }
}
