import { drawHex, makeBrighterColor } from "@utils/basic-graphic";
import { Container, Graphics } from "pixi.js";

export class BackgroundTile extends Container {
  fogParts: Graphics;
  fogValues: number[][];

  cellSize = 40;
  backgroundSize = 32;

  constructor(
    public chunkX: number,
    public chunkY: number,
    seed: number,
  ) {
    super();

    this.fogParts = new Graphics();
    this.fogValues = Array.from({ length: this.backgroundSize }, () =>
      Array(this.backgroundSize).fill(0),
    );

    this.generateNoise(
      this.fogValues,
      this.backgroundSize,
      chunkX,
      chunkY,
      seed,
    );

    for (let x = 0; x < this.backgroundSize; x++) {
      for (let y = 0; y < this.backgroundSize; y++) {
        if (this.fogValues[x][y] < 110) {
          let newX = 0;
          const newY = y * 34;

          if (y % 2 === 0) {
            newX = x * this.cellSize;
          } else {
            newX = x * this.cellSize + this.cellSize / 2;
          }

          drawHex(this.fogParts, newX, newY, 20);
          this.fogParts.fill({
            color: makeBrighterColor("#777a79", this.fogValues[x][y]),
            alpha: 0.35,
          });
        }
      }
    }

    this.addChild(this.fogParts);
  }

  generateNoise(
    array: number[][],
    size: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 18;
    const sharpness = 1;

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

        const value = top + (bottom - top) * ty;

        const sharpValue =
          value < sharpness
            ? value * sharpness
            : sharpness + (value - sharpness) * 2;

        array[x][y] = 10 + sharpValue * 150;
      }
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
