import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";

export class Platform extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    inventorySize: 10,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 40,

    baseGraphicalSize: 40,

    minRoadLength: 120,
    maxRoadLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 1 },
  ];

  static buildingParams = {
    baseColor: "#cccbcb",
    centerColor: "#a9a9a9",
  };

  constructor(x: number, y: number) {
    super(x, y, "Platform");
    this.draw();
  }

  draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createBaseTexture();

    const base = new Sprite(Platform.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Platform.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Platform.buildingConfig.baseGraphicalSize,
      Platform.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Platform.buildingConfig.baseGraphicalSize - 10,
      Platform.buildingParams.centerColor,
      false,
    );

    Platform.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {}

  onClick(event: FederatedPointerEvent) {
    super.onClick(event);
    constructionManager.showButton();
    aircraft.showCraftSigns();

    const buildingType = constructionManager.getBuildingType();

    if (buildingType === "Road") {
      const from =
        aircraft.buildings.length > 0 &&
        aircraft.constructionSource !== undefined
          ? aircraft.buildings[aircraft.constructionSource]
          : undefined;

      if (from && from !== this) {
        const result = aircraft.addAlternativeBlueprintRoad(from, this);
        if (result) {
          constructionManager.setBuildingType(undefined);

          aircraft.resetConstructionSource();
          constructionManager.updateDisplayBuildingType();
        }
        constructionManager.hideButton();
        constructionManager.hideMenu();
      }
    }

    aircraft.setConstuctionSource(this);
  }
}
