import { Graphics, Sprite } from "pixi.js";
import { Building, type BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

export class Researcher extends Building {
  static buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    inventorySize: 1,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 46,

    baseGraphicalSize: 38,

    minRoadLength: 120,
    maxRoadLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Truss", amount: 1 },
    { resourceName: "Gear", amount: 1 },
    { resourceName: "Water", amount: 3 },
  ];

  static buildingParams = {
    baseColor: "#cab8db",
    backgroundColor: "#ae6bde",
    backgroundStrokeColor: "#581c74",
    backgroundPointsAmount: 8,
    backgroundSize: Researcher.buildingConfig.baseGraphicalSize + 8,
    backgroundStrokeWidth: 4,
  };

  static cubesParams = {
    positions: [
      { x: 0, y: -24 },
      { x: 10, y: -18 },
      { x: -10, y: -18 },
      { x: 20, y: 12 },
      { x: -20, y: 12 },
      { x: 20, y: 0 },
      { x: -20, y: 0 },
      { x: 20, y: -12 },
      { x: -20, y: -12 },
      { x: 10, y: 18 },
      { x: -10, y: 18 },
      { x: 0, y: 24 },
    ],

    baseColor: "#ae6bde",
    strokeWidth: 2,
    strokeColor: "#000000",
    baseRotation: Math.PI / 2,

    maxOffsetFromCenter: 4,
    minffsetFromCenter: -2,
  };

  // contentContainer
  // ├── baseGraphics
  // ├── cubesGraphics

  cubesGraphics: Graphics[] = [];

  cubesMovingDirection = 1;
  cubesOffsetFromCenter = 4;

  constructor(x: number, y: number) {
    super(x, y, "Researcher");
    this.draw();
    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createBaseTexture();

    const base = new Sprite(Researcher.baseTexture);
    this.contentContainer.addChild(base);

    this.makeCubeStructure();
  }

  private createBaseTexture() {
    if (Researcher.baseTexture) return;

    const baseGraphics = new Graphics();

    for (let i = 0; i < Researcher.buildingParams.backgroundPointsAmount; i++) {
      const { x, y } = getRadialPoint(
        i,
        Researcher.buildingParams.backgroundPointsAmount,
        Researcher.buildingParams.backgroundSize,
      );

      if (i === 0) {
        baseGraphics.moveTo(x, y);
      } else {
        baseGraphics.lineTo(x, y);
      }
    }

    baseGraphics
      .closePath()
      .fill(Researcher.buildingParams.backgroundColor)
      .stroke({
        width: Researcher.buildingParams.backgroundStrokeWidth,
        color: Researcher.buildingParams.backgroundStrokeColor,
      });

    makeBasicCircle(
      baseGraphics,
      Researcher.buildingConfig.baseGraphicalSize,
      Researcher.buildingParams.baseColor,
      false,
    );

    Researcher.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeCubeStructure() {
    for (let i = 0; i < Researcher.cubesParams.positions.length; i++) {
      this.cubesGraphics[i] = new Graphics();
      this.cubesGraphics[i].position.set(
        Researcher.cubesParams.positions[i].x,
        Researcher.cubesParams.positions[i].y,
      );
      this.makeCube(this.cubesGraphics[i], 8);
      this.contentContainer.addChild(this.cubesGraphics[i]);
    }
  }

  private makeCube(graphic: Graphics, size: number) {
    for (let i = 0; i < 3; i++) {
      const {
        startX: sx,
        startY: sy,
        endX: ex,
        endY: ey,
      } = getRadialLine(i, 3, 0, size);

      const { x: lx, y: ly } = getRadialPoint(i * 3 + 1.5, 3 * 3, size);

      const { x: rx, y: ry } = getRadialPoint(i * 3 + 3, 3 * 3, size);

      graphic
        .moveTo(sx, sy)
        .lineTo(ex, ey)
        .lineTo(lx, ly)
        .lineTo(rx, ry)
        .closePath()
        .stroke({
          width: Researcher.cubesParams.strokeWidth,
          color: Researcher.cubesParams.strokeColor,
          join: "round",
        })
        .fill(Researcher.cubesParams.baseColor);

      graphic.rotation = Researcher.cubesParams.baseRotation;
    }
  }

  animation(delta: number) {
    this.cubesOffsetFromCenter += 0.1 * delta * this.cubesMovingDirection;

    if (
      this.cubesOffsetFromCenter > Researcher.cubesParams.maxOffsetFromCenter
    ) {
      this.cubesOffsetFromCenter = Researcher.cubesParams.maxOffsetFromCenter;
      this.cubesMovingDirection = -1;
    }

    if (
      this.cubesOffsetFromCenter < Researcher.cubesParams.minffsetFromCenter
    ) {
      this.cubesOffsetFromCenter = Researcher.cubesParams.minffsetFromCenter;
      this.cubesMovingDirection = 1;
    }

    for (let i = 0; i < Researcher.cubesParams.positions.length; i++) {
      const angleToPoint = Math.atan2(
        Researcher.cubesParams.positions[i].y,
        Researcher.cubesParams.positions[i].x,
      );

      const x = Math.cos(angleToPoint) * this.cubesOffsetFromCenter;
      const y = Math.sin(angleToPoint) * this.cubesOffsetFromCenter;

      this.cubesGraphics[i].position.set(
        Researcher.cubesParams.positions[i].x + x,
        Researcher.cubesParams.positions[i].y + y,
      );
    }
  }
}
