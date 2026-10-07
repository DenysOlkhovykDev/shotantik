import { Container } from "pixi.js";
import { Island } from "./island";
import { getDistance } from "@utils/basic-geometry";

class Islands extends Container {
  islands: Island[] = [];

  addIsland(x: number, y: number) {
    const seed = Math.trunc(Math.random() * 250);
    const isla = new Island(x, y, seed);

    this.islands.push(isla);

    this.addChild(isla);
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

allIslands.addIsland(300, -500);
