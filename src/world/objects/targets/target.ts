import { Container, Graphics } from "pixi.js";

export class Target extends Container {
  constructor() {
    super();

    const button = new Graphics();

    button.circle(0, 0, 40).stroke({ width: 4, color: "#ff0000" });
    button.circle(0, 0, 30).stroke({ width: 4, color: "#ff0000" });
    button.circle(0, 0, 10).stroke({ width: 4, color: "#ff0000" });

    button
      .moveTo(0, -50)
      .lineTo(0, -20)
      .moveTo(0, 50)
      .lineTo(0, 20)
      .moveTo(-50, 0)
      .lineTo(-20, 0)
      .moveTo(50, 0)
      .lineTo(20, 0)
      .stroke({ width: 4, color: "#ff0000" });

    this.addChild(button);
  }
}
