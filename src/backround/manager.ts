import { Container } from "pixi.js";
import { BackgroundTile } from "./tile";

export class BackgroundManager extends Container {
  backgroundTiles = new Map<string, BackgroundTile>();

  renderDistance = 3;
  seed: number;

  chunkWidth = 1280;
  chunkHeight = 1088;

  constructor() {
    super();

    this.seed = Math.trunc(Math.random() * 250);

    this.position.set(0, 0);
  }

  update(playerX: number, playerY: number) {
    const playerChunkX = Math.floor(playerX / this.chunkWidth);
    const playerChunkY = Math.floor(playerY / this.chunkHeight);

    const requiredChunks = new Set<string>();

    for (
      let x = playerChunkX - this.renderDistance;
      x <= playerChunkX + this.renderDistance;
      x++
    ) {
      for (
        let y = playerChunkY - this.renderDistance;
        y <= playerChunkY + this.renderDistance;
        y++
      ) {
        const key = `${x}:${y}`;

        requiredChunks.add(key);

        if (!this.backgroundTiles.has(key)) {
          const tile = new BackgroundTile(x, y, this.seed);

          tile.position.set(this.chunkWidth * x, this.chunkHeight * y);

          this.backgroundTiles.set(key, tile);
          this.addChild(tile);
        }
      }
    }

    for (const [key, tile] of this.backgroundTiles) {
      if (!requiredChunks.has(key)) {
        this.removeChild(tile);
        tile.destroy();
        this.backgroundTiles.delete(key);
      }
    }
  }
}
