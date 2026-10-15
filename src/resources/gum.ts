import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Gum extends Resource {
  private static params = {
    ballsX: 3.5,
    ballsY: 0,
    ballsRadius: 2.5,

    rectWidth: 4,
    rectheight: 2,

    strokeWidth: 3,
    strokeColor: "#000000",

    baseColor: "#da315b",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Gum.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Gum.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .circle(-Gum.params.ballsX, Gum.params.ballsY, Gum.params.ballsRadius)
      .circle(Gum.params.ballsX, Gum.params.ballsY, Gum.params.ballsRadius)
      .rect(
        -Gum.params.rectWidth / 2,
        -Gum.params.rectheight / 2,
        Gum.params.rectWidth,
        Gum.params.rectheight,
      )
      .stroke({
        width: Gum.params.strokeWidth,
        color: Gum.params.strokeColor,
      })
      .fill(Gum.params.baseColor);

    Gum.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
