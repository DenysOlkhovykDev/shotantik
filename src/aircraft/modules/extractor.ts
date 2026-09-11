import { Graphics, Triangle, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

export class Extractor extends Building {
  static buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    inventorySize: 5,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 43,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 2 },
  ];

  static craftRecipe = {
    ingredients: [],
    result: "Metal",
  };

  static antennasParams = {
    amount: 4,
    angleOffset: Math.PI / 4,
    color: "#000000",
  };

  static spikeParams = {
    amount: 4,
    shape: new Triangle(-10, 0, 6, 10, 6, -10),
    color: "#b06667",
    stroke: "#000000",
  };

  static buildingParams = {
    baseColor: "#b06667",
    ringColor: "#965859",
    centerColor: "#c08484",
  };

  // contentContainer
  // ├── antennasGraphics
  // ├── baseGraphics

  antennasGraphics: Graphics[] = [];

  antennasPosition = {
    offsetFromCenter: 0,
    movingDirection: 1,
  };

  constructor(x: number, y: number) {
    super(x, y, "Extractor");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Extractor.buildingConfig.baseGraphicalSize,
    );

    this.makeAntennas();

    this.createBaseTexture();

    const base = new Sprite(Extractor.baseTexture);
    this.contentContainer.addChild(base);
  }

  private makeAntennas() {
    for (let i = 0; i < Extractor.antennasParams.amount; i++) {
      this.antennasGraphics[i] = new Graphics();

      const { angle } = getRadialPoint(i, Extractor.antennasParams.amount, 1);

      const cos = Math.cos(angle + Extractor.antennasParams.angleOffset);
      const sin = Math.sin(angle + Extractor.antennasParams.angleOffset);

      const x1 = cos * (Extractor.buildingConfig.baseGraphicalSize - 5);
      const y1 = sin * (Extractor.buildingConfig.baseGraphicalSize - 5);

      const x2 = cos * (Extractor.buildingConfig.baseGraphicalSize + 18);
      const y2 = sin * (Extractor.buildingConfig.baseGraphicalSize + 18);

      this.antennasGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: Extractor.antennasParams.color })
        .circle(x2, y2, 4)
        .fill(Extractor.antennasParams.color);

      this.contentContainer.addChild(this.antennasGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Extractor.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Extractor.buildingConfig.baseGraphicalSize,
      Extractor.buildingParams.baseColor,
      true,
    );

    this.makeSpikes(baseGraphics);

    makeBasicCircle(
      baseGraphics,
      Extractor.buildingConfig.baseGraphicalSize,
      Extractor.buildingParams.ringColor,
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Extractor.buildingConfig.baseGraphicalSize - 5,
      Extractor.buildingParams.centerColor,
      false,
    );

    this.makeDecorativeTriangles(baseGraphics);

    Extractor.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeSpikes(baseGraphics: Graphics) {
    for (let i = 0; i < Extractor.spikeParams.amount; i++) {
      const {
        startX: sx,
        startY: sy,
        endX: ex,
        endY: ey,
      } = getRadialLine(
        i * 10 + 4,
        Extractor.spikeParams.amount * 10,
        Extractor.buildingConfig.baseGraphicalSize - 1,
        Extractor.buildingConfig.baseGraphicalSize + 8,
      );

      const { x: x1, y: y1 } = getRadialPoint(
        i * 10 + 1,
        Extractor.spikeParams.amount * 10,
        Extractor.buildingConfig.baseGraphicalSize,
      );

      baseGraphics
        .moveTo(sx, sy)
        .lineTo(ex, ey)
        .lineTo(x1, y1)
        .closePath()
        .fill(Extractor.spikeParams.color);

      baseGraphics.stroke({ width: 2, color: Extractor.spikeParams.stroke });

      const {
        startX: sx2,
        startY: sy2,
        endX: ex2,
        endY: ey2,
      } = getRadialLine(
        i * 10 + 6,
        Extractor.spikeParams.amount * 10,
        Extractor.buildingConfig.baseGraphicalSize - 1,
        Extractor.buildingConfig.baseGraphicalSize + 8,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i * 10 + 9,
        Extractor.spikeParams.amount * 10,
        Extractor.buildingConfig.baseGraphicalSize,
      );

      baseGraphics
        .moveTo(sx2, sy2)
        .lineTo(ex2, ey2)
        .lineTo(x2, y2)
        .closePath()
        .fill(Extractor.spikeParams.color);

      baseGraphics.stroke({ width: 2, color: Extractor.spikeParams.stroke });
    }
  }

  private makeDecorativeTriangles(baseGraphics: Graphics) {
    const points = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = getRadialPoint(
        i * 2 - 1,
        3 * 2,
        Extractor.buildingConfig.baseGraphicalSize - 7,
      );
      points.push({ x, y });
    }

    baseGraphics
      .moveTo(points[0].x, points[0].y)
      .lineTo(points[1].x, points[1].y)
      .lineTo(points[2].x, points[2].y)
      .closePath()
      .fill(Extractor.buildingParams.baseColor);

    const points2 = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = getRadialPoint(
        i,
        3,
        Extractor.buildingConfig.baseGraphicalSize - 21,
      );
      points2.push({ x, y });
    }

    baseGraphics
      .moveTo(points2[0].x, points2[0].y)
      .lineTo(points2[1].x, points2[1].y)
      .lineTo(points2[2].x, points2[2].y)
      .closePath()
      .fill(Extractor.buildingParams.centerColor);
  }

  animation(delta: number) {
    this.antennasPosition.offsetFromCenter +=
      0.1 * delta * this.antennasPosition.movingDirection;

    if (this.antennasPosition.offsetFromCenter > -2)
      this.antennasPosition.movingDirection = -1;
    if (this.antennasPosition.offsetFromCenter < -12)
      this.antennasPosition.movingDirection = 1;

    for (let i = 0; i < Extractor.antennasParams.amount; i++) {
      const { angle } = getRadialPoint(i, Extractor.antennasParams.amount, 1);

      const cos = Math.cos(angle + Extractor.antennasParams.angleOffset);
      const sin = Math.sin(angle + Extractor.antennasParams.angleOffset);

      const x1 = cos * this.antennasPosition.offsetFromCenter;
      const y1 = sin * this.antennasPosition.offsetFromCenter;

      this.antennasGraphics[i].position.set(x1, y1);
    }
  }
}
