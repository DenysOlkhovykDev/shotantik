import { Container } from "pixi.js";

import { Island } from "@islands/island";

import { getDistance } from "@utils/basic-geometry";

class Islands extends Container {
  private islands: Island[] = [];

  addIsland(x: number, y: number) {
    const seed = Math.trunc(Math.random() * 250);
    const island = new Island(
      x - (64 * 34 + 17) / 2,
      y - ((64 - 1) * 30) / 2,
      seed,
    );
    this.islands.push(island);

    this.addChild(island);
  }

  addIslandIfItNeeded(x: number, y: number) {
    for (let i = 0; i < this.islands.length; i++) {
      const distance = getDistance(
        x,
        y,
        this.islands[i].positionX,
        this.islands[i].positionX,
      );

      if (distance < 2000) {
        return;
      }
    }

    this.addIsland(x, y);
  }
}

export const allIslands = new Islands();

allIslands.addIsland(1500, 100);
