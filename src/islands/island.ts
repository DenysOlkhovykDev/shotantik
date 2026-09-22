import { makeBrighterColor } from "@utils/basic-graphic";
import { Container, Graphics } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

export class Island extends Container {
  beach: Graphics;
  plains: Graphics;
  heels: Graphics;
  peaks: Graphics;

  islandValues: number[][];

  cellSize = 40;
  backgroundSize = 64;

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
    this.islandValues = Array.from({ length: this.backgroundSize }, () =>
      Array(this.backgroundSize).fill(0),
    );

    this.generateNoise(
      this.islandValues,
      this.backgroundSize,
      positionX,
      positionY,
      seed,
    );

    for (let x = 0; x < this.backgroundSize; x++) {
      for (let y = 0; y < this.backgroundSize; y++) {
        const value = this.islandValues[x][y];
        let newX = 0;
        if (y % 2 === 0) {
          newX = x * this.cellSize + positionX;
        } else {
          newX = x * this.cellSize + positionX + this.cellSize / 2;
        }
        const newY = y * (this.cellSize - this.cellSize / 4) + positionY;

        const colorModifier = Math.trunc(Math.random() * 50);

        if (value < 1) {
          // skip
        } else if (value < 2) {
          this.drawHex(this.beach, newX, newY);
          this.beach.fill(makeBrighterColor("#d6cc71", colorModifier));
        } else if (value < 3) {
          this.drawHex(this.plains, newX, newY);
          this.plains.fill(makeBrighterColor("#1b9d1c", colorModifier));
        } else if (value < 4) {
          this.drawHex(this.heels, newX, newY);
          this.heels.fill(makeBrighterColor("#504e4e", colorModifier));
        } else if (value < 5) {
          this.drawHex(this.peaks, newX, newY);
          this.peaks.fill(makeBrighterColor("#ffffff", colorModifier));
        }
      }
    }

    this.addChild(this.beach);
    this.addChild(this.plains);
    this.addChild(this.heels);
    this.addChild(this.peaks);
    this.filters = this.basicShadowFilter;
  }

  drawHex(graphic: Graphics, x: number, y: number) {
    graphic
      .moveTo(x, y - this.cellSize / 2)
      .lineTo(x + this.cellSize / 2, y - this.cellSize / 4)
      .lineTo(x + this.cellSize / 2, y + this.cellSize / 4)
      .lineTo(x, y + this.cellSize / 2)
      .lineTo(x - this.cellSize / 2, y + this.cellSize / 4)
      .lineTo(x - this.cellSize / 2, y - this.cellSize / 4)
      .closePath();
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

        // Відстань від центру chunk
        const distance = Math.hypot(x - centerX, y - centerY);

        // Маска острова
        const islandMask = Math.max(0, 1 - distance / radius);

        // Робимо край острова плавним
        const smoothMask = islandMask * islandMask * (3 - 2 * islandMask);

        // Noise + форма острова
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
