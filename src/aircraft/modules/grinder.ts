import { Container, Graphics, Sprite } from "pixi.js";

import { Building, type BuildingConfig } from "@aircraft/building";

import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeGear,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Grinder extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 30,

    inventorySize: 4,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 48,

    baseGraphicalSize: 40,

    minRoadLength: 120,
    maxRoadLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 2 },
    { resourceName: "Water", amount: 2 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Metal", amount: 1 },
      { resourceName: "Organic", amount: 2 },
    ],
    result: "Gear",
    duration: 60,
  };

  private static buildingParams = {
    teeth: 16,
    innerRadius: Grinder.buildingConfig.baseGraphicalSize,
    outerRadius: Grinder.buildingConfig.baseGraphicalSize + 8,
    baseColor: "#c5d7d4",
    strokeWidth: 1.5,
    centerRadius: Grinder.buildingConfig.baseGraphicalSize - 3,
    centerColor: "#acc1bd",
    deepCenterColor: "#9eb0ac",
    rotationSpeed: 0.005,
  };

  private static gearSatellitesParams = {
    amount: 3,
    teeth: 6,
    innerRadius: 7,
    outerRadius: 14,
    baseColor: "#a3b0ae",
    strokeWidth: 1.5,
    centerRadius: 3,
    centerColor: "#717877",
    rotationSpeed: -((Grinder.buildingParams.rotationSpeed * 16) / 6),
  };

  // contentContainer
  // ├── gearSatellites
  // └── buildingBase
  //      ├── baseGraphics

  private buildingBase: Container = new Container();

  private gearSatellites: Graphics[] = [];

  constructor(x: number, y: number, isDecorative = false) {
    super(x, y, "Grinder", isDecorative);
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  protected draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createGearSatellites();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.buildingBase.addChild(base);
    this.contentContainer.addChild(this.buildingBase);
  }

  private createGearSatellites() {
    for (let i = 0; i < Grinder.gearSatellitesParams.amount; i++) {
      this.gearSatellites[i] = new Graphics();

      makeGear(
        this.gearSatellites[i],
        Grinder.gearSatellitesParams.teeth,
        Grinder.gearSatellitesParams.innerRadius,
        Grinder.gearSatellitesParams.outerRadius,
        Grinder.gearSatellitesParams.baseColor,
        Grinder.gearSatellitesParams.strokeWidth,
        Grinder.gearSatellitesParams.centerRadius,
        Grinder.gearSatellitesParams.centerColor,
      );

      const { x, y } = getRadialPoint(
        i,
        Grinder.gearSatellitesParams.amount,
        Grinder.buildingConfig.baseGraphicalSize,
      );

      this.gearSatellites[i].position.set(x, y);

      this.contentContainer.addChild(this.gearSatellites[i]);
    }
  }

  private createBaseTexture() {
    if (Grinder.baseTexture) return;

    const baseGraphics = new Graphics();

    makeGear(
      baseGraphics,
      Grinder.buildingParams.teeth,
      Grinder.buildingParams.innerRadius,
      Grinder.buildingParams.outerRadius,
      Grinder.buildingParams.baseColor,
      Grinder.buildingParams.strokeWidth,
      Grinder.buildingParams.centerRadius,
      "#414443",
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 5,
      Grinder.buildingParams.centerColor,
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 20,
      Grinder.buildingParams.baseColor,
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 23,
      Grinder.buildingParams.deepCenterColor,
      false,
    );

    Grinder.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    this.buildingBase.rotation += Grinder.buildingParams.rotationSpeed * delta;

    for (let i = 0; i < Grinder.gearSatellitesParams.amount; i++) {
      this.gearSatellites[i].rotation +=
        Grinder.gearSatellitesParams.rotationSpeed * delta;
    }
  }
}
