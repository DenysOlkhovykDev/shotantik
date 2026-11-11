import { Graphics, Sprite, type FederatedPointerEvent } from "pixi.js";
import { Building, type BuildingConfig } from "@aircraft/building";

import { shootingManager } from "@shooting/manager";

import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";

export class Canon extends Building {
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
    { resourceName: "Gear", amount: 2 },
    { resourceName: "Metal", amount: 2 },
  ];

  private static buildingParams = {
    baseColor: "#8d8b85",
    centerColor: "#ddd9d2",
  };

  constructor(x: number, y: number, isDecorative = false) {
    super(x, y, "Canon", isDecorative);
    this.draw();
  }

  protected draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createBaseTexture();

    const base = new Sprite(Canon.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Canon.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Canon.buildingConfig.baseGraphicalSize,
      Canon.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Canon.buildingConfig.baseGraphicalSize - 10,
      Canon.buildingParams.centerColor,
      false,
    );

    Canon.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation() {}

  protected onClick(event: FederatedPointerEvent) {
    super.onClick(event, false);

    shootingManager.setIsSelectingTargetMode(true);
  }
}
