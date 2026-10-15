import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Water extends Resource {
  static params = {
    x: 0,
    y: 0,
    radius: 5,

    strokeWidth: 3,
    strokeColor: "#000000",

    baseColor: "#5bd5d3",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Water.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Water.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .circle(Water.params.x, Water.params.y, Water.params.radius)
      .stroke({
        width: Water.params.strokeWidth,
        color: Water.params.strokeColor,
      })
      .fill(Water.params.baseColor);

    Water.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
