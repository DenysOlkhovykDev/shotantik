import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Metal extends Resource {
  static params = {
    amountOfPoints: 3,
    radius: 6,
    strokeWidth: 3,
    strokeColor: "#000000",
    baseCOlor: "#d15a53",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Metal.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Metal.baseTexture) return;

    const baseGraphics = new Graphics();

    const left = getRadialPoint(
      0,
      Metal.params.amountOfPoints,
      Metal.params.radius,
    );
    const top = getRadialPoint(
      1,
      Metal.params.amountOfPoints,
      Metal.params.radius,
    );
    const right = getRadialPoint(
      2,
      Metal.params.amountOfPoints,
      Metal.params.radius,
    );

    baseGraphics
      .moveTo(left.x, left.y)
      .lineTo(top.x, top.y)
      .lineTo(right.x, right.y)
      .closePath()
      .stroke({
        width: Metal.params.strokeWidth,
        color: Metal.params.strokeColor,
      })
      .fill(Metal.params.baseCOlor);

    Metal.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
