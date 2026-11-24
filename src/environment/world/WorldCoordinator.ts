export type WorldZoneId = 'highlands' | 'workshop' | 'observatory' | 'archive' | 'wilderness';

export interface WorldEvent {
  type: 'ZONE_ENTERED' | 'PROJECT_SELECTED' | 'NODE_ACTIVATED' | 'WATER_RIPPLE' | 'CHARACTER_INTERACT';
  payload?: any;
}

export class WorldCoordinator {
  private activeZone: WorldZoneId = 'highlands';
  private scrollY: number = 0;
  private cameraY: number = 0;
  private eventListeners: Map<string, ((event: WorldEvent) => void)[]> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.updateZone();
      window.addEventListener('scroll', () => {
        this.scrollY = window.scrollY;
        this.updateZone();
      }, { passive: true });
    }
  }

  private updateZone() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = totalHeight > 0 ? this.scrollY / totalHeight : 0;

    let newZone: WorldZoneId = 'highlands';
    if (scrollRatio < 0.18) {
      newZone = 'highlands';
    } else if (scrollRatio < 0.45) {
      newZone = 'workshop';
    } else if (scrollRatio < 0.68) {
      newZone = 'observatory';
    } else if (scrollRatio < 0.88) {
      newZone = 'archive';
    } else {
      newZone = 'wilderness';
    }

    if (newZone !== this.activeZone) {
      this.activeZone = newZone;
      this.dispatchEvent({ type: 'ZONE_ENTERED', payload: { zone: newZone } });
    }
  }

  public getActiveZone(): WorldZoneId {
    return this.activeZone;
  }

  public getScrollProgress(): number {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    return totalHeight > 0 ? this.scrollY / totalHeight : 0;
  }

  public addEventListener(type: string, callback: (event: WorldEvent) => void) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type)?.push(callback);
  }

  public removeEventListener(type: string, callback: (event: WorldEvent) => void) {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      this.eventListeners.set(type, listeners.filter(cb => cb !== callback));
    }
  }

  public dispatchEvent(event: WorldEvent) {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(cb => cb(event));
    }
    const allListeners = this.eventListeners.get('*');
    if (allListeners) {
      allListeners.forEach(cb => cb(event));
    }
  }
}

export const globalWorldCoordinator = new WorldCoordinator();
