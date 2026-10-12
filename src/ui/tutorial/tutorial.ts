import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { gameScreen } from "@utils/game-config";
import { joystick } from "@joystick/joystick";

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
    public showCondition: () => boolean,
    public hideCondition: () => boolean,
    public needOkButton: boolean,
    public pointerX?: number,
    public pointerY?: number,
    public findTarget?: () => { x: number; y: number },
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
          .moveTo(
            this.pointerX - 100,
            this.pointerY - this.tutorialParam.holeRadius,
          )
          .lineTo(
            this.pointerX + 100,
            this.pointerY - this.tutorialParam.holeRadius,
          )
          .stroke({
            width: 4,
            color: "#ff0000",
          });

        this.overlay
          .moveTo(this.pointerX - 100, this.pointerY)
          .lineTo(this.pointerX + 100, this.pointerY)
          .stroke({
            width: 4,
            color: "#ff0000",
          });

        this.overlay
          .moveTo(
            this.pointerX - 100,
            this.pointerY + this.tutorialParam.holeRadius,
          )
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
    if (this.pointerX !== undefined && this.pointerY !== undefined) {
      const initialX =
        this.pointerX +
        this.tutorialParam.holeRadius +
        this.tutorialParam.holeMessageSpacing;
      const initialY = this.pointerY - this.messageText.height / 2;

      const buttonOffset = this.needOkButton
        ? this.tutorialParam.okButtonHeight / 2
        : 0;

      const messageWidth =
        this.messageText.width + this.tutorialParam.messagePadding * 2;
      const messageHeight =
        this.messageText.height +
        this.tutorialParam.messagePadding * 2 +
        (this.needOkButton ? this.tutorialParam.okButtonHeight : 0);

      const messageRightSide = initialX + messageWidth;
      const messageBottomSide = initialY + messageHeight;

      const messageX =
        messageRightSide < gameScreen.width - 10
          ? initialX
          : this.pointerX -
            this.tutorialParam.holeRadius -
            this.tutorialParam.holeMessageSpacing -
            messageWidth;

      const messageY =
        messageBottomSide > gameScreen.height - 10
          ? initialY + gameScreen.height - 10 - messageBottomSide
          : initialY;

      this.drawMessageBackGround(
        messageX,
        messageY - this.tutorialParam.messagePadding - buttonOffset,
        messageWidth,
        messageHeight,
      );

      this.drawMessageText(
        messageX + this.tutorialParam.messagePadding,
        messageY - buttonOffset,
      );

      this.drawMessageButton(
        messageX + this.tutorialParam.messagePadding,
        messageY +
          this.messageText.height +
          this.tutorialParam.messagePadding * 2 -
          this.tutorialParam.okButtonHeight,
      );
    }
  }

  private drawMessageBackGround(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.messageBackground.clear();

    this.messageBackground
      .roundRect(x, y, width, height, 20)
      .fill("#cfcbc8")
      .stroke({ width: 4, color: "#000000" });

    this.messageBackground.eventMode = "none";
    this.messageContainer.addChild(this.messageBackground);
  }

  private drawMessageText(x: number, y: number) {
    this.messageText.position.set(x, y);
    this.messageText.eventMode = "none";
    this.messageContainer.addChild(this.messageText);
  }

  private drawMessageButton(x: number, y: number) {
    this.okButton.clear();

    if (this.needOkButton) {
      const buttonWidth = this.messageText.width;
      const buttonHeight = this.tutorialParam.okButtonHeight - 5;

      this.okButton
        .roundRect(x, y, buttonWidth, buttonHeight, 10)
        .fill("#a6a4a3")
        .stroke({
          width: 4,
          color: "#000000",
        });

      this.okText.position.set(x + buttonWidth / 2 - this.okText.width / 2, y);

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
    if (this.findTarget !== undefined && this.isActive) {
      const { x, y } = this.findTarget();

      this.pointerX = x;
      this.pointerY = y;

      this.draw();
    }

    if ((!this.showCondition() && this.visible) || this.hideCondition()) {
      this.isActive = false;
    }

    this.visible =
      this.isActive && this.showCondition() && !this.hideCondition();

    if (this.visible) {
      joystick.reset();
    }

    return this.visible;
  }
}
