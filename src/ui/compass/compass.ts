import { Container, Graphics } from "pixi.js";

import { getGlobalWorldCoordinates } from "../../main";

import { getDistance } from "@utils/basic-geometry";
import { getGameScreenCenter } from "@utils/ui-config";

export class Compass extends Container {
  static arrow = {
    width: 20,
    height: 20,

    strokeWidth: 4,
    strokeColor: "#000000",

    baseColor: "#00ff00",

    radius: 250,

    hideThreshold: 300,
  };

  graphics = new Graphics();

  constructor(
    public compassTargetX: number,
    public compassTargetY: number,
    public condition: () => boolean,
  ) {
    super();
    this.graphics.eventMode = "none";
  }

  private draw(x: number, y: number) {
    this.graphics.clear();

    const centerX = getGameScreenCenter().x;
    const centerY = getGameScreenCenter().y;

    const dx = x - centerX;
    const dy = y - centerY;

    const angle = Math.atan2(dy, dx);

    const arrowX = centerX + Math.cos(angle) * Compass.arrow.radius;
    const arrowY = centerY + Math.sin(angle) * Compass.arrow.radius;

    this.graphics.position.set(arrowX, arrowY);

    this.graphics.rotation = angle;

    this.graphics
      .moveTo(Compass.arrow.width, 0)
      .lineTo(-Compass.arrow.width / 2, -Compass.arrow.height / 2)
      .lineTo(-Compass.arrow.width / 2, Compass.arrow.height / 2)
      .closePath()
      .stroke({
        width: Compass.arrow.strokeWidth,
        color: Compass.arrow.strokeColor,
      })
      .fill(Compass.arrow.baseColor);
  }

  public updateCompassPosition() {
    const centerX = getGameScreenCenter().x;
    const centerY = getGameScreenCenter().y;

    const { x, y } = getGlobalWorldCoordinates(
      this.compassTargetX,
      this.compassTargetY,
    );

    if (getDistance(x, y, centerX, centerY) > Compass.arrow.hideThreshold) {
      this.draw(x, y);
    } else {
      this.graphics.clear();
    }
  }
}
