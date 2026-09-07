import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { gameScreen } from "../../game-config";

export class Tutorial extends Container {
  isActive = true;

  overlay = new Graphics();

  tutorialParam = {
    holeRadius: 50,
    holeMessageSpacing: 10,
    messagePadding: 10,
    okButtonHeight: 30,
  };

  messageContainer = new Container();
  messageBackground = new Graphics();
  messageText = new Text({
    text: "",
    style: new TextStyle({
      fill: "#000000",
      fontSize: 32,
    }),
  });

  okButton = new Graphics();
  okText = new Text({
    text: "ok",
    style: new TextStyle({
      fill: "#000000",
      fontSize: 20,
    }),
  });

  constructor(
    public text: string,
    public showCondition: Function,
    public hideCondition: Function,
    public needOkButton: boolean,
    public pointerX?: number,
    public pointerY?: number,
    public findTarget?: Function,
  ) {
    super();

    this.overlay.eventMode = "static";
    this.overlay.on("pointerdown", (event) => {
      event.stopPropagation();
    });

    this.addChild(this.overlay, this.messageContainer);

    this.draw();

    this.visible = false;
  }

  private draw() {
    this.messageText.text = this.text;

    this.drawOverlay();
    this.drawMessage();
  }

  private drawOverlay() {
    this.overlay.clear();

    if (this.pointerX !== undefined && this.pointerY !== undefined) {
      this.overlay
        .rect(0, 0, gameScreen.width, gameScreen.height)
        .fill({
          color: "#000000",
          alpha: 0.15,
        })
        .circle(this.pointerX, this.pointerY, this.tutorialParam.holeRadius)
        .cut();

      if (import.meta.env.VITE_IS_DEBUG === "true") {
        this.overlay
          .moveTo(this.pointerX, this.pointerY - this.tutorialParam.holeRadius)
          .lineTo(
            this.pointerX + 100,
            this.pointerY - this.tutorialParam.holeRadius,
          )
          .stroke({
            width: 4,
            color: "#ff0000",
          });

        this.overlay
          .moveTo(this.pointerX, this.pointerY)
          .lineTo(this.pointerX + 100, this.pointerY)
          .stroke({
            width: 4,
            color: "#ff0000",
          });

        this.overlay
          .moveTo(this.pointerX, this.pointerY + this.tutorialParam.holeRadius)
          .lineTo(
            this.pointerX + 100,
            this.pointerY + this.tutorialParam.holeRadius,
          )
          .stroke({
            width: 4,
            color: "#ff0000",
          });
      }
    }
  }

  private drawMessage() {
    this.drawMessageBackGround();

    this.drawMessageText();

    this.drawMessageButton();
  }

  private drawMessageBackGround() {
    this.messageBackground.clear();

    if (this.pointerX !== undefined && this.pointerY !== undefined) {
      const backgroundX =
        this.pointerX +
        this.tutorialParam.holeRadius +
        this.tutorialParam.holeMessageSpacing;
      const backgroundY =
        this.pointerY -
        this.messageText.height / 2 -
        this.tutorialParam.messagePadding -
        (this.needOkButton ? this.tutorialParam.okButtonHeight / 2 : 0);

      const backgroundWidth =
        this.messageText.width + this.tutorialParam.messagePadding * 2;
      const backgroundHeight =
        this.messageText.height +
        this.tutorialParam.messagePadding * 2 +
        (this.needOkButton ? this.tutorialParam.okButtonHeight : 0);

      this.messageBackground
        .roundRect(
          backgroundX,
          backgroundY,
          backgroundWidth,
          backgroundHeight,
          20,
        )
        .fill("#cfcbc8")
        .stroke({
          width: 4,
          color: "#000000",
        });

      this.messageBackground.eventMode = "none";
      this.messageContainer.addChild(this.messageBackground);
    }
  }

  private drawMessageText() {
    if (this.pointerX !== undefined && this.pointerY !== undefined) {
      const textX =
        this.pointerX +
        this.tutorialParam.holeRadius +
        this.tutorialParam.holeMessageSpacing +
        this.tutorialParam.messagePadding;
      const textY =
        this.pointerY -
        this.messageText.height / 2 -
        (this.needOkButton ? this.tutorialParam.okButtonHeight / 2 : 0);

      this.messageText.position.set(textX, textY);
      this.messageText.eventMode = "none";
      this.messageContainer.addChild(this.messageText);
    }
  }

  private drawMessageButton() {
    this.okButton.clear();

    if (
      this.pointerX !== undefined &&
      this.pointerY !== undefined &&
      this.needOkButton
    ) {
      const buttonX =
        this.pointerX +
        this.tutorialParam.holeRadius +
        this.tutorialParam.holeMessageSpacing +
        this.tutorialParam.messagePadding;
      const buttonY =
        this.pointerY +
        this.messageText.height / 2 +
        this.tutorialParam.messagePadding * 2 -
        this.tutorialParam.okButtonHeight;

      const buttonWidth = this.messageText.width;
      const buttonHeight = this.tutorialParam.okButtonHeight - 5;

      this.okButton
        .roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10)
        .fill("#a6a4a3")
        .stroke({
          width: 4,
          color: "#000000",
        });

      this.okText.position.set(
        buttonX + buttonWidth / 2 - this.okText.width / 2,
        buttonY,
      );

      this.okButton.eventMode = "static";
      this.okText.eventMode = "none";
      this.okButton.on("pointerdown", (event) => {
        this.isActive = false;
        event.stopPropagation();
      });

      this.messageContainer.addChild(this.okButton, this.okText);
    }
  }

  public updateTutorial() {
    if (this.findTarget !== undefined) {
      const { x: x, y: y } = this.findTarget();

      this.pointerX = x;
      this.pointerY = y;

      this.draw();
    }

    if ((!this.showCondition() && this.visible) || this.hideCondition()) {
      this.isActive = false;
    }

    this.visible =
      this.isActive && this.showCondition() && !this.hideCondition();

    return this.visible;
  }
}
