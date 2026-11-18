import { Container } from "pixi.js";
import { Target } from "./target";

class TargetsManager extends Container {
  constructor() {
    super();
  }

  addTarget(x: number, y: number) {
    const target = new Target();

    target.position.set(x, y);

    this.addChild(target);

    return target;
  }

  removeTarget(target: Target) {
    this.removeChild(target);
  }
}

export const targetsManager = new TargetsManager();
