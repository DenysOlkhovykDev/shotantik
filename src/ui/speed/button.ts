import { Container, Graphics } from "pixi.js";

import { getSpeedButtonPosition } from "@utils/ui-config";

class SpeedButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();
  private speedModifier = 1;

  private static backgroundParams = {
    width: 40,
    height: 40,
  };

  private static symbolParams = {
    width: 30,
    height: 40,
  };

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.position.set(getSpeedButtonPosition().x, getSpeedButtonPosition().y);

    this.updateSymbol();
  }

  private createBackground(): void {
    this.background
      .rect(
        0,
        0,
        SpeedButton.backgroundParams.width,
        SpeedButton.backgroundParams.height,
      )
      .fill({ alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.toggleSpeed();
    });

    this.addChild(this.background);
  }

  private createSymbol(): void {
    this.symbol.eventMode = "static";

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.toggleSpeed();
    });

    this.addChild(this.symbol);
  }

  private toggleSpeed(): void {
    this.toggleSpeedModifier();
    this.updateSymbol();
  }

  private updateSymbol(): void {
    if (this.getSpeedModifier() === 1) {
      this.drawStandartSymbol();
    } else {
      this.drawDoubleSymbol();
    }
  }

  private drawStandartSymbol(): void {
    this.symbol.clear();

    this.symbol
      .moveTo(0, 0)
      .lineTo(
        SpeedButton.symbolParams.width,
        SpeedButton.symbolParams.height / 2,
      )
      .lineTo(0, SpeedButton.symbolParams.height)
      .closePath()
      .moveTo(10, 0)
      .lineTo(
        SpeedButton.symbolParams.width + 10,
        SpeedButton.symbolParams.height / 2,
      )
      .lineTo(10, SpeedButton.symbolParams.height)
      .fill({ color: "#000000" });
  }

  private drawDoubleSymbol(): void {
    this.symbol.clear();

    this.symbol
      .moveTo(0, 0)
      .lineTo(
        SpeedButton.symbolParams.width,
        SpeedButton.symbolParams.height / 2,
      )
      .lineTo(0, SpeedButton.symbolParams.height)
      .closePath()
      .moveTo(10, 0)
      .lineTo(
        SpeedButton.symbolParams.width + 10,
        SpeedButton.symbolParams.height / 2,
      )
      .lineTo(10, SpeedButton.symbolParams.height)
      .fill({ color: "#ff0000" });
  }

  public getSpeedModifier() {
    return this.speedModifier;
  }

  public doubleSpeedModifier() {
    this.speedModifier = 2;
  }

  public standartSpeedModifier() {
    this.speedModifier = 1;
  }

  public toggleSpeedModifier() {
    if (this.getSpeedModifier() === 1) {
      this.doubleSpeedModifier();
    } else {
      this.standartSpeedModifier();
    }
  }
}

export const speedButton = new SpeedButton();
