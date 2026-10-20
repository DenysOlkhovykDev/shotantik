import { Graphics, Sprite } from "pixi.js";

import { Resource } from "@resources/resource";

import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Truss extends Resource {
  private static parallels = {
    width: 12,
    height: 8,

    strokeWidth: 5,
    strokeColor: "#000000",

    baseWidth: 2,
    baseColor: "#d6d655",
  };

  private static joins = {
    width: 1.5,
    color: "#000000",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Truss.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Truss.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .moveTo(Truss.parallels.width / 2, -Truss.parallels.height / 2)
      .lineTo(Truss.parallels.width / 4, Truss.parallels.height / 2)
      .lineTo(-Truss.parallels.width / 4, -Truss.parallels.height / 2)
      .lineTo(-Truss.parallels.width / 2, Truss.parallels.height / 2)
      .stroke({ width: Truss.joins.width, color: Truss.joins.color });

    baseGraphics
      .moveTo(-Truss.parallels.width / 2 - 1, -Truss.parallels.height / 2)
      .lineTo(Truss.parallels.width / 2 + 1, -Truss.parallels.height / 2)
      .stroke({
        width: Truss.parallels.strokeWidth,
        color: Truss.parallels.strokeColor,
      });

    baseGraphics
      .moveTo(-Truss.parallels.width / 2, -Truss.parallels.height / 2)
      .lineTo(Truss.parallels.width / 2, -Truss.parallels.height / 2)
      .stroke({
        width: Truss.parallels.baseWidth,
        color: Truss.parallels.baseColor,
      });

    baseGraphics
      .moveTo(-Truss.parallels.width / 2 - 1, Truss.parallels.height / 2)
      .lineTo(Truss.parallels.width / 2 + 1, Truss.parallels.height / 2)
      .stroke({
        width: Truss.parallels.strokeWidth,
        color: Truss.parallels.strokeColor,
      });

    baseGraphics
      .moveTo(-Truss.parallels.width / 2, Truss.parallels.height / 2)
      .lineTo(Truss.parallels.width / 2, Truss.parallels.height / 2)
      .stroke({
        width: Truss.parallels.baseWidth,
        color: Truss.parallels.baseColor,
      });

    Truss.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
