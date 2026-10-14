import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin, makeGear } from "@utils/basic-graphic";

export class Gear extends Resource {
  static params = {
    amounthOfTeeth: 6,
    innerRadius: 4.5,
    outerRadius: 7,

    baseColor: "#bdd2d3",
    strokewidth: 1.25,
    centerRaius: 2.25,
    centerColor: "#000000",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Gear.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Gear.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics.clear();

    makeGear(
      baseGraphics,
      Gear.params.amounthOfTeeth,
      Gear.params.innerRadius,
      Gear.params.outerRadius,
      Gear.params.baseColor,
      Gear.params.strokewidth,
      Gear.params.centerRaius,
      Gear.params.centerColor,
    );

    Gear.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
