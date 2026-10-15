import { drawHex, makeBrighterColor } from "@utils/basic-graphic";
import { Container, Graphics } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

export class Island extends Container {
  private beach: Graphics;
  private plains: Graphics;
  private heels: Graphics;
  private peaks: Graphics;

  private islandValues: number[][];

  private static backgroundSize = 64;
  private static cellSize = 40;

  private static tilesColors = {
    beach: "#d6cc71",
    plains: "#1b9d1c",
    heels: "#504e4e",
    peaks: "#ffffff",
  };

  private basicShadowFilter = new DropShadowFilter({
    color: "#000000",
    alpha: 0.5,
    offset: { x: 0, y: 0 },
  });

  constructor(
    public positionX: number,
    public positionY: number,
    seed: number,
  ) {
    super();

    this.beach = new Graphics();
    this.plains = new Graphics();
    this.heels = new Graphics();
    this.peaks = new Graphics();
    this.islandValues = Array.from({ length: Island.backgroundSize }, () =>
      Array(Island.backgroundSize).fill(0),
    );

    this.generateNoise(
      this.islandValues,
      Island.backgroundSize,
      positionX,
      positionY,
      seed,
    );

    for (let x = 0; x < Island.backgroundSize; x++) {
      for (let y = 0; y < Island.backgroundSize; y++) {
        const value = this.islandValues[x][y];
        let newX;
        if (y % 2 === 0) {
          newX = x * 34 + positionX;
        } else {
          newX = x * 34 + positionX + 17;
        }
        const newY = y * 30 + positionY;

        const colorModifier = Math.trunc(Math.random() * 50);

        if (value < 1) {
          // skip
        } else if (value < 2) {
          drawHex(this.beach, newX, newY, Island.cellSize / 2);
          this.beach.fill(
            makeBrighterColor(Island.tilesColors.beach, colorModifier),
          );
        } else if (value < 3) {
          drawHex(this.plains, newX, newY, Island.cellSize / 2);
          this.plains.fill(
            makeBrighterColor(Island.tilesColors.plains, colorModifier),
          );
        } else if (value < 4) {
          drawHex(this.heels, newX, newY, Island.cellSize / 2);
          this.heels.fill(
            makeBrighterColor(Island.tilesColors.heels, colorModifier),
          );
        } else if (value < 5) {
          drawHex(this.peaks, newX, newY, Island.cellSize / 2);
          this.peaks.fill(
            makeBrighterColor(Island.tilesColors.peaks, colorModifier),
          );
        }
      }
    }

    this.addChild(this.beach);
    this.addChild(this.plains);
    this.addChild(this.heels);
    this.addChild(this.peaks);
    this.filters = this.basicShadowFilter;
  }

  generateNoise(
    array: number[][],
    size: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 10;

    const centerX = (size - 1) / 2;
    const centerY = (size - 1) / 2;

    const radius = size * 0.68;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const globalX = chunkX * size + x;
        const globalY = chunkY * size + y;

        const gx = Math.floor(globalX / step);
        const gy = Math.floor(globalY / step);

        const tx = (globalX - gx * step) / step;
        const ty = (globalY - gy * step) / step;

        const topLeft = this.getValueFromCoordinates(gx, gy, seed);
        const topRight = this.getValueFromCoordinates(gx + 1, gy, seed);

        const bottomLeft = this.getValueFromCoordinates(gx, gy + 1, seed);
        const bottomRight = this.getValueFromCoordinates(gx + 1, gy + 1, seed);

        const top = topLeft + (topRight - topLeft) * tx;
        const bottom = bottomLeft + (bottomRight - bottomLeft) * tx;

        const noise = top + (bottom - top) * ty;
        const distance = Math.hypot(x - centerX, y - centerY);

        const islandMask = Math.max(0, 1 - distance / radius);

        const smoothMask = islandMask * islandMask * (3 - 2 * islandMask);

        const value = noise * smoothMask;

        array[x][y] = value * 5;
      }
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
