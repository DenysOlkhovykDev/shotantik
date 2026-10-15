import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Battery extends Resource {
  private static casing = {
    color: "#f8f8f8",

    strokeWidth: 3,
    strokeColor: "#000000",

    width: 8,
    height: 10,
  };

  private static contact = {
    width: 3,
    height: 4,
    color: "#000000",
  };

  private static plus = {
    x: 0,
    y: 0,
    width: 4,
    height: 4,

    strokeWidth: 1,
    strokeColor: "#000000",
  };

  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Battery.baseTexture);
    this.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Battery.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .rect(
        -Battery.casing.width / 2,
        -Battery.casing.height / 2,
        Battery.casing.width,
        Battery.casing.height,
      )
      .stroke({
        width: Battery.casing.strokeWidth,
        color: Battery.casing.strokeColor,
      })
      .fill(Battery.casing.color)
      .moveTo(
        -Battery.contact.width,
        -Battery.casing.height / 2 - Battery.contact.height / 2,
      )
      .lineTo(
        Battery.contact.width,
        -Battery.casing.height / 2 - Battery.contact.height / 2,
      )
      .stroke({
        width: Battery.contact.height,
        color: Battery.contact.color,
      })
      .moveTo(Battery.plus.x, -Battery.plus.height / 2)
      .lineTo(Battery.plus.x, Battery.plus.height / 2)
      .moveTo(-Battery.plus.width / 2, Battery.plus.y)
      .lineTo(Battery.plus.width / 2, Battery.plus.y)
      .stroke({
        width: Battery.plus.strokeWidth,
        color: Battery.plus.strokeColor,
      });

    Battery.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
