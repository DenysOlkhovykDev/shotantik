import { Graphics } from "pixi.js";

import { type Building } from "@aircraft/building";

export class Road {
  private static params = {
    strokeWidth: 12,
    strokeColor: "#000000",

    baseWidth: 8,
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
    const fromCenter = from.getBaseCenter();
    const toCenter = to.getBaseCenter();

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

    const start = this.getIntersectionPoint(to, from);
    const end = this.getIntersectionPoint(from, to);

    for (const point of [start, end]) {
      if (!point) continue;

      this.graphic
        .circle(point.x, point.y, 7)
        .stroke({
          width: 4,
          color: Road.params.strokeColor,
        })
        .fill({
          color: Road.params.baseColor,
        });
    }

    this.graphic.eventMode = "static";

    this.graphic.on("pointerdown", (e) => {
      e.stopPropagation();
    });
  }

  private getIntersectionPoint(from: Building, to: Building) {
    const fromCenter = from.getBaseCenter();
    const toCenter = to.getBaseCenter();

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return undefined;

    const dirX = dx / distance;
    const dirY = dy / distance;

    const radius = to.buildingConfig.baseGraphicalSize;

    const decorationCenter = to.getBoundsCenter();

    const decorationDx = decorationCenter.x - fromCenter.x;
    const decorationDy = decorationCenter.y - fromCenter.y;

    const projection = decorationDx * dirX + decorationDy * dirY;

    const perpendicularDistanceSquared =
      decorationDx * decorationDx +
      decorationDy * decorationDy -
      projection * projection;

    const radiusSquared = radius * radius;

    if (perpendicularDistanceSquared > radiusSquared) {
      return undefined;
    }

    const offset = Math.sqrt(radiusSquared - perpendicularDistanceSquared);

    const intersectionDistance = projection - offset;

    return {
      x: fromCenter.x + dirX * intersectionDistance,
      y: fromCenter.y + dirY * intersectionDistance,
    };
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
