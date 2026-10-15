import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Organic extends Resource {
  static params = {
    size: 10,
    strokeWidth: 3,
    strokeColor: "#000000",
    baseCOlor: "#49c461",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Organic.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Organic.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .rect(
        -Organic.params.size / 2,
        -Organic.params.size / 2,
        Organic.params.size,
        Organic.params.size,
      )
      .stroke({
        width: Organic.params.strokeWidth,
        color: Organic.params.strokeColor,
      })
      .fill(Organic.params.baseCOlor);

    Organic.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
