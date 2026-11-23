import { Container, Particle, ParticleContainer, Texture } from "pixi.js";

import { generateHexTexture, makeBrighterColor } from "@utils/basic-graphic";
import {
  getValueFromCoordinates,
  transformCoordinatesByHexOddRows,
} from "@utils/basic-geometry";

export class Background extends Container {
  private static tileTexture: Texture;

  private static baseTileColor = "#a2a5a4";

  private tilesContainer = new ParticleContainer({
    dynamicProperties: {
      position: false,
      vertex: false,
      rotation: false,
      color: false,
    },
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

    if (!Background.tileTexture) {
      Background.tileTexture = generateHexTexture(cellSize / 2);
    }

    this.tilesValues = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0),
    );

    this.generateNoise(gridSize, chunkX, chunkY, seed);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (this.tilesValues[y][x] >= 72) {
          continue;
        }

        const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
          x,
          y,
          offsetX,
          offsetY,
        );

        const tile = new Particle({
          texture: Background.tileTexture,
          x: tileX,
          y: tileY,
          anchorX: 0.5,
          anchorY: 0.5,
        });

        let color = Background.baseTileColor;

        if (
          import.meta.env.VITE_IS_DEBUG === "true" &&
          (x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1)
        ) {
          color = "#ff0000";
        }

        const tint = makeBrighterColor(color, this.tilesValues[y][x]);
        tile.tint = tint;

        this.tilesContainer.addParticle(tile);
      }
    }

    this.tilesContainer.update();
    this.addChild(this.tilesContainer);
  }

  private generateNoise(
    gridSize: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 12;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const globalX = chunkX * gridSize + x;
        const globalY = chunkY * gridSize + y;

        const gx = Math.floor(globalX / step);
        const gy = Math.floor(globalY / step);

        const tx = (globalX - gx * step) / step;
        const ty = (globalY - gy * step) / step;

        const topLeft = getValueFromCoordinates(gx, gy, seed);
        const topRight = getValueFromCoordinates(gx + 1, gy, seed);

        const bottomLeft = getValueFromCoordinates(gx, gy + 1, seed);
        const bottomRight = getValueFromCoordinates(gx + 1, gy + 1, seed);

        const top = topLeft + (topRight - topLeft) * tx;
        const bottom = bottomLeft + (bottomRight - bottomLeft) * tx;

        const value = top + (bottom - top) * ty;

        this.tilesValues[y][x] = 40 + value * 55;
      }
    }
  }
}
