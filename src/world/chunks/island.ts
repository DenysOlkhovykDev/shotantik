import {
  Container,
  Particle,
  Rectangle,
  ParticleContainer,
  Texture,
} from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

import { generateHexTexture, makeBrighterColor } from "@utils/basic-graphic";

export class Island extends Container {
  private static tileTexture: Texture;

  private static tilesColors = {
    beach: "#d6cc71",
    plains: "#1b9d1c",
    heels: "#504e4e",
    peaks: "#ffffff",
  };

  private tilesContainer = new ParticleContainer({
    dynamicProperties: {
      position: false,
      vertex: false,
      rotation: false,
      color: false,
    },
  });

  private basicShadowFilter = new DropShadowFilter({
    color: "#000000",
    alpha: 0.5,
    offset: { x: 0, y: 0 },
  });

  private tilesValues: number[][];

  constructor(
    chunkX: number,
    chunkY: number,
    cellSize: number,
    gridSize: number,
    offsetX: number,
    offsetY: number,
    seed: number,
  ) {
    super();

    this.tilesContainer.boundsArea = new Rectangle(
      0,
      0,
      gridSize * offsetX + offsetX / 2,
      gridSize * offsetY,
    );

    if (!Island.tileTexture) {
      Island.tileTexture = generateHexTexture((cellSize + 8) / 2);
    }

    this.tilesValues = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0),
    );

    this.generateNoise(gridSize, chunkX, chunkY, seed);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const value = this.tilesValues[x][y];

        if (value > 1) {
          const tileY = y * offsetY;
          const tileX = x * offsetX + (y % 2 === 0 ? 0 : offsetX / 2);

          const tile = new Particle({
            texture: Island.tileTexture,
            x: tileX,
            y: tileY,
            anchorX: 0.5,
            anchorY: 0.5,
          });

          const colorModifier = Math.trunc((value % 0.5) * 70);

          let tint = makeBrighterColor(Island.tilesColors.beach, colorModifier);

          if (value < 2) {
            tint = makeBrighterColor(Island.tilesColors.beach, colorModifier);
          } else if (value < 3) {
            tint = makeBrighterColor(Island.tilesColors.plains, colorModifier);
          } else if (value < 4) {
            tint = makeBrighterColor(Island.tilesColors.heels, colorModifier);
          } else if (value < 5) {
            tint = makeBrighterColor(Island.tilesColors.peaks, colorModifier);
          }

          tile.tint = tint;
          this.tilesContainer.addParticle(tile);
        }
      }
    }

    this.tilesContainer.update();
    this.addChild(this.tilesContainer);
    this.filters = this.basicShadowFilter;
  }

  generateNoise(
    gridSize: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 10;

    const maxAmplitude = 0.5;

    const centerX =
      (gridSize - 1) / 2 +
      (this.getValueFromCoordinates(chunkX, chunkY, seed) - 0.5) *
        gridSize *
        maxAmplitude;
    const centerY =
      (gridSize - 1) / 2 +
      (this.getValueFromCoordinates(chunkX + 100, chunkY + 100, seed) - 0.5) *
        gridSize *
        maxAmplitude;

    const radius = gridSize * 0.38;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const globalX = chunkX * gridSize + x;
        const globalY = chunkY * gridSize + y;

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

        this.tilesValues[x][y] = value * 5;
      }
    }
  }

  getValueFromCoordinates(x: number, y: number, seed: number) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

    return value - Math.floor(value);
  }
}
