import { Container, Graphics, BlurFilter } from "pixi.js";

export class BackgroundTile extends Container {
  fogParts: Graphics[][];
  fogValues: number[][];

  constructor(scale: number, chunkX: number, chunkY: number, seed: number) {
    super();

    this.fogParts = Array.from({ length: scale }, () => []);
    this.fogValues = Array.from({ length: scale }, () => []);

    noise(this.fogValues, scale, chunkX, chunkY, seed);

    for (let i = 0; i < scale; i++) {
      for (let j = 0; j < scale; j++) {
        this.fogParts[i][j] = new Graphics();

        this.fogParts[i][j]
          .circle(i * (2500 / scale), j * (2500 / scale), 1800 / scale)
          .fill({
            color: makeBrighterColor("#777a79", this.fogValues[i][j]),
            alpha: 1,
          });

        this.fogParts[i][j].filters = [
          new BlurFilter({
            strength: 17,
          }),
        ];

        this.addChild(this.fogParts[i][j]);
      }
    }
  }
}

function noise(
  array: number[][],
  scale: number,
  chunkX: number,
  chunkY: number,
  seed: number,
) {
  const size = scale;
  const step = 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const globalX = chunkX * size + x;
      const globalY = chunkY * size + y;

      const gx = Math.floor(globalX / step);
      const gy = Math.floor(globalY / step);

      const tx = (globalX % step) / step;
      const ty = (globalY % step) / step;

      const topLeft = random2D(gx, gy, seed);
      const topRight = random2D(gx + 1, gy, seed);

      const bottomLeft = random2D(gx, gy + 1, seed);
      const bottomRight = random2D(gx + 1, gy + 1, seed);

      const top = topLeft + (topRight - topLeft) * tx;

      const bottom = bottomLeft + (bottomRight - bottomLeft) * tx;

      const value = top + (bottom - top) * ty;

      array[y][x] = 75 + value * 50;
    }
  }
}

function makeBrighterColor(color: string, variation: number): string {
  const value = parseInt(color.slice(1), 16);

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  const newR = Math.max(0, Math.min(255, r + variation));
  const newG = Math.max(0, Math.min(255, g + variation));
  const newB = Math.max(0, Math.min(255, b + variation));

  return `#${((newR << 16) | (newG << 8) | newB)
    .toString(16)
    .padStart(6, "0")}`;
}

function random2D(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

  return value - Math.floor(value);
}
