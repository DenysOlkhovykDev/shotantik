import { Graphics } from "pixi.js";
import { type Building } from "@aircraft/building";

export class Road {
  private static params = {
    strokeWidth: 10,
    strokeColor: "#000000",

    baseWidth: 6,
    baseColor: "#737675",
  };

  private static icon = {
    width: 60,
    height: 60,
    radius: 10,

    strokeWidth: 10,
    color: "#000000",
  };

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
      .lineTo(toCenter.x, toCenter.y);
    this.graphic.stroke({
      width: Road.params.strokeWidth,
      color: Road.params.strokeColor,
    });

    this.graphic
      .moveTo(fromCenter.x, fromCenter.y)
      .lineTo(toCenter.x, toCenter.y);
    this.graphic.stroke({
      width: Road.params.baseWidth,
      color: Road.params.baseColor,
    });

    this.graphic.eventMode = "static";

    this.graphic.on("pointerdown", (e) => {
      e.stopPropagation();
    });
  }

  static crateRoadImage(x: number, y: number) {
    const graphic = new Graphics();
    const startX = x + Road.icon.width / 2;
    const startY = y - Road.icon.width / 2;
    const finishX = x - Road.icon.height / 2;
    const finishY = y + Road.icon.height / 2;

    graphic
      .moveTo(startX, startY)
      .lineTo(finishX, finishY)
      .stroke({ width: Road.icon.strokeWidth, color: Road.icon.color });

    graphic.circle(startX, startY, Road.icon.radius).fill(Road.icon.color);
    graphic.circle(finishX, finishY, Road.icon.radius).fill(Road.icon.color);

    return graphic;
  }
}
