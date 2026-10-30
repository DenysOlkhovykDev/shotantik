import { Container, Graphics } from "pixi.js";

import { getCameraResetButtonPosition } from "@utils/ui-config";

export class resetButton extends Container {
  private static symbol = {
    size: 30,

    startAngle: Math.PI,
    endAngle: (3 * Math.PI) / 4,

    strokeWidth: 6,
    handStrokeWidth: 10,
    strokeColor: "#000000",
  };

  private graphic = new Graphics();

  private buttonPosition = {
    x: getCameraResetButtonPosition().x,
    y: getCameraResetButtonPosition().y,
  };

  constructor() {
    super();

    this.position.set(this.buttonPosition.x, this.buttonPosition.y);

    this.graphic = new Graphics();

    this.graphic.circle(0, 0, resetButton.symbol.size).fill({ alpha: 0 });

    this.graphic
      .moveTo(-resetButton.symbol.size / 2, 0)
      .arc(
        0,
        0,
        resetButton.symbol.size / 2,
        resetButton.symbol.startAngle,
        resetButton.symbol.endAngle,
      )
      .moveTo(-17, -6)
      .lineTo(-resetButton.symbol.size / 2, 0)
      .lineTo(-10, -3)
      .closePath()
      .stroke({
        width: resetButton.symbol.strokeWidth,
        color: resetButton.symbol.strokeColor,
      });

    this.graphic.moveTo(12, 12).lineTo(20, 20).stroke({
      width: resetButton.symbol.handStrokeWidth,
      color: resetButton.symbol.strokeColor,
    });

    this.addChild(this.graphic);
  }
}
