import { Container } from "pixi.js";
import { BackgroundTile } from "./tile";

export class BackgroundManager extends Container {
  backgroundTiles = new Map<string, BackgroundTile>();

  renderDistance = 2;

  seed: number;

  chunkWidth = 640;
  chunkHeight = 544;

  chunksToCreate: [number, number, string][] = [];
  pendingChunks = new Set<string>();

  constructor() {
    super();

    this.seed = Math.trunc(Math.random() * 250);
    this.position.set(-this.chunkWidth / 2, -this.chunkHeight / 2);
  }

  update(playerX: number, playerY: number) {
    const playerChunkX = Math.floor(playerX / this.chunkWidth);
    const playerChunkY = Math.floor(playerY / this.chunkHeight);

    const requiredChunks = new Set<string>();

    const newChunks: [number, number, string][] = [];

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

        if (!this.backgroundTiles.has(key) && !this.pendingChunks.has(key)) {
          this.pendingChunks.add(key);

          newChunks.push([x, y, key]);
        }
      }
    }

    newChunks.sort((a, b) => {
      const distanceA =
        Math.abs(a[0] - playerChunkX) + Math.abs(a[1] - playerChunkY);

      const distanceB =
        Math.abs(b[0] - playerChunkX) + Math.abs(b[1] - playerChunkY);

      return distanceA - distanceB;
    });

    this.chunksToCreate.push(...newChunks);

    for (const [key, tile] of this.backgroundTiles) {
      if (!requiredChunks.has(key)) {
        this.removeChild(tile);
        tile.destroy();
        this.backgroundTiles.delete(key);
      }
    }
  }

  createNextChunk() {
    const chunk = this.chunksToCreate.shift();

    if (!chunk) {
      return;
    }

    const [x, y, key] = chunk;

    if (this.backgroundTiles.has(key)) {
      this.pendingChunks.delete(key);
      return;
    }

    const tile = new BackgroundTile(x, y, this.seed);

    tile.position.set(this.chunkWidth * x, this.chunkHeight * y);

    this.backgroundTiles.set(key, tile);
    this.addChild(tile);

    this.pendingChunks.delete(key);
  }
}
