import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class InfoBoard extends Container {
  private text = new Text({
    text: `Information
will be added
later`,
    style: new TextStyle({
      fill: "#000000",
      fontSize: 28,
    }),
  });
  private background = new Graphics();

  private static params = {
    padding: 16,
    radius: 26,
  };

  constructor() {
    super();

    this.createInfoBoard();
  }

  private createInfoBoard() {
    this.background
      .roundRect(
        -InfoBoard.params.padding - this.text.width / 2,
        -InfoBoard.params.padding,
        this.text.width + 2 * InfoBoard.params.padding,
        this.text.height + 2 * InfoBoard.params.padding,
        InfoBoard.params.radius,
      )
      .fill("#cfcbc8");

    this.background.eventMode = "none";
    this.addChild(this.background);

    this.text.position.set(-this.text.width / 2, 0);
    this.addChild(this.text);

    this.hide();
  }

  public show() {
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }
}
