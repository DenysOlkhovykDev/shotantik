import { Container, Graphics, type FederatedPointerEvent } from "pixi.js";

import { getJoyStickPosition } from "@utils/ui-config";

class Joystick extends Container {
  private base: Graphics;
  private thumb: Graphics;

  private static baseParams = {
    radius: 60,

    strokeWidth: 3,
    strokeColor: "#000000",
  };

  private static thumbParams = {
    radius: 25,

    baseColor: "#444444",

    strokeWidth: 3,
    strokeColor: "#000000",

    alpha: 0.8,
  };

  private dragging = false;

  public inputX = 0;
  public inputY = 0;

  constructor() {
    super();

    this.eventMode = "static";

    this.position.set(getJoyStickPosition().x, getJoyStickPosition().y);

    this.base = new Graphics()
      .circle(0, 0, Joystick.baseParams.radius)
      .fill({ alpha: 0 })
      .stroke({
        width: Joystick.baseParams.strokeWidth,
        color: Joystick.baseParams.strokeColor,
      });

    this.thumb = new Graphics()
      .circle(0, 0, Joystick.thumbParams.radius)
      .fill({ color: Joystick.thumbParams.baseColor, alpha: 1 })
      .stroke({
        width: Joystick.thumbParams.strokeWidth,
        color: Joystick.thumbParams.strokeColor,
      });

    this.thumb.alpha = Joystick.thumbParams.alpha;

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

    if (distance > Joystick.baseParams.radius) {
      const angle = Math.atan2(dy, dx);

      dx = Math.cos(angle) * Joystick.baseParams.radius;
      dy = Math.sin(angle) * Joystick.baseParams.radius;
    }

    this.thumb.position.set(dx, dy);

    this.inputX = dx / Joystick.baseParams.radius;
    this.inputY = dy / Joystick.baseParams.radius;

    event.stopPropagation();
  };

  private onUp = () => {
    this.dragging = false;

    this.thumb.alpha = Joystick.thumbParams.alpha;

    this.thumb.position.set(0, 0);

    this.inputX = 0;
    this.inputY = 0;
  };

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.reset();
  }

  reset() {
    this.dragging = false;
    this.thumb.alpha = Joystick.thumbParams.alpha;
    this.thumb.position.set(0, 0);
    this.inputX = 0;
    this.inputY = 0;
  }

  isVisible() {
    return this.visible;
  }
}

export const joystick = new Joystick();
