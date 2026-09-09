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

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 1 },
  ];

  buildingParams = {
    baseColor: "#cccbcb",
    centerColor: "#a9a9a9",
  };

  constructor(x: number, y: number) {
    super(x, y, "Platform");
    this.draw();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Platform.buildingConfig.baseGraphicalSize,
    );

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
      this.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Platform.buildingConfig.baseGraphicalSize - 10,
      this.buildingParams.centerColor,
      false,
    );

    Platform.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {}

  onClick(event: FederatedPointerEvent) {
    aircraft.setConstuctionSource(this);
    super.onClick(event);
    constructionManager.showButton();
    aircraft.showCraftSigns();
  }
}
