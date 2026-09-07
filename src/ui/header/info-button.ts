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

  private infoBoard = new Text({
    text: `Information
will be added
later`,
    style: new TextStyle({
      fill: "#000000",
      fontSize: 28,
    }),
  });
  private infoBoardBackground = new Graphics();

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.createInfoBoard();
  }

  private createBackground() {
    this.background.rect(-40, 40, 40, 40).fill({ color: "#ffffff", alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.showInfoBoard();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "static";
    this.symbol.position.set(-30, 42);

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.showInfoBoard();
    });

    this.addChild(this.symbol);
  }

  private createInfoBoard() {
    this.infoBoardBackground
      .roundRect(-100, 40, 200, 100, 20)
      .fill("#cfcbc8")
      .stroke({
        width: 4,
        color: "#000000",
      });

    this.infoBoardBackground.eventMode = "none";
    this.addChild(this.infoBoardBackground);

    this.infoBoard.position.set(-90, 40);
    this.addChild(this.infoBoard);

    this.hideInfoBoard();
  }

  private showInfoBoard() {
    this.infoBoardBackground.visible = true;
    this.infoBoard.visible = true;
  }

  private hideInfoBoard() {
    this.infoBoardBackground.visible = false;
    this.infoBoard.visible = false;
  }

  public showButton() {
    this.visible = true;
  }

  public hideButton() {
    this.visible = false;
    this.hideInfoBoard();
  }
}
