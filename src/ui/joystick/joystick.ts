import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { getJoyStickPosition } from "@utils/ui-config";

class Joystick extends Container {
  private base: Graphics;
  private thumb: Graphics;

  private radius = 60;
  private thumbRadius = 25;

  private dragging = false;

  public inputX = 0;
  public inputY = 0;

  constructor() {
    super();

    this.eventMode = "static";

    this.position.set(getJoyStickPosition().x, getJoyStickPosition().y);

    this.base = new Graphics()
      .circle(0, 0, this.radius)
      .fill({ color: "#ffffff", alpha: 0 })
      .stroke({ width: 3, color: "#000000" });

    this.thumb = new Graphics()
      .circle(0, 0, this.thumbRadius)
      .fill({ color: "#444444", alpha: 1 })
      .stroke({ width: 3, color: "#000000" });

    this.thumb.alpha = 0.8;

    this.addChild(this.base, this.thumb);

    this.base.eventMode = "static";
    this.base.on("pointerdown", this.onDown);
    this.thumb.eventMode = "static";
    this.thumb.on("pointerdown", this.onDown);

    this.on("globalpointermove", this.onMove);

    this.on("pointerup", this.onUp);
    this.on("pointerupoutside", this.onUp);

    this.hide();
  }

  private onDown = (event: FederatedPointerEvent) => {
    this.dragging = true;

    this.thumb.alpha = 1;

    event.stopPropagation();
  };

  private onMove = (event: FederatedPointerEvent) => {
    if (!this.dragging) return;

    this.thumb.alpha = 1;

    const pos = event.getLocalPosition(this);

    let dx = pos.x;
    let dy = pos.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.radius) {
      const angle = Math.atan2(dy, dx);

      dx = Math.cos(angle) * this.radius;
      dy = Math.sin(angle) * this.radius;
    }

    this.thumb.position.set(dx, dy);

    this.inputX = dx / this.radius;
    this.inputY = dy / this.radius;

    event.stopPropagation();
  };

  private onUp = () => {
    this.dragging = false;

    this.thumb.alpha = 0.8;

    this.thumb.position.set(0, 0);

    this.inputX = 0;
    this.inputY = 0;
  };

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;

    this.dragging = false;

    this.inputX = 0;
    this.inputY = 0;

    this.thumb.position.set(0, 0);
  }

  isVisible() {
    return this.visible;
  }
}

export const joystick = new Joystick();
