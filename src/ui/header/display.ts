import { Container, Text, TextStyle } from "pixi.js";

export class Display extends Container {
  text = new Text({
    text: "",
    style: new TextStyle({
      fill: "#000000",
      fontSize: 28,
    }),
  });

  constructor(text: string) {
    super();

    this.addChild(this.text);
  }

  showText(text: string) {
    this.visible = true;
    this.text.text = text;
    this.text.position.set(-this.text.width / 2, 0);
  }

  hideText() {
    this.visible = false;
  }
}
