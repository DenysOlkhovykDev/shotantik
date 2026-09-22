import { Container } from "pixi.js";
import { BackgroundTile } from "./tile";

export class BackgroundManager extends Container {
  backgroundTiles = new Map<string, BackgroundTile>();

  renderDistance = 3;
  seed: number;

  constructor() {
    super();

    this.seed = Math.trunc(Math.random() * 250);

    this.position.set(0, 0);
  }

  update(playerX: number, playerY: number) {
    const playerChunkX = Math.floor(playerX / 512);
    const playerChunkY = Math.floor(playerY / 620);

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

          tile.position.set(512 * x + 1, 620 * y + 1);

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
