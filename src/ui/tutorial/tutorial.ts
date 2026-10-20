import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { joystick } from "@joystick/joystick";

import { getGameScreenCenter } from "@utils/ui-config";
import { gameScreen } from "@utils/game-config";

export class Tutorial extends Container {
  private isActive = true;

  private overlay = new Graphics();

  private static tutorialParams = {
    holeRadius: 50,
    holeMessageSpacing: 10,
    borderRadius: 20,
    messagePadding: 10,
    okButtonHeight: 30,

    strokeWidth: 4,
    strokeColor: "#000000",

    threshold: 10,
  };

  private messageContainer = new Container();
  private messageBackground = new Graphics();
  private messageText = new Text({
    text: "",
    style: new TextStyle({
      fill: "#000000",
      fontSize: 32,
    }),
  });

  private okButton = new Graphics();
  private okText = new Text({
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
        .circle(
          this.pointerX,
          this.pointerY,
          Tutorial.tutorialParams.holeRadius,
        )
        .cut();

      if (import.meta.env.VITE_IS_DEBUG === "true") {
        this.overlay
          .moveTo(
            this.pointerX - 100,
            this.pointerY - Tutorial.tutorialParams.holeRadius,
          )
          .lineTo(
            this.pointerX + 100,
            this.pointerY - Tutorial.tutorialParams.holeRadius,
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
            this.pointerY + Tutorial.tutorialParams.holeRadius,
          )
          .lineTo(
            this.pointerX + 100,
            this.pointerY + Tutorial.tutorialParams.holeRadius,
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
        Tutorial.tutorialParams.holeRadius +
        Tutorial.tutorialParams.holeMessageSpacing;
      const initialY = this.pointerY - this.messageText.height / 2;

      const buttonOffset = this.needOkButton
        ? Tutorial.tutorialParams.okButtonHeight / 2
        : 0;

      const messageWidth =
        this.messageText.width + Tutorial.tutorialParams.messagePadding * 2;
      const messageHeight =
        this.messageText.height +
        Tutorial.tutorialParams.messagePadding * 2 +
        (this.needOkButton ? Tutorial.tutorialParams.okButtonHeight : 0);

      const messageRightSide = initialX + messageWidth;
      const messageBottomSide = initialY + messageHeight;

      const messageX =
        messageRightSide < gameScreen.width - Tutorial.tutorialParams.threshold
          ? initialX
          : this.pointerX -
            Tutorial.tutorialParams.holeRadius -
            Tutorial.tutorialParams.holeMessageSpacing -
            messageWidth;

      const messageY =
        messageBottomSide >
        gameScreen.height - Tutorial.tutorialParams.threshold
          ? initialY +
            gameScreen.height -
            Tutorial.tutorialParams.threshold -
            messageBottomSide
          : initialY;

      this.drawMessageBackGround(
        messageX,
        messageY - Tutorial.tutorialParams.messagePadding - buttonOffset,
        messageWidth,
        messageHeight,
      );

      this.drawMessageText(
        messageX + Tutorial.tutorialParams.messagePadding,
        messageY - buttonOffset,
      );

      this.drawMessageButton(
        messageX + Tutorial.tutorialParams.messagePadding,
        messageY +
          this.messageText.height +
          Tutorial.tutorialParams.messagePadding * 2 -
          Tutorial.tutorialParams.okButtonHeight,
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
      .roundRect(x, y, width, height, Tutorial.tutorialParams.borderRadius)
      .fill("#cfcbc8")
      .stroke({
        width: Tutorial.tutorialParams.strokeWidth,
        color: Tutorial.tutorialParams.strokeColor,
      });

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
      const buttonHeight = Tutorial.tutorialParams.okButtonHeight - 5;

      this.okButton
        .roundRect(
          x,
          y,
          buttonWidth,
          buttonHeight,
          Tutorial.tutorialParams.borderRadius -
            Tutorial.tutorialParams.messagePadding,
        )
        .fill("#a6a4a3")
        .stroke({
          width: Tutorial.tutorialParams.strokeWidth,
          color: Tutorial.tutorialParams.strokeColor,
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

      this.pointerX = x + getGameScreenCenter().x;
      this.pointerY = y + getGameScreenCenter().y;

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
