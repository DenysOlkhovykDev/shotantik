import { type Container } from "pixi.js";

import { allIslands } from "@islands/all-islands";
import { onGroundObjects } from "@objects/research-points/research-points";

import { type WorldObjects } from "@test-situations/test-situation";

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
