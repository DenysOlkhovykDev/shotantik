import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Assembler extends Building {
  static buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    inventorySize: 4,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 48,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 3 },
    { resourceName: "Metal", amount: 1 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Water", amount: 1 },
      { resourceName: "Metal", amount: 2 },
    ],
    result: "Truss",
  };

  static manipulatorsParams = {
    amount: 3,
    jointRadius: 5,
    jointBorderWidth: 3,

    headWidth: 2,
    handWidth: 4,
    backgroundColor: "#000000",
    baseColor: "#ffe600",

    minRotation: 0,
    maxRotation: 0.2,
    speed: 0.01,
  };

  static buildingParams = {
    baseColor: "#bc9c56",
    centerColor: "#ebdc5d",
    square: {
      x: -25,
      y: -25,
      width: 50,
      height: 50,
      radius: 5,
      color: "#bc9c56",
    },
    grid: {
      gap: 11,
      length: 30,
      width: 4,
    },
  };

  // contentContainer
  // ├── maniulatorsGraphics
  // ├── baseGraphics

  maniulatorsGraphics: Graphics[] = [];

  manipulatorsPosition = {
    rotation: [0.1, 0.15, 0.2],
    direction: [1, 1, 1],
  };

  constructor(x: number, y: number) {
    super(x, y, "Assembler");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Assembler.buildingConfig.baseGraphicalSize,
    );

    this.createManipulators();

    this.createBaseTexture();

    const base = new Sprite(Assembler.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createManipulators() {
    for (let i = 0; i < 3; i++) {
      this.maniulatorsGraphics[i] = new Graphics();

      const start = getRadialPoint(
        i * 6,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 2,
      );
      const middle = getRadialPoint(
        i * 6 - 1,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 11,
      );
      const end = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 10,
      );
      const head = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize,
      );

      this.maniulatorsGraphics[i].position.set(start.x, start.y);
      this.maniulatorsGraphics[i].pivot.set(start.x, start.y);

      this.maniulatorsGraphics[i]
        .moveTo(end.x, end.y)
        .lineTo(head.x, head.y)
        .stroke({
          width: Assembler.manipulatorsParams.headWidth,
          color: Assembler.manipulatorsParams.backgroundColor,
        });

      this.maniulatorsGraphics[i]
        .moveTo(start.x, start.y)
        .lineTo(middle.x, middle.y)
        .lineTo(end.x, end.y)
        .stroke({
          width: Assembler.manipulatorsParams.handWidth * 2,
          color: Assembler.manipulatorsParams.backgroundColor,
          cap: "round",
        });

      this.maniulatorsGraphics[i]
        .moveTo(start.x, start.y)
        .lineTo(middle.x, middle.y)
        .lineTo(end.x, end.y)
        .stroke({
          width: Assembler.manipulatorsParams.handWidth,
          color: Assembler.manipulatorsParams.baseColor,
          cap: "round",
        });

      this.maniulatorsGraphics[i]
        .circle(start.x, start.y, Assembler.manipulatorsParams.jointRadius)
        .fill(Assembler.manipulatorsParams.baseColor)
        .stroke({
          width: 3,
          color: Assembler.manipulatorsParams.backgroundColor,
        });

      this.maniulatorsGraphics[i]
        .circle(middle.x, middle.y, Assembler.manipulatorsParams.jointRadius)
        .fill(Assembler.manipulatorsParams.baseColor)
        .stroke({
          width: 3,
          color: Assembler.manipulatorsParams.backgroundColor,
        });

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsPosition.rotation[i];

      this.contentContainer.addChild(this.maniulatorsGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Assembler.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Assembler.buildingConfig.baseGraphicalSize,
      Assembler.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Assembler.buildingConfig.baseGraphicalSize - 6,
      Assembler.buildingParams.centerColor,
      false,
    );

    baseGraphics
      .roundRect(
        Assembler.buildingParams.square.x,
        Assembler.buildingParams.square.y,
        Assembler.buildingParams.square.width,
        Assembler.buildingParams.square.height,
        Assembler.buildingParams.square.radius,
      )
      .fill(Assembler.buildingParams.square.color);

    baseGraphics
      .moveTo(
        -Assembler.buildingParams.grid.gap,
        -Assembler.buildingParams.grid.length,
      )
      .lineTo(
        -Assembler.buildingParams.grid.gap,
        Assembler.buildingParams.grid.length,
      )
      .moveTo(
        Assembler.buildingParams.grid.gap,
        -Assembler.buildingParams.grid.length,
      )
      .lineTo(
        Assembler.buildingParams.grid.gap,
        Assembler.buildingParams.grid.length,
      )
      .moveTo(
        -Assembler.buildingParams.grid.length,
        -Assembler.buildingParams.grid.gap,
      )
      .lineTo(
        Assembler.buildingParams.grid.length,
        -Assembler.buildingParams.grid.gap,
      )
      .moveTo(
        -Assembler.buildingParams.grid.length,
        Assembler.buildingParams.grid.gap,
      )
      .lineTo(
        Assembler.buildingParams.grid.length,
        Assembler.buildingParams.grid.gap,
      )
      .stroke({
        width: Assembler.buildingParams.grid.width,
        color: Assembler.buildingParams.centerColor,
      });

    Assembler.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    for (let i = 0; i < this.maniulatorsGraphics.length; i++) {
      if (
        this.manipulatorsPosition.rotation[i] <=
        Assembler.manipulatorsParams.minRotation
      ) {
        this.manipulatorsPosition.direction[i] = 1;
      } else if (
        this.manipulatorsPosition.rotation[i] >=
        Assembler.manipulatorsParams.maxRotation
      ) {
        this.manipulatorsPosition.direction[i] = -1;
      }

      this.manipulatorsPosition.rotation[i] +=
        Assembler.manipulatorsParams.speed *
        delta *
        this.manipulatorsPosition.direction[i];

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsPosition.rotation[i];
    }
  }
}
