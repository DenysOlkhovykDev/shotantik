import { Container } from "pixi.js";
import { Chunk } from "./chunk";

export class ChunkManager extends Container {
  private chunks = new Map<string, Chunk>();

  private renderDistance = 3;

  private chunkWidth: number;
  private chunkHeight: number;

  private seed: number;

  private chunksToCreate: [number, number, string][] = [];
  private pendingChunks = new Set<string>();

  constructor() {
    super();

    this.chunkWidth = Chunk.offsetX * Chunk.gridSize;
    this.chunkHeight = Chunk.offsetY * Chunk.gridSize;

    this.seed = Math.trunc(Math.random() * 250);
    this.position.set(-this.chunkWidth / 2, -this.chunkHeight / 2);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const key = `${x}:${y}`;

        const chunk = new Chunk(x, y, this.seed);

        chunk.position.set(this.chunkWidth * x, this.chunkHeight * y);

        this.chunks.set(key, chunk);
        this.addChild(chunk);
      }
    }
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

        if (!this.chunks.has(key) && !this.pendingChunks.has(key)) {
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

    for (const [key, tile] of this.chunks) {
      if (!requiredChunks.has(key)) {
        this.removeChild(tile);
        tile.destroy();
        this.chunks.delete(key);
      }
    }
  }

  createNextChunk() {
    const chunk = this.chunksToCreate.shift();

    if (!chunk) {
      return;
    }

    const [x, y, key] = chunk;

    if (this.chunks.has(key)) {
      this.pendingChunks.delete(key);
      return;
    }

    const tile = new Chunk(x, y, this.seed);

    tile.position.set(this.chunkWidth * x, this.chunkHeight * y);

    this.chunks.set(key, tile);
    this.addChild(tile);

    this.pendingChunks.delete(key);
  }
}
