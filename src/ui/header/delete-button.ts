import { Container, Graphics } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";

export class DeleteButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();

  private static backgroundParams = {
    width: 40,
    height: 40,
  };

  private static trashBin = {
    strokeWidth: 4,
    strokeColor: "#ff0000",
  };

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();
  }

  private createBackground() {
    this.background
      .rect(
        0,
        0,
        DeleteButton.backgroundParams.width,
        DeleteButton.backgroundParams.height,
      )
      .fill({ alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.deleteBuilding();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "none";

    const width = DeleteButton.backgroundParams.width;
    const height = DeleteButton.backgroundParams.height;
    const padding = 8;
    const gap = 2;
    const strokeWidth = 4;

    this.symbol
      .circle(width / 2, padding, 4)
      .fill(DeleteButton.trashBin.strokeColor);

    this.symbol
      .moveTo(padding, padding + gap)
      .lineTo(width - padding, padding + gap)
      .stroke({
        width: strokeWidth,
        color: DeleteButton.trashBin.strokeColor,
        cap: "round",
      });

    const top = padding + 2 * gap + strokeWidth;
    const bottom = height - padding;
    const leftTop = padding;
    const rightTop = width - padding;
    const leftBottom = leftTop + width / 8;
    const rightBottom = rightTop - width / 8;
    const centerLeftTop = leftTop + width / 5;
    const centerLeftBottom = leftBottom + width / 8;
    const centerRightTop = rightTop - width / 5;
    const centerRightBottom = rightBottom - width / 8;

    this.symbol
      .moveTo(leftTop, top)
      .lineTo(leftBottom, bottom)
      .lineTo(rightBottom, bottom)
      .lineTo(rightTop, top)
      .closePath()
      .moveTo(centerLeftTop, top)
      .lineTo(centerLeftBottom, bottom)
      .moveTo(centerRightTop, top)
      .lineTo(centerRightBottom, bottom)
      .stroke({
        width: strokeWidth,
        color: DeleteButton.trashBin.strokeColor,
        cap: "round",
      });

    this.addChild(this.symbol);
  }

  private deleteBuilding() {
    aircraft.deleteSelectedNode();
  }

  public showButton() {
    this.visible = true;
  }

  public hideButton() {
    this.visible = false;
  }
}
