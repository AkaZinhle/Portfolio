export interface WorldAnchor {
  id: string;
  type: 'platform' | 'sign' | 'building' | 'conduit' | 'water' | 'campfire';
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  targetId?: string;
  active?: boolean;
}

export class DOMAnchorManager {
  private anchors: Map<string, WorldAnchor> = new Map();
  private elements: Map<string, HTMLElement> = new Map();

  public registerElement(id: string, el: HTMLElement, type: WorldAnchor['type'] = 'platform', label?: string, targetId?: string) {
    this.elements.set(id, el);
    this.updateAnchor(id, el, type, label, targetId);
  }

  public unregisterElement(id: string) {
    this.elements.delete(id);
    this.anchors.delete(id);
  }

  public updateAll() {
    this.elements.forEach((el, id) => {
      const existing = this.anchors.get(id);
      if (existing) {
        this.updateAnchor(id, el, existing.type, existing.label, existing.targetId);
      }
    });
  }

  private updateAnchor(id: string, el: HTMLElement, type: WorldAnchor['type'], label?: string, targetId?: string) {
    const rect = el.getBoundingClientRect();
    this.anchors.set(id, {
      id,
      type,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      label,
      targetId,
      active: rect.top < window.innerHeight + 100 && rect.bottom > -100
    });
  }

  public getAnchors(): WorldAnchor[] {
    return Array.from(this.anchors.values());
  }

  public getAnchor(id: string): WorldAnchor | undefined {
    return this.anchors.get(id);
  }

  public cleanup() {
    this.elements.clear();
    this.anchors.clear();
  }
}

export const globalAnchorManager = new DOMAnchorManager();
