import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class House extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 17,

    inventorySize: 5,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 30,

    baseGraphicalSize: 25,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 5 },
  ];

  // contentContainer
  // ├── antennasGraphics
  // ├── baseGraphics

  antennasGraphics: Graphics[] = [];
  antennasParams = {
    totalAmount: 3,
    currentAmount: 3,
    angleOffset: Math.PI / 4,
    color: "#000000",
  };

  buildingParams = {
    changeSizeDelay: 300,
    isGrowing: true,
    aircraftize: 1,
    baseColor: "#72ac4a",
    centerColor: "#5b8937",
  };

  constructor(x: number, y: number) {
    super(x, y, "House");
    this.draw();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      House.buildingConfig.baseGraphicalSize,
    );

    this.makeAntennas();

    this.createBaseTexture();

    const base = new Sprite(House.baseTexture);
    this.contentContainer.addChild(base);
  }

  private makeAntennas() {
    for (let i = 0; i < this.antennasParams.currentAmount; i++) {
      this.antennasGraphics[i] = new Graphics();

      const { angle } = getRadialPoint(i, this.antennasParams.totalAmount, 1);

      const cos = Math.cos(angle + this.antennasParams.angleOffset);
      const sin = Math.sin(angle + this.antennasParams.angleOffset);

      const x1 = cos * (House.buildingConfig.baseGraphicalSize - 5);
      const y1 = sin * (House.buildingConfig.baseGraphicalSize - 5);

      const x2 = cos * (House.buildingConfig.baseGraphicalSize + 18);
      const y2 = sin * (House.buildingConfig.baseGraphicalSize + 18);

      this.antennasGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: this.antennasParams.color })
        .circle(x2, y2, 4)
        .fill(this.antennasParams.color);

      this.contentContainer.addChild(this.antennasGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (House.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize,
      this.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize - 18,
      this.buildingParams.centerColor,
      false,
    );

    House.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private updateAntennasVisibility() {
    for (let i = 0; i < this.antennasGraphics.length; i++) {
      this.antennasGraphics[i].visible = i < this.antennasParams.currentAmount;
    }
  }

  animation(delta: number) {
    if (this.buildingParams.changeSizeDelay <= 0) {
      const direction = this.buildingParams.isGrowing ? 1 : -1;
      this.buildingParams.aircraftize += 0.01 * delta * direction;
      if (this.buildingParams.aircraftize > 1.1) {
        this.buildingParams.isGrowing = false;
        // this.antennasParams.currentAmount--;
        // this.updateAntennasVisibility();
      }
      if (this.buildingParams.aircraftize <= 1) {
        this.buildingParams.isGrowing = true;
        this.buildingParams.changeSizeDelay = 300;
      }

      this.contentContainer.scale.set(this.buildingParams.aircraftize);
    } else {
      this.buildingParams.changeSizeDelay -= delta;
    }
  }
}
