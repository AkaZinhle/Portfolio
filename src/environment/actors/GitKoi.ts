export class GitKoiActor {
  public x: number = 0;
  public y: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;
  public angle: number = 0;
  public speed: number = 1.2;
  public turnSpeed: number = 0.04;
  public tailPhase: number = 0;
  public swimTime: number = 0;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
  }

  public update(dt: number, width: number, height: number, mouseX: number, mouseY: number, onSpawnRipple?: (x: number, y: number) => void) {
    this.swimTime += dt;
    this.tailPhase += dt * 8;

    // Waypoint targeting
    const distToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    if (distToTarget < 40 || Math.random() < 0.005) {
      this.targetX = width * 0.15 + Math.random() * (width * 0.7);
      this.targetY = height * 0.2 + Math.random() * (height * 0.65);
    }

    // React to mouse proximity
    const distToMouse = Math.hypot(mouseX - this.x, mouseY - this.y);
    let desiredAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);

    if (distToMouse < 140) {
      // Steer away quickly from mouse
      desiredAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
      this.speed = 2.5;
    } else {
      this.speed = 1.2;
    }

    // Smooth angle interpolation
    let angleDiff = desiredAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    this.angle += angleDiff * this.turnSpeed;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Emit swimming ripples periodically
    if (Math.random() < 0.12 && onSpawnRipple) {
      onSpawnRipple(
        this.x - Math.cos(this.angle) * 14,
        this.y - Math.sin(this.angle) * 14
      );
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Side fins
    const finFlap = Math.sin(this.tailPhase * 0.7) * 0.35;
    ctx.fillStyle = 'rgba(252, 117, 180, 0.5)';
    ctx.beginPath();
    ctx.ellipse(-2, -9, 8, 3, -0.4 + finFlap, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-2, 9, 8, 3, 0.4 - finFlap, 0, Math.PI * 2);
    ctx.fill();

    // Main Torpedo Body
    const bodyGrad = ctx.createLinearGradient(12, 0, -18, 0);
    bodyGrad.addColorStop(0, '#FC75B4');
    bodyGrad.addColorStop(0.4, '#f43f5e');
    bodyGrad.addColorStop(0.8, '#c9be83');
    bodyGrad.addColorStop(1, '#474329');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dorsal markings (Cream scale shimmer)
    ctx.fillStyle = 'rgba(240, 229, 219, 0.85)';
    ctx.beginPath();
    ctx.ellipse(3, 0, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Accent scale marking (Olive)
    ctx.fillStyle = 'rgba(71, 67, 41, 0.9)';
    ctx.fillRect(-2, -2, 4, 4);

    // Oscillating tail fin
    const tailAngle = Math.sin(this.tailPhase) * 0.45;
    ctx.save();
    ctx.translate(-14, 0);
    ctx.rotate(tailAngle);

    ctx.fillStyle = 'rgba(252, 117, 180, 0.7)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -7);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-12, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Eyes
    ctx.fillStyle = '#181611';
    ctx.fillRect(8, -4, 2, 2);
    ctx.fillRect(8, 2, 2, 2);

    ctx.restore();
  }
}
