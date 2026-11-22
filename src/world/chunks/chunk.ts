import { Container } from "pixi.js";
import { Background } from "./background";
import { Island } from "./island";

export class Chunk extends Container {
  private background: Background;
  private island: Island | undefined = undefined;

  private static cellSize = 40;
  public static gridSize = 16;

  public static offsetX = Chunk.cellSize;
  public static offsetY = Math.sqrt(
    Math.pow(Chunk.offsetX, 2) - Math.pow(Chunk.offsetX / 2, 2),
  );

  constructor(chunkX: number, chunkY: number, seed: number) {
    super();

    this.background = new Background(
      chunkX,
      chunkY,
      Chunk.cellSize,
      Chunk.gridSize,
      Chunk.offsetX,
      Chunk.offsetY,
      seed,
    );

    this.addChild(this.background);

    const isIslandInChunk = this.getValueFromCoordinates(chunkX, chunkY, seed);

    if (isIslandInChunk <= 0.6 && chunkX !== 0 && chunkY !== 0) {
      this.island = new Island(
        chunkX,
        chunkY,
        Chunk.cellSize,
        Chunk.gridSize,
        Chunk.offsetX,
        Chunk.offsetY,
        seed,
      );

      this.addChild(this.island);
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
