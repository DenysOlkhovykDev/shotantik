import { Graphics } from "pixi.js";
import { Building } from "@aircraft/building";

export class Road {
  graphic: Graphics;

  constructor(
    public from: Building,
    public to: Building,
  ) {
    this.graphic = new Graphics();
    this.draw(from, to);
  }

  draw(from: Building, to: Building) {
    const fromCenter = from.getBaseCenterInWorld();
    const toCenter = to.getBaseCenterInWorld();

    this.graphic
      .moveTo(fromCenter.x, fromCenter.y)
      .lineTo(toCenter.x, toCenter.y)
      .stroke({ width: 8, color: "#000000" });

    this.graphic.alpha = 0.5;
    this.graphic.eventMode = "static";

    this.graphic.on("pointerdown", (e) => {
      e.stopPropagation();
    });
  }

  static crateRoadImage() {
    const root = new Graphics();
    const startX = 15;
    const startY = -15;
    const finishX = -15;
    const finishY = 15;

    root
      .moveTo(startX, startY)
      .lineTo(finishX, finishY)
      .stroke({ width: 4, color: "#000000" });

    root.circle(startX, startY, 5).fill("#000000");
    root.circle(finishX, finishY, 5).fill("#000000");

    return root;
  }
}
