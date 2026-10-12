import { type Container } from "pixi.js";
import { allIslands } from "../islands/_islands";
import { onGroundObjects } from "../on-ground/objects";
import { type WorldObjects } from "./test-situation";

export function createTestWorld(
  worldLayer: Container,
  worldObjects?: WorldObjects,
) {
  for (const object of worldObjects?.researchPoints || []) {
    onGroundObjects.addResearcher(object.x, object.y);
  }

  if (import.meta.env.MODE !== "test") {
    worldLayer.addChild(allIslands);
  }

  worldLayer.addChild(onGroundObjects);
}
