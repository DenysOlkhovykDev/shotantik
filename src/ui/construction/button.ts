import { Container, Graphics } from "pixi.js";

export class ConstructionButton extends Container {
  private static plus = {
    size: 50,

    strokeWidth: 20,
    strokeColor: "#000000",

    baseWidth: 16,
    baseColor: "#00ff60",
  };

  private graphic = new Graphics();

  constructor() {
    super();

    this.graphic = new Graphics();

    this.graphic.circle(0, 0, ConstructionButton.plus.size).fill({ alpha: 0 });

    this.graphic
      .moveTo(-ConstructionButton.plus.size / 2 - 2, 0)
      .lineTo(ConstructionButton.plus.size / 2 + 2, 0)
      .moveTo(0, -ConstructionButton.plus.size / 2 - 2)
      .lineTo(0, ConstructionButton.plus.size / 2 + 2)
      .stroke({
        width: ConstructionButton.plus.strokeWidth,
        color: ConstructionButton.plus.strokeColor,
      });

    this.graphic
      .moveTo(-ConstructionButton.plus.size / 2, 0)
      .lineTo(ConstructionButton.plus.size / 2, 0)
      .moveTo(0, -ConstructionButton.plus.size / 2)
      .lineTo(0, ConstructionButton.plus.size / 2)
      .stroke({
        width: ConstructionButton.plus.baseWidth,
        color: ConstructionButton.plus.baseColor,
      });

    this.addChild(this.graphic);
  }

  public show() {
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  public isVisible() {
    return this.visible;
  }
}
