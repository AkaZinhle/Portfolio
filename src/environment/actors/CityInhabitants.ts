import { WorldAnchor } from '../world/DOMAnchors';
import { PixelFXEngine } from '../fx/PixelFXEngine';

export class CityInhabitantsManager {
  // Welder Engineer State
  public welder = {
    x: 0,
    y: 0,
    active: false,
    weldTimer: 0,
    sparkTimer: 0,
  };

  // Courier with Crate State
  public courier = {
    x: 0,
    y: 0,
    startX: 0,
    endX: 0,
    facing: 1 as 1 | -1,
    active: false,
    hasCrate: true,
  };

  // Arcane Mage State
  public mage = {
    x: 0,
    y: 0,
    active: false,
    castTimer: 0,
  };

  // Pier Fisherman State
  public fisherman = {
    x: 0,
    y: 0,
    active: false,
    rodPhase: 0,
  };

  // Sleeping Cat State
  public cat = {
    x: 0,
    y: 0,
    active: false,
    tailPhase: 0,
  };

  // Rooftop Ninja State
  public ninja = {
    x: 0,
    y: 0,
    active: false,
    scarfPhase: 0,
  };

  public update(dt: number, anchors: WorldAnchor[], fxEngine: PixelFXEngine) {
    // 1. Position Welder on first active project card
    const projAnchor = anchors.find(a => a.active && a.type === 'building');
    if (projAnchor) {
      this.welder.active = true;
      this.welder.x = projAnchor.x + 18;
      this.welder.y = projAnchor.y - 12;
      this.welder.weldTimer += dt;
      this.welder.sparkTimer += dt;

      // Emit welding sparks periodically
      if (this.welder.sparkTimer > 0.08 && (this.welder.weldTimer % 3.0 < 2.0)) {
        this.welder.sparkTimer = 0;
        fxEngine.spawnSparks(this.welder.x + 6, this.welder.y + 10, 3, '#fef08a');
      }
    } else {
      this.welder.active = false;
    }

    // 2. Position Courier on top of hero or project header
    const walkAnchor = anchors.find(a => a.active && (a.type === 'platform' || a.type === 'building'));
    if (walkAnchor) {
      this.courier.active = true;
      this.courier.y = walkAnchor.y - 14;
      this.courier.startX = walkAnchor.x + 40;
      this.courier.endX = walkAnchor.x + Math.min(walkAnchor.width - 40, 240);

      if (this.courier.x < this.courier.startX || this.courier.x > this.courier.endX) {
        this.courier.x = this.courier.startX;
      }

      this.courier.x += this.courier.facing * 35 * dt;
      if (this.courier.x > this.courier.endX) {
        this.courier.x = this.courier.endX;
        this.courier.facing = -1;
      } else if (this.courier.x < this.courier.startX) {
        this.courier.x = this.courier.startX;
        this.courier.facing = 1;
      }
    } else {
      this.courier.active = false;
    }

    // 3. Position Mage near capabilities
    const capAnchor = anchors.find(a => a.active && a.id.includes('capab'));
    if (capAnchor) {
      this.mage.active = true;
      this.mage.x = capAnchor.x + capAnchor.width - 45;
      this.mage.y = capAnchor.y + 40;
      this.mage.castTimer += dt;
    } else {
      this.mage.active = false;
    }

    // 4. Position Fisherman near lower water stream
    const contactAnchor = anchors.find(a => a.active && a.type === 'campfire');
    if (contactAnchor) {
      this.fisherman.active = true;
      this.fisherman.x = contactAnchor.x + contactAnchor.width - 60;
      this.fisherman.y = contactAnchor.y - 12;
      this.fisherman.rodPhase += dt * 2;
    } else {
      this.fisherman.active = false;
    }

    // 5. Position Sleeping Cat on VoltStock card
    const voltAnchor = anchors.find(a => a.active && a.id === 'project-voltstock');
    if (voltAnchor) {
      this.cat.active = true;
      this.cat.x = voltAnchor.x + 80;
      this.cat.y = voltAnchor.y - 10;
      this.cat.tailPhase += dt * 3;
    } else {
      this.cat.active = false;
    }

    // 6. Position Ninja on top navbar ledge
    this.ninja.active = true;
    this.ninja.x = Math.max(20, window.innerWidth * 0.18);
    this.ninja.y = 12;
    this.ninja.scarfPhase += dt * 4;
  }

  public draw(ctx: CanvasRenderingContext2D, time: number) {
    // 1. Draw Welder Engineer
    if (this.welder.active) {
      ctx.save();
      ctx.translate(Math.floor(this.welder.x), Math.floor(this.welder.y));

      const isWelding = this.welder.weldTimer % 3.0 < 2.0;

      // Engineer Body (Heavy protective suit)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 4, 10, 12);
      ctx.fillStyle = '#0284c7'; // Apron
      ctx.fillRect(1, 6, 8, 8);

      // Welding Helmet & Glowing Visor
      ctx.fillStyle = '#334155';
      ctx.fillRect(1, -4, 8, 8);
      ctx.fillStyle = isWelding ? '#38bdf8' : '#64748b';
      ctx.fillRect(2, -2, 6, 3); // visor

      // Welding Torch in Hand
      ctx.fillStyle = '#64748b';
      ctx.fillRect(7, 4, 6, 2);
      if (isWelding) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(12, 3, 3, 3);
      }

      // Legs & Boots
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(1, 16, 3, 4);
      ctx.fillRect(6, 16, 3, 4);

      ctx.restore();
    }

    // 2. Draw Courier carrying crate
    if (this.courier.active) {
      ctx.save();
      ctx.translate(Math.floor(this.courier.x), Math.floor(this.courier.y));
      if (this.courier.facing === -1) {
        ctx.scale(-1, 1);
      }

      const walkBob = Math.abs(Math.sin(time * 0.015)) * 2;

      // Courier Body (Blue coat)
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-4, 2 - walkBob, 8, 12);
      // Cap
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-4, -6 - walkBob, 9, 4);
      ctx.fillStyle = '#f3c49d';
      ctx.fillRect(-3, -2 - walkBob, 6, 4); // face

      // Wooden Crate
      ctx.fillStyle = '#b45309';
      ctx.fillRect(4, -4 - walkBob, 10, 10);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, -2 - walkBob, 6, 6);

      // Legs
      ctx.fillStyle = '#1e293b';
      const stride = Math.sin(time * 0.015) * 3;
      ctx.fillRect(-3 + stride, 14, 3, 5);
      ctx.fillRect(1 - stride, 14, 3, 5);

      ctx.restore();
    }

    // 3. Draw Arcane Mage with floating staff
    if (this.mage.active) {
      ctx.save();
      ctx.translate(Math.floor(this.mage.x), Math.floor(this.mage.y));

      const floatY = Math.sin(time * 0.003) * 2;

      // Robe (Deep violet)
      ctx.fillStyle = '#581c87';
      ctx.fillRect(-5, 0 + floatY, 10, 16);
      // Wizard Hat
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.moveTo(0, -14 + floatY);
      ctx.lineTo(-7, -4 + floatY);
      ctx.lineTo(7, -4 + floatY);
      ctx.closePath();
      ctx.fill();

      // White Beard & Face
      ctx.fillStyle = '#f3c49d';
      ctx.fillRect(-3, -3 + floatY, 6, 4);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-4, 1 + floatY, 8, 6); // beard

      // Crystal Staff with glowing orb
      ctx.fillStyle = '#78350f';
      ctx.fillRect(6, -8 + floatY, 2, 22);
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(7, -10 + floatY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Draw Fisherman with dangling rod
    if (this.fisherman.active) {
      ctx.save();
      ctx.translate(Math.floor(this.fisherman.x), Math.floor(this.fisherman.y));

      // Seated Body
      ctx.fillStyle = '#047857'; // green coat
      ctx.fillRect(-5, 4, 10, 10);
      // Straw Hat
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-8, -4, 16, 3);
      ctx.fillRect(-4, -8, 8, 4);
      ctx.fillStyle = '#f3c49d';
      ctx.fillRect(-3, -1, 6, 5); // face

      // Dangling Legs
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-4, 14, 3, 8);
      ctx.fillRect(1, 14, 3, 8);

      // Fishing Rod & Thread
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(4, 6);
      ctx.lineTo(22, -10); // rod tip
      ctx.lineTo(24, 25 + Math.sin(this.fisherman.rodPhase) * 3); // line in water
      ctx.stroke();

      ctx.restore();
    }

    // 5. Draw Sleeping Calico Cat
    if (this.cat.active) {
      ctx.save();
      ctx.translate(Math.floor(this.cat.x), Math.floor(this.cat.y));

      const breathe = Math.sin(time * 0.003) * 0.5;
      const tailWiggle = Math.sin(this.cat.tailPhase) * 2;

      // Curled Body (Calico orange & white)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(0, 4 + breathe, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-3, 3 + breathe, 4, 3);

      // Cat Head
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(4, 1 + breathe, 5, 5);
      // Ears
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(4, -1 + breathe, 2, 2);
      ctx.fillRect(7, -1 + breathe, 2, 2);

      // Flicking Tail
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-8, 2 + tailWiggle, 3, 2);

      ctx.restore();
    }

    // 6. Draw Rooftop Ninja / Sentinel
    if (this.ninja.active) {
      ctx.save();
      ctx.translate(Math.floor(this.ninja.x), Math.floor(this.ninja.y));

      // Dark Suit
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, 2, 8, 12);
      // Mask & Head
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-3, -6, 6, 7);
      ctx.fillStyle = '#38bdf8'; // glowing eye slit
      ctx.fillRect(-2, -3, 4, 1.5);

      // Long Fluttering Crimson Scarf
      const scarfFlow = Math.sin(this.ninja.scarfPhase) * 3;
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(3, 0, 4, 3);
      ctx.fillRect(7, -2 + scarfFlow, 8, 3);
      ctx.fillRect(14, -4 + scarfFlow * 1.5, 6, 2.5);

      ctx.restore();
    }
  }
}

export const globalCityInhabitants = new CityInhabitantsManager();
