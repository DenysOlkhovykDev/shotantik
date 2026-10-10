import { drawHex, makeBrighterColor } from "@utils/basic-graphic";
import {
  Container,
  Graphics,
  Particle,
  ParticleContainer,
  type Renderer,
  type Texture,
} from "pixi.js";

export class BackgroundTile extends Container {
  static hexTexture: Texture;

  static cellSize = 40;
  static gridSize = 16;

  fogContainer: ParticleContainer;
  fogValues: number[][];

  static initialize(renderer: Renderer) {
    const graphics = new Graphics();

    drawHex(graphics, 20, 20, BackgroundTile.cellSize / 2);
    graphics.fill({ color: "#ffffff" });

    this.hexTexture = renderer.generateTexture(graphics);

    graphics.destroy();
  }

  constructor(
    public chunkX: number,
    public chunkY: number,
    seed: number,
  ) {
    super();

    this.fogContainer = new ParticleContainer({
      dynamicProperties: {
        position: false,
        vertex: false,
        rotation: false,
        color: false,
      },
    });

    this.fogValues = Array.from({ length: BackgroundTile.gridSize }, () =>
      Array(BackgroundTile.gridSize).fill(0),
    );

    this.generateNoise(
      this.fogValues,
      BackgroundTile.gridSize,
      chunkX,
      chunkY,
      seed,
    );

    for (let x = 0; x < BackgroundTile.gridSize; x++) {
      for (let y = 0; y < BackgroundTile.gridSize; y++) {
        if (this.fogValues[x][y] >= 72) {
          continue;
        }

        const newY = y * 34;
        const newX =
          x * BackgroundTile.cellSize +
          (y % 2 === 0 ? 0 : BackgroundTile.cellSize / 2);

        let color = "#a2a5a4";

        if (
          import.meta.env.VITE_IS_DEBUG === "true" &&
          (x === 0 ||
            y === 0 ||
            x === BackgroundTile.gridSize - 1 ||
            y === BackgroundTile.gridSize - 1)
        ) {
          color = "#ff0000";
        }

        const tint = makeBrighterColor(color, this.fogValues[x][y]);
        const hex = new Particle({
          texture: BackgroundTile.hexTexture,
          x: newX,
          y: newY,
          anchorX: 0.5,
          anchorY: 0.5,
        });

        hex.tint = tint;

        this.fogContainer.addParticle(hex);
      }
    }

    this.fogContainer.update();
    this.addChild(this.fogContainer);
  }

  generateNoise(
    array: number[][],
    size: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 12;

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

        array[x][y] = 40 + value * 55;
      }
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
