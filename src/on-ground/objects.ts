import { Container } from "pixi.js";

import { Researcher } from "@aircraft/modules/researcher";
import { getWorldCoordinates, getWorldRotation } from "../../src/main";
import { getDistance } from "@utils/basic-geometry";
import { aircraft } from "@aircraft/aircraft";
import { type Building } from "@aircraft/building";
import { compasses } from "../ui/compass/manager";
import {
  hasClosedResearchMenu,
  isCurrentTargetReached,
} from "@utils/tutorial-conditions";
import { researchManager } from "../ui/research/manager";
import { allIslands } from "../islands/_islands";

type GroundObject = {
  container: Container;
  boundsRadius: number;
  isColide: boolean;
};

class OnGroundObjects extends Container {
  public objectsOnGround: GroundObject[] = [];

  public addResearcher(x: number, y: number) {
    const researcher = new Researcher(x, y);

    this.objectsOnGround.push({
      container: researcher,
      boundsRadius: researcher.buildingConfig.boundsRadius,
      isColide: false,
    });
    researcher.eventMode = "none";

    this.addChild(researcher);
  }

  public checkColision() {
    for (let i = 0; i < this.objectsOnGround.length; i++) {
      if (this.overlapWithAircraftBounds(this.objectsOnGround[i])) {
        const cos = Math.cos(-getWorldRotation());
        const sin = Math.sin(-getWorldRotation());
        const { x: worldX, y: worldY } = getWorldCoordinates();

        for (const building of aircraft.buildings) {
          this.objectsOnGround[i].isColide = this.overlapWithBuilding(
            this.objectsOnGround[i],
            building,
            worldX,
            worldY,
            sin,
            cos,
          );

          if (this.objectsOnGround[i].isColide) {
            break;
          }
        }
      }
    }
  }

  private overlapWithAircraftBounds(object: GroundObject) {
    const { x: worldX, y: worldY } = getWorldCoordinates();

    return (
      getDistance(worldX, worldY, object.container.x, object.container.y) <=
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
      if (this.objectsOnGround[i].isColide) {
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
