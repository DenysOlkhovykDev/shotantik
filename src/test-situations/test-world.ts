import { Container, Graphics } from "pixi.js";
import { backgroundManager } from "../backround/manager";

export function createTestWorld(worldLayer: Container) {
  worldLayer.addChild(backgroundManager);

  const testCircle = new Graphics();

  testCircle
    .circle(1000, 100, 10)
    .stroke({ width: 4, color: "#000000" })
    .fill("#00ff00");

  worldLayer.addChild(testCircle);
}
