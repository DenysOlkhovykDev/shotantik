import { Container, Graphics } from "pixi.js";
import { allIslands } from "../islands/_islands";

export function createTestWorld(worldLayer: Container) {
  const testCircle = new Graphics();

  testCircle
    .circle(1000, 100, 10)
    .stroke({ width: 4, color: "#000000" })
    .fill("#00ff00");

  if (import.meta.env.MODE !== "test") {
    worldLayer.addChild(allIslands);
  }

  worldLayer.addChild(testCircle);
}
