import { aircraft } from "@aircraft/aircraft";
import { Container, Graphics } from "pixi.js";

export class DeleteButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();
  }

  private createBackground() {
    this.background.rect(0, 40, 40, 40).fill({ color: "#ffffff", alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.deleteBuilding();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "static";
    this.symbol
      .moveTo(6, 58)
      .lineTo(12, 70)
      .lineTo(24, 70)
      .lineTo(30, 58)
      .closePath()
      .moveTo(14, 58)
      .lineTo(16, 70)
      .moveTo(22, 58)
      .lineTo(20, 70)
      .stroke({ width: 4, color: "#ff0000", cap: "round" });

    this.symbol
      .moveTo(6, 52)
      .lineTo(30, 52)
      .stroke({ width: 4, color: "#ff0000", cap: "round" });
    this.symbol.circle(17.5, 50, 4).fill("#ff0000");

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.deleteBuilding();
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
