import { Container } from "pixi.js";
import { Island } from "./island";

class Islands extends Container {
  islands: Island[] = [];

  addIsland(x: number, y: number) {
    const seed = Math.trunc(Math.random() * 250);
    const isla = new Island(x, y, seed);

    this.islands.push(isla);

    this.addChild(isla);
  }
}

export const allIslands = new Islands();

allIslands.addIsland(300, -500);
