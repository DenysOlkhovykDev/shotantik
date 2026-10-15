import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class InfoButton extends Container {
  private symbol = new Text({
    text: "?",
    style: new TextStyle({
      fill: "#000000",
      fontWeight: "bold",
      fontSize: 32,
    }),
  });
  private background = new Graphics();

  private static backgroundParams = {
    width: 40,
    height: 40,
  };

  private static symbolPosition = {
    x: 9,
    y: 2,
  };

  constructor(
    private showInfoBoard: () => void,
    private hideInfoBoard: () => void,
  ) {
    super();

    this.createBackground();
    this.createSymbol();
  }

  private createBackground() {
    this.background
      .rect(
        0,
        0,
        InfoButton.backgroundParams.width,
        InfoButton.backgroundParams.height,
      )
      .fill({ alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.showInfoBoard();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "none";
    this.symbol.position.set(
      InfoButton.symbolPosition.x,
      InfoButton.symbolPosition.y,
    );

    this.addChild(this.symbol);
  }

  public showButton() {
    this.visible = true;
  }

  public hideButton() {
    this.visible = false;
    this.hideInfoBoard();
  }
}
