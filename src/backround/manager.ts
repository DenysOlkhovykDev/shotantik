import { Container } from "pixi.js";
import { BackgroundTile } from "./tile";

class BackgroundManager extends Container {
  backgroundTiles: BackgroundTile[] = [];

  constructor() {
    super();
    const seed = Math.trunc(Math.random() * 25);

    for (let x = -2; x < 5; x++) {
      for (let y = -2; y < 5; y++) {
        this.backgroundTiles.push(new BackgroundTile(x, y, seed));
      }
    }

    for (let i = 0; i < this.backgroundTiles.length; i++) {
      this.backgroundTiles[i].position.set(
        512 * this.backgroundTiles[i].chunkX,
        620 * this.backgroundTiles[i].chunkY,
      );
    }

    this.addChild(...this.backgroundTiles);

    this.position.set(0, 0);
  }
}

export const backgroundManager = new BackgroundManager();
