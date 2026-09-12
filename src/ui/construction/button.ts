import { Container, Graphics } from "pixi.js";
import { getConstructionButtonPosition } from "../ui-config";

export class ConstructionButton extends Container {
  graphic = new Graphics();

  public buttonPosition = {
    x: getConstructionButtonPosition().x,
    y: getConstructionButtonPosition().y,
  };

  constructor() {
    super();

    this.graphic = new Graphics();

    this.graphic
      .circle(this.buttonPosition.x, this.buttonPosition.y, 50)
      .fill({ color: "#000000", alpha: 0 });

    this.graphic
      .moveTo(this.buttonPosition.x - 25, this.buttonPosition.y)
      .lineTo(this.buttonPosition.x + 25, this.buttonPosition.y)
      .moveTo(this.buttonPosition.x, this.buttonPosition.y - 25)
      .lineTo(this.buttonPosition.x, this.buttonPosition.y + 25)
      .stroke({ width: 16, color: "#00ff60" });

    this.addChild(this.graphic);
  }
}
