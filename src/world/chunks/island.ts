import {
  Container,
  Particle,
  ParticleContainer,
  Texture,
  Graphics,
} from "pixi.js";

import { aircraft } from "@aircraft/aircraft";
import { Building } from "@aircraft/building";

import {
  generateDoubleHexTexture,
  makeBrighterColor,
} from "@utils/basic-graphic";
import {
  getDistance,
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

  private tilesValues: number[][];

  public mainColliderX = 0;
  public mainColliderY = 0;
  public mainColliderRadius = 0;
  public colliders: { y: number; x: number }[] = [];

  constructor(
    private chunkX: number,
    private chunkY: number,
    private cellSize: number,
    private gridSize: number,
    private offsetX: number,
    private offsetY: number,
    seed: number,
  ) {
    super();

    if (!Island.tileTexture) {
      Island.tileTexture = generateDoubleHexTexture((this.cellSize + 8) / 2);
    }

    this.tilesValues = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0),
    );

    this.generateNoise(seed);

    this.setColliders();

    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const value = this.tilesValues[y][x];

        if (value > 1) {
          const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
            x,
            y,
            this.offsetX,
            this.offsetY,
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

    if (import.meta.env.VITE_IS_DEBUG_ISLAND_COLLIDERS === "true") {
      for (let i = 0; i < this.colliders.length; i++) {
        const graphic = new Graphics();

        const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
          this.colliders[i].x,
          this.colliders[i].y,
          this.offsetX,
          this.offsetY,
        );

        graphic
          .circle(tileX, tileY, this.cellSize / 2)
          .stroke({ width: 4, color: "#ff0000" });
        this.addChild(graphic);
      }

      const graphic = new Graphics();

      const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
        this.mainColliderX,
        this.mainColliderY,
        this.offsetX,
        this.offsetY,
      );

      graphic
        .circle(tileX, tileY, 5)
        .circle(tileX, tileY, this.mainColliderRadius * this.cellSize)
        .stroke({ width: 4, color: "#ff0000" });
      this.addChild(graphic);
    }
  }

  private generateNoise(seed: number) {
    const step = 10;

    const maxAmplitude = 0.5;

    const centerX =
      (this.gridSize - 1) / 2 +
      (getValueFromCoordinates(this.chunkX, this.chunkY, seed) - 0.5) *
        this.gridSize *
        maxAmplitude;
    const centerY =
      (this.gridSize - 1) / 2 +
      (getValueFromCoordinates(this.chunkX + 100, this.chunkY + 100, seed) -
        0.5) *
        this.gridSize *
        maxAmplitude;

    const radius = this.gridSize * 0.38;

    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const globalX = this.chunkX * this.gridSize + x;
        const globalY = this.chunkY * this.gridSize + y;

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

  private setColliders() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
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
          if (nx < 0 || nx >= this.gridSize || ny < 0 || ny >= this.gridSize) {
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

  public isCollideWithAircraft(
    rotation: number,
    aircraftX: number,
    aircraftY: number,
  ) {
    if (this.overlapWithAircraftBounds(aircraftX, aircraftY)) {
      const worldAngle = rotation;
      const cos = Math.cos(worldAngle);
      const sin = Math.sin(worldAngle);

      for (const building of aircraft.buildings) {
        for (const tile of this.colliders) {
          const result = this.overlapWithBuilding(
            tile,
            building,
            aircraftX,
            aircraftY,
            sin,
            cos,
          );

          if (result) {
            return result;
          }
        }
      }
    }
  }

  private overlapWithAircraftBounds(aircraftX: number, aircraftY: number) {
    if (this === undefined) return false;

    const { x: mainTileX, y: mainTileY } = transformCoordinatesByHexOddRows(
      this.mainColliderX,
      this.mainColliderY,
      this.offsetX,
      this.offsetY,
    );

    const { x: globalMainTileX, y: globalMainTileY } =
      this.getGLobalTIleCoordinates(mainTileX, mainTileY);

    return (
      getDistance(aircraftX, aircraftY, globalMainTileX, globalMainTileY) <=
      aircraft.boundsRadius + this.mainColliderRadius * this.cellSize
    );
  }

  private overlapWithBuilding(
    collider: { y: number; x: number },
    building: Building,
    worldX: number,
    worldY: number,
    sin: number,
    cos: number,
  ) {
    const localX = building.x + building.buildingConfig.boundsCenter.x;
    const localY = building.y + building.buildingConfig.boundsCenter.y;

    const buildingX = worldX + localX * cos - localY * sin;
    const buildingY = worldY + localX * sin + localY * cos;

    const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
      collider.x,
      collider.y,
      this.offsetX,
      this.offsetY,
    );

    const { x: globalTileX, y: globalTileY } = this.getGLobalTIleCoordinates(
      tileX,
      tileY,
    );

    const distance = getDistance(
      buildingX,
      buildingY,
      globalTileX,
      globalTileY,
    );

    return distance < building.buildingConfig.boundsRadius + this.cellSize / 2;
  }

  private getGLobalTIleCoordinates(tileX: number, tileY: number) {
    const chunkWidth = this.offsetX * this.gridSize;
    const chunkHeight = this.offsetY * this.gridSize;

    return {
      x: -(chunkWidth / 2) + chunkWidth * this.chunkX + tileX,
      y: -(chunkHeight / 2) + chunkHeight * this.chunkY + tileY,
    };
  }
}
