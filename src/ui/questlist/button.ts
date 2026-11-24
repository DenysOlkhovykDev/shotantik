import { Container, Graphics } from "pixi.js";

export class QuestListButton extends Container {
  private button: Graphics;

  private indicator: Graphics;

  private static params = {
    width: 40,
    height: 50,
    borderRadius: 8,

    backgroundColor: "#cfcbc8",

    strokeWidth: 6,
    strokeColor: "#000000",

    rows: { y: [12.5, 25, 37.5], xS: 10, xE: 30 },
    rowWidth: 4,

    indicatorRadius: 7,
    indicatorColor: "#ff0000",
  };

  constructor() {
    super();

    this.button = new Graphics();

    this.button
      .roundRect(
        0,
        0,
        QuestListButton.params.width,
        QuestListButton.params.height,
        QuestListButton.params.borderRadius,
      )
      .stroke({
        width: QuestListButton.params.strokeWidth,
        color: QuestListButton.params.strokeColor,
      })
      .fill(QuestListButton.params.backgroundColor);

    this.button
      .moveTo(QuestListButton.params.rows.xS, QuestListButton.params.rows.y[0])
      .lineTo(QuestListButton.params.rows.xE, QuestListButton.params.rows.y[0])
      .moveTo(QuestListButton.params.rows.xS, QuestListButton.params.rows.y[1])
      .lineTo(QuestListButton.params.rows.xE, QuestListButton.params.rows.y[1])
      .moveTo(QuestListButton.params.rows.xS, QuestListButton.params.rows.y[2])
      .lineTo(QuestListButton.params.rows.xE, QuestListButton.params.rows.y[2])
      .stroke({
        width: QuestListButton.params.rowWidth,
        color: QuestListButton.params.strokeColor,
      });

    this.addChild(this.button);

    this.indicator = new Graphics();

    this.indicator
      .circle(
        QuestListButton.params.width,
        0,
        QuestListButton.params.indicatorRadius,
      )
      .fill(QuestListButton.params.indicatorColor);

    this.hideIndicator();

    this.addChild(this.indicator);
  }

  public showIndicator() {
    this.indicator.visible = true;
  }

  public hideIndicator() {
    this.indicator.visible = false;
  }
}
