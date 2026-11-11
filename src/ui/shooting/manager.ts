import { aircraft } from "@aircraft/aircraft";
import { bulletPool } from "@objects/bullets/pool";
import { targetsManager } from "@objects/targets/manager";
import { Container } from "pixi.js";

class ShootingManager extends Container {
  isSelectingTargetMode = false;

  constructor() {
    super();
  }

  public setIsSelectingTargetMode(value: boolean) {
    this.isSelectingTargetMode = value;
  }

  public getIsSelectingTargetMode() {
    return this.isSelectingTargetMode;
  }

  public selectTarget(pointerX: number, pointerY: number) {
    const target = targetsManager.addTarget(pointerX, pointerY);

    const canons = aircraft.buildings.filter((b) => b.buildingType === "Canon");

    for (const canon of canons) {
      bulletPool.launchBullet(
        canon.positionX,
        canon.positionY,
        pointerX,
        pointerY,
        target,
      );
    }

    this.setIsSelectingTargetMode(false);
  }
}

export const shootingManager = new ShootingManager();
