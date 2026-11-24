import { WorldAnchor } from '../world/DOMAnchors';
import { WorldZoneId } from '../world/WorldCoordinator';

export class WorldZoneRenderer {
  public drawHighlands(ctx: CanvasRenderingContext2D, time: number, anchors: WorldAnchor[], width: number, height: number) {
    // Find hero platform anchor or fallback
    const heroAnchor = anchors.find(a => a.id === 'hero-ledge' || a.id === 'hero');
    const platX = heroAnchor && heroAnchor.active ? heroAnchor.x + heroAnchor.width * 0.75 - 40 : Math.min(width * 0.82, width - 120);
    const platY = heroAnchor && heroAnchor.active ? heroAnchor.y + 120 : Math.min(height * 0.28, 280);

    // Floating Cyber Platform
    const platW = 85;
    const platH = 14;

    ctx.fillStyle = '#2b271d';
    ctx.fillRect(platX, platY, platW, platH);
    ctx.fillStyle = '#FC75B4';
    ctx.fillRect(platX, platY, platW, 2);

    // Neon rune lights on platform
    const runeGlow = 0.5 + 0.5 * Math.sin(time * 0.003);
    ctx.fillStyle = `rgba(252, 117, 180, ${0.4 + runeGlow * 0.6})`;
    ctx.fillRect(platX + 8, platY + 5, 3, 3);
    ctx.fillRect(platX + platW - 11, platY + 5, 3, 3);

    // Small cyber pine tree beside ledge
    const treeX = platX + platW + 8;
    const treeY = platY - 18;
    const wind = Math.sin(time * 0.002) * 1.5;

    ctx.fillStyle = '#474329';
    ctx.fillRect(treeX + 3, treeY + 12, 3, 8); // trunk
    ctx.fillStyle = '#756f45';
    ctx.beginPath();
    ctx.moveTo(treeX + 4 + wind, treeY);
    ctx.lineTo(treeX - 4, treeY + 14);
    ctx.lineTo(treeX + 12, treeY + 14);
    ctx.closePath();
    ctx.fill();
  }

  public drawWorkshop(ctx: CanvasRenderingContext2D, time: number, anchors: WorldAnchor[], width: number, height: number) {
    // Miniature Logistics Depot for VoltStock (Anchor: project-voltstock)
    const voltAnchor = anchors.find(a => a.id === 'project-voltstock');
    if (voltAnchor && voltAnchor.active) {
      const bX = voltAnchor.x + voltAnchor.width - 50;
      const bY = voltAnchor.y + 10;

      // Small warehouse chimney with smoke
      ctx.fillStyle = '#474329';
      ctx.fillRect(bX, bY, 12, 18);
      ctx.fillStyle = '#FC75B4';
      ctx.fillRect(bX + 2, bY + 4, 3, 3); // glowing window

      // Mini conveyor belt with moving package
      ctx.fillStyle = '#2b271d';
      ctx.fillRect(bX - 25, bY + 18, 30, 4);
      const pkgOffset = (time * 0.02) % 24;
      ctx.fillStyle = '#FC75B4';
      ctx.fillRect(bX - 22 + pkgOffset, bY + 14, 4, 4);
    }

    // Miniature Inspection Scanner for PCB Detector (Anchor: project-pcb-detector)
    const pcbAnchor = anchors.find(a => a.id === 'project-pcb-detector');
    if (pcbAnchor && pcbAnchor.active) {
      const pX = pcbAnchor.x + 15;
      const pY = pcbAnchor.y + 12;

      // Lab stand
      ctx.fillStyle = '#474329';
      ctx.fillRect(pX, pY, 14, 16);
      ctx.fillStyle = '#FC75B4';
      ctx.fillRect(pX + 3, pY + 3, 8, 4); // screen

      // Scanning Laser Beam
      const scanPhase = (time * 0.003) % 1;
      const laserY = pY + 18 + scanPhase * 10;
      ctx.strokeStyle = 'rgba(252, 117, 180, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pX - 10, laserY);
      ctx.lineTo(pX + 24, laserY);
      ctx.stroke();
    }
  }

  public drawWilderness(ctx: CanvasRenderingContext2D, time: number, anchors: WorldAnchor[], width: number, height: number) {
    // Campfire & River by Contact section (Anchor: contact-campfire)
    const contactAnchor = anchors.find(a => a.id === 'contact-campfire' || a.id === 'contact');
    const fireX = contactAnchor && contactAnchor.active ? contactAnchor.x + 35 : width * 0.2;
    const fireY = contactAnchor && contactAnchor.active ? contactAnchor.y + contactAnchor.height - 30 : height * 0.85;

    // Fire pit stones
    ctx.fillStyle = '#474329';
    ctx.fillRect(fireX - 8, fireY + 4, 16, 4);

    // Animated Fire Flame
    const fireBob = Math.sin(time * 0.015) * 2;
    ctx.fillStyle = '#FC75B4';
    ctx.beginPath();
    ctx.moveTo(fireX, fireY - 8 + fireBob);
    ctx.lineTo(fireX - 5, fireY + 4);
    ctx.lineTo(fireX + 5, fireY + 4);
    ctx.closePath();
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#F0E5DB';
    ctx.beginPath();
    ctx.moveTo(fireX, fireY - 4 + fireBob);
    ctx.lineTo(fireX - 2.5, fireY + 3);
    ctx.lineTo(fireX + 2.5, fireY + 3);
    ctx.closePath();
    ctx.fill();

    // Campfire Log
    ctx.fillStyle = '#474329';
    ctx.fillRect(fireX - 6, fireY + 2, 12, 2);
  }
}

export const globalWorldZoneRenderer = new WorldZoneRenderer();
