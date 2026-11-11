import { Container } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";
import { type Building } from "@aircraft/building";
import { Researcher } from "@aircraft/modules/researcher";

import { allIslands } from "@islands/all-islands";

import { compasses } from "@compass/manager";
import { researchManager } from "@research/manager";

import { getDistance } from "@utils/basic-geometry";
import {
  hasClosedResearchMenu,
  isCurrentTargetReached,
} from "@utils/tutorial-conditions";

type GroundObject = {
  container: Container;
  boundsRadius: number;
  isCollide: boolean;
};

class OnGroundObjects extends Container {
  public objectsOnGround: GroundObject[] = [];

  public addResearcher(x: number, y: number) {
    const researcher = new Researcher(x, y);

    this.objectsOnGround.push({
      container: researcher,
      boundsRadius: researcher.buildingConfig.boundsRadius,
      isCollide: false,
    });
    researcher.eventMode = "none";

    this.addChild(researcher);
  }

  public checkCollision() {
    for (let i = 0; i < this.objectsOnGround.length; i++) {
      if (this.overlapWithAircraftBounds(this.objectsOnGround[i])) {
        const worldAngle = aircraft.rotation;
        const cos = Math.cos(worldAngle);
        const sin = Math.sin(worldAngle);

        for (const building of aircraft.buildings) {
          this.objectsOnGround[i].isCollide = this.overlapWithBuilding(
            this.objectsOnGround[i],
            building,
            aircraft.x,
            aircraft.y,
            sin,
            cos,
          );

          if (this.objectsOnGround[i].isCollide) {
            break;
          }
        }
      }
    }
  }

  private overlapWithAircraftBounds(object: GroundObject) {
    return (
      getDistance(
        aircraft.x,
        aircraft.y,
        object.container.x,
        object.container.y,
      ) <=
      aircraft.boundsRadius + object.boundsRadius
    );
  }

  private overlapWithBuilding(
    object: GroundObject,
    building: Building,
    worldX: number,
    worldY: number,
    sin: number,
    cos: number,
  ) {
    const localX = building.x + building.buildingConfig.boundsCenter.x;

    const localY = building.y + building.buildingConfig.boundsCenter.y;

    const buildingX = worldX + localX * cos - localY * sin;

    const buildingY = worldY + localX * sin + localY * cos;

    const distance = getDistance(
      buildingX,
      buildingY,
      object.container.x,
      object.container.y,
    );

    return (
      distance <
      building.buildingConfig.boundsRadius +
        Researcher.buildingConfig.boundsRadius
    );
  }

  public deleteOldAndCreateNewTarget() {
    this.deleteOldTarget();

    researchManager.researchProgress.unusedPoints++;

    const angle = Math.random() * Math.PI * 2;
    const radius =
      researchManager.researchProgress.minDistanceToNextResearcher +
      Math.random() * 1000;

    researchManager.researchProgress.minDistanceToNextResearcher *= 2;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    this.createNewTarget(x, y);
  }

  private deleteOldTarget() {
    for (let i = 0; i < this.objectsOnGround.length; i++) {
      if (this.objectsOnGround[i].isCollide) {
        compasses.deleteCompass(
          this.objectsOnGround[i].container.x,
          this.objectsOnGround[i].container.y,
        );

        this.objectsOnGround[i].container.destroy();
        this.objectsOnGround.splice(i, 1);
        i--;
      }
    }
  }

  public createNewTarget(x: number, y: number) {
    onGroundObjects.addResearcher(x, y);

    allIslands.addIslandIfItNeeded(x, y);

    compasses.addCompass(x, y, () => {
      return !isCurrentTargetReached() && hasClosedResearchMenu();
    });
  }
}

export const onGroundObjects = new OnGroundObjects();
