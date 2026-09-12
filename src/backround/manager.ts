import { Container } from "pixi.js";
import { BackgroundTile } from "./tile";

class BackgroundManager extends Container {
  backgroundTiles1: BackgroundTile;
  backgroundTiles2: BackgroundTile;
  backgroundTiles3: BackgroundTile;

  constructor() {
    super();
    const seed = Math.trunc(Math.random() * 25);
    this.backgroundTiles1 = new BackgroundTile(32, 0, 0, seed);
    this.backgroundTiles2 = new BackgroundTile(32, 1, 0, seed);
    this.backgroundTiles3 = new BackgroundTile(32, 2, 0, seed);
    this.addChild(this.backgroundTiles1);
    this.addChild(this.backgroundTiles2);
    this.addChild(this.backgroundTiles3);
    this.backgroundTiles1.position.set(-250, -200);
    this.backgroundTiles2.position.set(-300, 6000);
    this.backgroundTiles3.position.set(-300, 15000);
    this.position.set(0, -300);
  }
}

export const backgroundManager = new BackgroundManager();
