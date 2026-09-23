import { makeBrighterColor } from "@utils/basic-graphic";
import { Container, Graphics } from "pixi.js";

export class BackgroundTile extends Container {
  fogParts: Graphics;
  fogValues: number[][];

  cellSize = 32;
  backgroundSize = 32;

  constructor(
    public chunkX: number,
    public chunkY: number,
    seed: number,
  ) {
    super();

    this.fogParts = new Graphics();
    this.fogValues = Array.from({ length: this.backgroundSize / 4 }, () =>
      Array(this.backgroundSize).fill(0),
    );

    this.generateNoise(
      this.fogValues,
      this.backgroundSize,
      chunkX,
      chunkY,
      seed,
    );

    for (let x = 0; x < this.backgroundSize / 4; x++) {
      for (let y = 0; y < this.backgroundSize; y++) {
        if (this.fogValues[x][y] < 110) {
          const newX = x * this.cellSize * 2;
          const newY = (y * this.cellSize) / 1.65;
          if (y % 2 === 0) {
            this.fogParts
              .moveTo(newX - 10, newY - 18)
              .lineTo(newX + 10, newY - 18)
              .lineTo(newX + 20, newY)
              .lineTo(newX + 10, newY + 18)
              .lineTo(newX - 10, newY + 18)
              .lineTo(newX - 20, newY)
              .closePath()
              .fill({
                color: makeBrighterColor("#777a79", this.fogValues[x][y]),
                alpha: 0.35,
              });
          } else {
            this.fogParts
              .moveTo(newX + this.cellSize - 10, newY - 18)
              .lineTo(newX + this.cellSize + 10, newY - 18)
              .lineTo(newX + this.cellSize + 20, newY)
              .lineTo(newX + this.cellSize + 10, newY + 18)
              .lineTo(newX + this.cellSize - 10, newY + 18)
              .lineTo(newX + this.cellSize - 20, newY)
              .closePath()
              .fill({
                color: makeBrighterColor("#777a79", this.fogValues[x][y]),
                alpha: 0.35,
              });
          }
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

    for (let x = 0; x < size / 4; x++) {
      for (let y = 0; y < size; y++) {
        const globalX = (chunkX * size) / 4 + x;
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

        array[x][y] = 20 + sharpValue * 150;
      }
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
