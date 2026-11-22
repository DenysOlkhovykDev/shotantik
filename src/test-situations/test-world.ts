import { Container } from "pixi.js";

import { onGroundObjects } from "@objects/research-points";

import { WorldObjects } from "@test-situations/test-situation";

export function createTestWorld(
  worldLayer: Container,
  worldObjects?: WorldObjects,
) {
  for (const object of worldObjects?.researchPoints || []) {
    onGroundObjects.addResearcher(object.x, object.y);
  }

  worldLayer.addChild(onGroundObjects);
}
