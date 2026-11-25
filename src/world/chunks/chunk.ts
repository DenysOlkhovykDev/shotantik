import { Container } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";
import { Building } from "@aircraft/building";

import { Background } from "@chunks/background";
import { Island } from "@chunks/island";

import {
  getDistance,
  getValueFromCoordinates,
  transformCoordinatesByHexOddRows,
} from "@utils/basic-geometry";

export class Chunk extends Container {
  private background: Background;
  private island: Island | undefined = undefined;

  private static cellSize = 40;
  public static gridSize = 16;

  public static offsetX = Chunk.cellSize;
  public static offsetY = Math.sqrt(
    Math.pow(Chunk.offsetX, 2) - Math.pow(Chunk.offsetX / 2, 2),
  );

  constructor(chunkX: number, chunkY: number, seed: number) {
    super();

    this.background = new Background(
      chunkX,
      chunkY,
      Chunk.cellSize,
      Chunk.gridSize,
      Chunk.offsetX,
      Chunk.offsetY,
      seed,
    );

    this.addChild(this.background);

    const isIslandInChunk = getValueFromCoordinates(chunkX, chunkY, seed);

    if (
      isIslandInChunk <= 0.6 &&
      (Math.abs(chunkX) >= 1 || Math.abs(chunkY) >= 1)
    ) {
      this.island = new Island(
        chunkX,
        chunkY,
        Chunk.cellSize,
        Chunk.gridSize,
        Chunk.offsetX,
        Chunk.offsetY,
        seed,
      );

      this.addChild(this.island);
    }
  }

  public isCollideWithIsland(
    rotation: number,
    aircraftX: number,
    aircraftY: number,
  ) {
    if (this.island === undefined) return false;

    if (this.overlapWithAircraftBounds(aircraftX, aircraftY)) {
      const worldAngle = rotation;
      const cos = Math.cos(worldAngle);
      const sin = Math.sin(worldAngle);

      for (const building of aircraft.buildings) {
        for (const islandTile of this.island.colliders) {
          const result = this.overlapWithBuilding(
            islandTile,
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
    if (this.island === undefined) return false;

    const { x: tileX, y: tileY } = transformCoordinatesByHexOddRows(
      this.island.mainColliderX,
      this.island.mainColliderY,
      Chunk.offsetX,
      Chunk.offsetY,
    );

    const islandX = -((Chunk.offsetX * Chunk.gridSize) / 2) + this.x + tileX;
    const islandY = -((Chunk.offsetY * Chunk.gridSize) / 2) + this.y + tileY;

    return (
      getDistance(aircraftX, aircraftY, islandX, islandY) <=
      aircraft.boundsRadius + this.island.mainColliderRadius * Chunk.cellSize
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
      Chunk.offsetX,
      Chunk.offsetY,
    );

    const islandTileX =
      -((Chunk.offsetX * Chunk.gridSize) / 2) + this.x + tileX;
    const islandTileY =
      -((Chunk.offsetY * Chunk.gridSize) / 2) + this.y + tileY;

    const distance = getDistance(
      buildingX,
      buildingY,
      islandTileX,
      islandTileY,
    );

    return distance < building.buildingConfig.boundsRadius + Chunk.cellSize / 2;
  }
}
