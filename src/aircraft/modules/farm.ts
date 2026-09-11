import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialLine, getRadialPoint } from "@utils/basic-geometry";

export class Farm extends Building {
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

  static constructionRecipe = [{ resourceName: "Organic", amount: 3 }];

  static craftRecipe = {
    ingredients: [],
    result: "Organic",
  };

  static kelpsParams = {
    amount: 4,
    leavesSize: 16,
    leavesWidth: 20,
    leafSegments: 6,
    movingSpeed: 0.05,
    maxAmplitude: 3,
    trunksColor: "#34612c",
    leavesColor: "#559c48",
  };

  static buildingParams = {
    groundRingColor: "#a3791f",
    baseColor: "#b0ca75",
    plantCenterColor: "#77c06a",
    plantLeavesColor: "#67a75c",
  };

  // contentContainer
  // ├── kelpLeavesGraphics
  // ├── kelpTrunksGraphics
  // ├── baseGraphics

  kelpLeavesGraphics: Graphics[] = [];
  kelpTrunksGraphics: Graphics = new Graphics();

  kelpsPostion = {
    time: 0,
  };

  private kelpLeavesPoints: {
    xRight: number;
    yRight: number;
    xLeft: number;
    yLeft: number;
  }[] = [];

  constructor(x: number, y: number) {
    super(x, y, "Farm");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Farm.buildingConfig.baseGraphicalSize,
    );

    this.createKelpLeaves();

    this.createBaseTexture();

    const base = new Sprite(Farm.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Farm.baseTexture) return;

    const baseGraphics = new Graphics();

    this.createKelpTrunks(baseGraphics);

    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize,
      Farm.buildingParams.groundRingColor,
      true,
    );
    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize - 2,
      Farm.buildingParams.baseColor,
      false,
    );

    this.createDecorativePlant(baseGraphics);

    Farm.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private createKelpLeaves() {
    for (let i = 0; i < Farm.kelpsParams.amount; i++) {
      const { angle, x, y } = getRadialPoint(
        i,
        Farm.kelpsParams.amount,
        Farm.buildingConfig.baseGraphicalSize - 6,
      );

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      this.kelpLeavesPoints[i] = {
        xRight: -sin * Farm.kelpsParams.leavesSize,
        yRight: cos * Farm.kelpsParams.leavesSize,
        xLeft: sin * Farm.kelpsParams.leavesSize,
        yLeft: -cos * Farm.kelpsParams.leavesSize,
      };

      const graphics = new Graphics();
      graphics.position.set(x, y);

      this.contentContainer.addChild(graphics);
      this.kelpLeavesGraphics[i] = graphics;
    }
    this.animation(0);
  }

  private createKelpTrunks(baseGraphics: Graphics) {
    for (let i = 0; i < Farm.kelpsParams.amount; i++) {
      const line = getRadialLine(
        i,
        Farm.kelpsParams.amount,
        Farm.buildingConfig.baseGraphicalSize,
        Farm.buildingConfig.baseGraphicalSize + 3,
      );

      baseGraphics
        .moveTo(line.startX, line.startY)
        .lineTo(line.endX, line.endY)
        .stroke({
          width: 4,
          color: Farm.kelpsParams.trunksColor,
          cap: "round",
        });
    }
  }

  private createDecorativePlant(baseGraphics: Graphics) {
    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize - 18,
      Farm.buildingParams.plantCenterColor,
      false,
    );

    for (let i = 0; i < 5; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i * 5 - 1,
        5 * 5,
        Farm.buildingConfig.baseGraphicalSize - 20,
      );

      baseGraphics.circle(x1, y1, 8).fill(Farm.buildingParams.plantLeavesColor);

      const { x: x2, y: y2 } = getRadialPoint(
        i * 5 + 1,
        5 * 5,
        Farm.buildingConfig.baseGraphicalSize - 20,
      );

      baseGraphics.circle(x2, y2, 8).fill(Farm.buildingParams.plantLeavesColor);

      baseGraphics
        .moveTo(0, 0)
        .lineTo(x1, y1)
        .lineTo(x2, y2)
        .closePath()
        .fill(Farm.buildingParams.plantLeavesColor);
    }
  }

  animation(delta: number) {
    this.kelpsPostion.time += delta * Farm.kelpsParams.movingSpeed;

    for (let i = 0; i < Farm.kelpsParams.amount; i++) {
      this.kelpLeavesGraphics[i].clear();

      this.makeLeaf(
        this.kelpLeavesGraphics[i],
        i,
        this.kelpLeavesPoints[i].xRight,
        this.kelpLeavesPoints[i].yRight,
      );
      this.makeLeaf(
        this.kelpLeavesGraphics[i],
        i,
        this.kelpLeavesPoints[i].xLeft,
        this.kelpLeavesPoints[i].yLeft,
      );

      this.kelpLeavesGraphics[i].stroke({
        width: Farm.kelpsParams.leavesWidth,
        color: Farm.kelpsParams.leavesColor,
        cap: "round",
        join: "round",
      });
    }
  }

  private makeLeaf(
    leafGraphics: Graphics,
    index: number,
    endX: number,
    endY: number,
  ) {
    const length = Math.hypot(endX, endY);

    const dx = endX / length;
    const dy = endY / length;

    const nx = -dy;
    const ny = dx;

    leafGraphics.moveTo(0, 0);

    for (let j = 1; j <= Farm.kelpsParams.leafSegments; j++) {
      const t = j / Farm.kelpsParams.leafSegments;

      const px = dx * length * t;
      const py = dy * length * t;

      const localAmplitude = Farm.kelpsParams.maxAmplitude * t * t;

      const offset =
        Math.sin(this.kelpsPostion.time + t * Math.PI * 2 + index * 0.35) *
        localAmplitude;

      leafGraphics.lineTo(px + nx * offset, py + ny * offset);
    }
  }
}
