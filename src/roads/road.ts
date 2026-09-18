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

  static crateRoadImage(x: number, y: number) {
    const root = new Graphics();
    const startX = x + 30;
    const startY = y - 30;
    const finishX = x - 30;
    const finishY = y + 30;

    root
      .moveTo(startX, startY)
      .lineTo(finishX, finishY)
      .stroke({ width: 8, color: "#000000" });

    root.circle(startX, startY, 10).fill("#000000");
    root.circle(finishX, finishY, 10).fill("#000000");

    return root;
  }
}
