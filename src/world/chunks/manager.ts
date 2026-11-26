import { Container } from "pixi.js";

import { Chunk } from "@chunks/chunk";

export class ChunkManager extends Container {
  private chunks = new Map<string, Chunk>();

  private renderDistance = 3;

  public chunkWidth: number;
  public chunkHeight: number;

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

  public update(playerX: number, playerY: number) {
    const { x: playerChunkX, y: playerChunkY } = this.getChunkCoordinates(
      playerX - this.chunkWidth / 2,
      playerY - this.chunkHeight / 2,
    );

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

    for (const [key, chunk] of this.chunks) {
      if (!requiredChunks.has(key)) {
        this.removeChild(chunk);
        chunk.destroy();
        this.chunks.delete(key);
      }
    }
  }

  public createNextChunk() {
    const chunkToCreate = this.chunksToCreate.shift();

    if (!chunkToCreate) {
      return;
    }

    const [x, y, key] = chunkToCreate;

    if (this.chunks.has(key)) {
      this.pendingChunks.delete(key);
      return;
    }

    const chunk = new Chunk(x, y, this.seed);

    chunk.position.set(this.chunkWidth * x, this.chunkHeight * y);

    this.chunks.set(key, chunk);
    this.addChild(chunk);

    this.pendingChunks.delete(key);
  }

  public checkCollision(
    rotation: number,
    aircraftX: number,
    aircraftY: number,
  ) {
    for (const chunk of this.chunks) {
      const result = chunk[1].isCollideWithIsland(
        rotation,
        aircraftX,
        aircraftY,
      );

      if (result) {
        return result;
      }
    }
    return false;
  }

  public getChunkCoordinates(x: number, y: number) {
    return {
      x: Math.floor(x / this.chunkWidth),
      y: Math.floor(y / this.chunkHeight),
    };
  }
}
