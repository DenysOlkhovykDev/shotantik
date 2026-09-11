import { Container, Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeGear,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Grinder extends Building {
  static readonly buildingConfig: BuildingConfig = {
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
    { resourceName: "Organic", amount: 2 },
    { resourceName: "Water", amount: 2 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Metal", amount: 1 },
      { resourceName: "Organic", amount: 2 },
    ],
    result: "Gear",
  };

  static buildingParams = {
    teeth: 16,
    innerRadius: Grinder.buildingConfig.baseGraphicalSize,
    outerRadius: Grinder.buildingConfig.baseGraphicalSize + 8,
    baseColor: "#c5d7d4",
    centerRadius: Grinder.buildingConfig.baseGraphicalSize - 3,
    centerColor: "#acc1bd",
    deepCenterColor: "#9eb0ac",
    rotationSpeed: 0.005,
  };

  static gearSatelitesParams = {
    amount: 3,
    teeth: 6,
    innerRadius: 7,
    outerRadius: 14,
    baseColor: "#a3b0ae",
    centerRadius: 3,
    centerColor: "#717877",
    rotationSpeed: -((Grinder.buildingParams.rotationSpeed * 16) / 6),
  };

  // contentContainer
  // ├── gearSatelites
  // └── buildingBase
  //      ├── baseGraphics

  buildingBase: Container = new Container();

  gearSatelites: Graphics[] = [];

  constructor(x: number, y: number) {
    super(x, y, "Grinder");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Grinder.buildingConfig.baseGraphicalSize,
    );

    this.createGearSatelites();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.buildingBase.addChild(base);
    this.contentContainer.addChild(this.buildingBase);
  }

  private createGearSatelites() {
    for (let i = 0; i < Grinder.gearSatelitesParams.amount; i++) {
      this.gearSatelites[i] = new Graphics();

      makeGear(
        this.gearSatelites[i],
        Grinder.gearSatelitesParams.teeth,
        Grinder.gearSatelitesParams.innerRadius,
        Grinder.gearSatelitesParams.outerRadius,
        Grinder.gearSatelitesParams.baseColor,
        2,
        Grinder.gearSatelitesParams.centerRadius,
        Grinder.gearSatelitesParams.centerColor,
      );

      const { x, y } = getRadialPoint(
        i,
        Grinder.gearSatelitesParams.amount,
        Grinder.buildingConfig.baseGraphicalSize,
      );

      this.gearSatelites[i].position.set(x, y);

      this.contentContainer.addChild(this.gearSatelites[i]);
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
      2,
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

    for (let i = 0; i < Grinder.gearSatelitesParams.amount; i++) {
      this.gearSatelites[i].rotation +=
        Grinder.gearSatelitesParams.rotationSpeed * delta;
    }
  }
}
