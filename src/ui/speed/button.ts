import { Container, Graphics } from "pixi.js";
import { getSpeedButtonPosition } from "@utils/ui-config";

class SpeedButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();
  private speedModifier = 1;

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.updateSymbol();
  }

  private createBackground(): void {
    this.background
      .rect(getSpeedButtonPosition().x, getSpeedButtonPosition().y, 30, 40)
      .fill({ color: "#e5ecea", alpha: 0 });

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
      .moveTo(60, 20)
      .lineTo(90, 40)
      .lineTo(60, 60)
      .closePath()
      .moveTo(70, 20)
      .lineTo(100, 40)
      .lineTo(70, 60)
      .fill({ color: "#000000" });
  }

  private drawDoubleSymbol(): void {
    this.symbol.clear();

    this.symbol
      .moveTo(60, 20)
      .lineTo(90, 40)
      .lineTo(60, 60)
      .closePath()
      .moveTo(70, 20)
      .lineTo(100, 40)
      .lineTo(70, 60)
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
