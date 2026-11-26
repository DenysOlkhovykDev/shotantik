import { Container } from "pixi.js";

import { Background } from "@chunks/background";
import { Island } from "@chunks/island";

import { getValueFromCoordinates } from "@utils/basic-geometry";

export class Chunk extends Container {
  private background: Background;
  private island: Island | undefined = undefined;

  private static cellSize = 40;
  public static gridSize = 16;

  public static offsetX = Chunk.cellSize;
  public static offsetY = Math.sqrt(
    Math.pow(Chunk.offsetX, 2) - Math.pow(Chunk.offsetX / 2, 2),
  );

  private static seed = 0;

  constructor(chunkX: number, chunkY: number, seed: number) {
    super();

    Chunk.seed = seed;

    this.background = new Background(
      chunkX,
      chunkY,
      Chunk.cellSize,
      Chunk.gridSize,
      Chunk.offsetX,
      Chunk.offsetY,
      Chunk.seed,
    );

    this.addChild(this.background);

    if (Chunk.isIslandInChunk(chunkX, chunkY)) {
      this.island = new Island(
        chunkX,
        chunkY,
        Chunk.cellSize,
        Chunk.gridSize,
        Chunk.offsetX,
        Chunk.offsetY,
        Chunk.seed,
      );

      this.addChild(this.island);
    }
  }

  public static isIslandInChunk(chunkX: number, chunkY: number) {
    const isIslandInChunk = getValueFromCoordinates(chunkX, chunkY, Chunk.seed);

    return (
      isIslandInChunk <= 0.9 &&
      (Math.abs(chunkX) > 1 || Math.abs(chunkY) > 1) &&
      (chunkX !== 2 || chunkY !== 0)
    );
  }

  public isCollideWithIsland(
    rotation: number,
    aircraftX: number,
    aircraftY: number,
  ) {
    if (this.island !== undefined) {
      return this.island.isCollideWithAircraft(rotation, aircraftX, aircraftY);
    }
    return false;
  }
}
