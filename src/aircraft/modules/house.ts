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

  static antennasParams = {
    totalAmount: 3,
    angleOffset: Math.PI / 4,
    color: "#000000",
  };

  static buildingParams = {
    baseColor: "#72ac4a",
    centerColor: "#5b8937",
  };

  // contentContainer
  // ├── antennasGraphics
  // ├── baseGraphics

  antennasGraphics: Graphics[] = [];

  antennasState = { currentAmount: 3 };

  buildingState = { growingDirection: 1, size: 1, changeSizeDelay: 300 };

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
    for (let i = 0; i < this.antennasState.currentAmount; i++) {
      this.antennasGraphics[i] = new Graphics();

      const { angle } = getRadialPoint(i, House.antennasParams.totalAmount, 1);

      const cos = Math.cos(angle + House.antennasParams.angleOffset);
      const sin = Math.sin(angle + House.antennasParams.angleOffset);

      const x1 = cos * (House.buildingConfig.baseGraphicalSize - 5);
      const y1 = sin * (House.buildingConfig.baseGraphicalSize - 5);

      const x2 = cos * (House.buildingConfig.baseGraphicalSize + 18);
      const y2 = sin * (House.buildingConfig.baseGraphicalSize + 18);

      this.antennasGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: House.antennasParams.color })
        .circle(x2, y2, 4)
        .fill(House.antennasParams.color);

      this.contentContainer.addChild(this.antennasGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (House.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize,
      House.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize - 18,
      House.buildingParams.centerColor,
      false,
    );

    House.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private updateAntennasVisibility() {
    for (let i = 0; i < this.antennasGraphics.length; i++) {
      this.antennasGraphics[i].visible = i < this.antennasState.currentAmount;
    }
  }

  animation(delta: number) {
    if (this.buildingState.changeSizeDelay <= 0) {
      this.buildingState.size +=
        0.01 * delta * this.buildingState.growingDirection;
      if (this.buildingState.size > 1.1) {
        this.buildingState.growingDirection = -1;
        // this.antennasParams.currentAmount--;
        // this.updateAntennasVisibility();
      }
      if (this.buildingState.size <= 1) {
        this.buildingState.growingDirection = 1;
        this.buildingState.changeSizeDelay = 300;
      }

      this.contentContainer.scale.set(this.buildingState.size);
    } else {
      this.buildingState.changeSizeDelay -= delta;
    }
  }
}
