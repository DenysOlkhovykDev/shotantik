import { type Container } from "pixi.js";
import { allIslands } from "../islands/_islands";
import { Researcher } from "@aircraft/modules/researcher";

export function createTestWorld(worldLayer: Container) {
  const researcher = new Researcher(1000, 100);

  if (import.meta.env.MODE !== "test") {
    worldLayer.addChild(allIslands);
  }

  worldLayer.addChild(researcher.root);
}
