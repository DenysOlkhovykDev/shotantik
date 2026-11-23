import {
  Container,
  Particle,
  Rectangle,
  ParticleContainer,
  Texture,
  Graphics,
} from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

import { generateHexTexture, makeBrighterColor } from "@utils/basic-graphic";
import {
  getValueFromCoordinates,
  transformCoordinatesByHexOddRows,
} from "@utils/basic-geometry";

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

  public mainColliderX = 0;
  public mainColliderY = 0;
  public mainColliderRadius = 0;
  public colliders: { y: number; x: number }[] = [];

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

    this.setColliders(gridSize);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const value = this.tilesValues[y][x];

        if (value > 1) {
          const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
            x,
            y,
            offsetX,
            offsetY,
          );

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

    if (import.meta.env.VITE_IS_DEBUG === "true") {
      for (let i = 0; i < this.colliders.length; i++) {
        const graphic = new Graphics();

        const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
          this.colliders[i].x,
          this.colliders[i].y,
          offsetX,
          offsetY,
        );

        graphic
          .circle(tileX, tileY, cellSize / 2)
          .stroke({ width: 4, color: "#ff0000" });
        this.addChild(graphic);
      }

      const graphic = new Graphics();

      const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
        this.mainColliderX,
        this.mainColliderY,
        offsetX,
        offsetY,
      );

      graphic
        .circle(tileX, tileY, 5)
        .circle(tileX, tileY, this.mainColliderRadius * cellSize)
        .stroke({ width: 4, color: "#ff0000" });
      this.addChild(graphic);
    }
  }

  private generateNoise(
    gridSize: number,
    chunkX: number,
    chunkY: number,
    seed: number,
  ) {
    const step = 10;

    const maxAmplitude = 0.5;

    const centerX =
      (gridSize - 1) / 2 +
      (getValueFromCoordinates(chunkX, chunkY, seed) - 0.5) *
        gridSize *
        maxAmplitude;
    const centerY =
      (gridSize - 1) / 2 +
      (getValueFromCoordinates(chunkX + 100, chunkY + 100, seed) - 0.5) *
        gridSize *
        maxAmplitude;

    const radius = gridSize * 0.38;

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

        const noise = top + (bottom - top) * ty;
        const distance = Math.hypot(x - centerX, y - centerY);

        const islandMask = Math.max(0, 1 - distance / radius);

        const smoothMask = islandMask * islandMask * (3 - 2 * islandMask);

        const value = noise * smoothMask;

        this.tilesValues[y][x] = value * 5;

        if (this.tilesValues[y][x] < 1) {
          this.tilesValues[y][x] = 0;
        }
      }
    }
  }

  private setColliders(gridSize: number) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (this.tilesValues[y][x] <= 0) continue;

        const isOdd = y % 2 !== 0;

        const neighbors = isOdd
          ? [
              [x - 1, y],
              [x + 1, y],
              [x, y - 1],
              [x + 1, y - 1],
              [x, y + 1],
              [x + 1, y + 1],
            ]
          : [
              [x - 1, y],
              [x + 1, y],
              [x - 1, y - 1],
              [x, y - 1],
              [x - 1, y + 1],
              [x, y + 1],
            ];

        const isEdge = neighbors.some(([nx, ny]) => {
          if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) {
            return true;
          }

          return this.tilesValues[ny][nx] <= 0;
        });

        if (isEdge) {
          this.colliders.push({ x, y });

          if (minX > x) {
            minX = x;
          }
          if (maxX < x) {
            maxX = x;
          }
          if (minY > y) {
            minY = y;
          }
          if (maxY < y) {
            maxY = y;
          }
        }
      }
    }

    if (
      minX !== Infinity &&
      minY !== Infinity &&
      maxX !== -Infinity &&
      maxY !== -Infinity
    ) {
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      this.mainColliderX = centerX;
      this.mainColliderY = centerY;

      this.mainColliderRadius =
        Math.hypot((maxX - minX) / 2, (maxY - minY) / 2) + 1;
    }
  }
}
