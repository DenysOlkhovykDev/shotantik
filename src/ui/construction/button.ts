import { Container, Graphics } from "pixi.js";
import { getConstructionButtonPosition } from "@utils/ui-config";

export class ConstructionButton extends Container {
  private static plus = {
    size: 50,

    strokeWidth: 20,
    strokeColor: "#000000",

    baseWidth: 16,
    baseColor: "#00ff60",
  };

  private graphic = new Graphics();

  private buttonPosition = {
    x: getConstructionButtonPosition().x,
    y: getConstructionButtonPosition().y,
  };

  constructor() {
    super();

    this.graphic = new Graphics();

    this.graphic
      .circle(
        this.buttonPosition.x,
        this.buttonPosition.y,
        ConstructionButton.plus.size,
      )
      .fill({ alpha: 0 });

    this.graphic
      .moveTo(
        this.buttonPosition.x - ConstructionButton.plus.size / 2 - 2,
        this.buttonPosition.y,
      )
      .lineTo(
        this.buttonPosition.x + ConstructionButton.plus.size / 2 + 2,
        this.buttonPosition.y,
      )
      .moveTo(
        this.buttonPosition.x,
        this.buttonPosition.y - ConstructionButton.plus.size / 2 - 2,
      )
      .lineTo(
        this.buttonPosition.x,
        this.buttonPosition.y + ConstructionButton.plus.size / 2 + 2,
      )
      .stroke({
        width: ConstructionButton.plus.strokeWidth,
        color: ConstructionButton.plus.strokeColor,
      });

    this.graphic
      .moveTo(
        this.buttonPosition.x - ConstructionButton.plus.size / 2,
        this.buttonPosition.y,
      )
      .lineTo(
        this.buttonPosition.x + ConstructionButton.plus.size / 2,
        this.buttonPosition.y,
      )
      .moveTo(
        this.buttonPosition.x,
        this.buttonPosition.y - ConstructionButton.plus.size / 2,
      )
      .lineTo(
        this.buttonPosition.x,
        this.buttonPosition.y + ConstructionButton.plus.size / 2,
      )
      .stroke({
        width: ConstructionButton.plus.baseWidth,
        color: ConstructionButton.plus.baseColor,
      });

    this.addChild(this.graphic);
  }
}
