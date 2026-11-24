import { WorldAnchor } from '../world/DOMAnchors';

export class CityArchitectureRenderer {
  public drawSkyline(ctx: CanvasRenderingContext2D, width: number, time: number) {
    // Distant Isometric Cyber City Skyline
    const skylineY = 160;
    const buildingWidths = [45, 60, 35, 75, 50, 65, 40, 80, 55, 70];
    let curX = 20;

    for (let i = 0; i < buildingWidths.length; i++) {
      const bw = buildingWidths[i];
      const bh = 50 + (i % 4) * 25;

      // Dark Building Silhouette
      ctx.fillStyle = 'rgba(29, 27, 20, 0.6)';
      ctx.fillRect(curX, skylineY - bh, bw, bh);

      // Cyber Rooftop Antenna with blinking light
      const antennaX = curX + bw / 2;
      ctx.fillStyle = 'rgba(71, 67, 41, 0.8)';
      ctx.fillRect(antennaX - 1, skylineY - bh - 14, 2, 14);

      const blink = Math.sin(time * 0.004 + i) > 0.3;
      ctx.fillStyle = blink ? '#FC75B4' : '#881337';
      ctx.fillRect(antennaX - 1.5, skylineY - bh - 16, 3, 3);

      // Window grid
      ctx.fillStyle = 'rgba(252, 117, 180, 0.2)';
      for (let wy = skylineY - bh + 10; wy < skylineY - 10; wy += 12) {
        for (let wx = curX + 6; wx < curX + bw - 6; wx += 10) {
          if ((wx + wy + i) % 3 === 0) {
            ctx.fillRect(wx, wy, 4, 5);
          }
        }
      }

      curX += bw + 25;
      if (curX > width) break;
    }
  }

  public drawCardInfrastructure(ctx: CanvasRenderingContext2D, anchors: WorldAnchor[], time: number) {
    anchors.forEach((anchor) => {
      if (!anchor.active) return;

      const { x, y, width, height, type } = anchor;

      if (type === 'building' || type === 'platform') {
        // 1. Rooftop Shingles on Top Edge
        ctx.fillStyle = '#2b271d';
        ctx.fillRect(x - 4, y - 6, width + 8, 6);
        ctx.fillStyle = '#FC75B4';
        ctx.fillRect(x - 4, y - 6, width + 8, 2); // Pink Accent Trim

        // 2. Hanging Streetlight Lantern with Warm Light Pool
        const lanternX = x - 2;
        const lanternY = y + 14;

        // Lantern bracket
        ctx.fillStyle = '#756f45';
        ctx.fillRect(lanternX - 6, lanternY - 4, 6, 2);
        ctx.fillRect(lanternX - 2, lanternY - 4, 2, 8);

        // Lantern Glass & Flame
        ctx.fillStyle = '#FC75B4';
        ctx.fillRect(lanternX - 4, lanternY + 4, 6, 6);
        ctx.fillStyle = '#F0E5DB';
        ctx.fillRect(lanternX - 2, lanternY + 6, 2, 2);

        // Soft Radial Glow Pool
        const glow = ctx.createRadialGradient(lanternX, lanternY + 7, 0, lanternX, lanternY + 7, 24);
        glow.addColorStop(0, 'rgba(252, 117, 180, 0.2)');
        glow.addColorStop(1, 'rgba(252, 117, 180, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lanternX, lanternY + 7, 24, 0, Math.PI * 2);
        ctx.fill();

        // 3. Metal Access Ladder on Card Edge
        ctx.fillStyle = '#474329';
        const ladderX = x + width + 4;
        const ladderHeight = Math.min(height, 120);

        // Rails
        ctx.fillRect(ladderX, y + 10, 2, ladderHeight);
        ctx.fillRect(ladderX + 8, y + 10, 2, ladderHeight);

        // Rungs
        for (let ry = y + 16; ry < y + 10 + ladderHeight; ry += 12) {
          ctx.fillRect(ladderX, ry, 10, 2);
        }

        // 4. Rooftop Rotating Radar Dish
        const dishX = x + width - 40;
        const dishY = y - 16;
        const dishAngle = Math.sin(time * 0.002) * 0.6;

        ctx.fillStyle = '#756f45';
        ctx.fillRect(dishX, dishY + 6, 3, 6); // mast

        ctx.save();
        ctx.translate(dishX + 1.5, dishY + 6);
        ctx.rotate(dishAngle);
        ctx.fillStyle = '#FC75B4';
        ctx.beginPath();
        ctx.arc(0, 0, 7, Math.PI * 0.8, Math.PI * 1.8);
        ctx.stroke();
        ctx.restore();
      }
    });
  }
}

export const globalCityArchitecture = new CityArchitectureRenderer();
