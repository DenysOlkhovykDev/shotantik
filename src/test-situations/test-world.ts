import { type Container } from "pixi.js";
import { allIslands } from "../islands/_islands";
import { onGroundObjects } from "../on-ground/objects";

export function createTestWorld(worldLayer: Container) {
  onGroundObjects.addResearcher(1000, 100);

  if (import.meta.env.MODE !== "test") {
    worldLayer.addChild(allIslands);
  }

  worldLayer.addChild(onGroundObjects);
}
