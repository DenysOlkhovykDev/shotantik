import { type Building } from "@aircraft/building";

import { type Task } from "@dashboard/task";
import { type Worker } from "@workers/worker";

import { getRandomPointInRadius } from "@utils/basic-geometry";

const isTest = import.meta.env.MODE === "test";

export class Navigator {
  private path: Building[] = [];
  state: string;

  private isInBetterPlace = false;
  private betterPlaceX: number | undefined;
  private betterPlaceY: number | undefined;

  constructor(public currentPlatform: Building) {
    this.state = "stay";
  }

  public moveToTargetBuilding(
    worker: Worker,
    movingSpeed: number,
    delta: number,
  ) {
    if (this.path.length > 0) {
      const targetCenter = this.path[0].getBaseCenter();

      const result = worker.legs.moveCharacter(
        worker.body,
        targetCenter.x,
        targetCenter.y,
        movingSpeed,
        delta,
      );

      if (result) {
        this.onReachTargetBuilding();
      }
    } else {
      this.state = "stay";
    }
  }

  public moveToBetterPlace(worker: Worker, movingSpeed: number, delta: number) {
    if (!this.isInBetterPlace && !isTest) {
      if (this.betterPlaceX === undefined || this.betterPlaceY === undefined) {
        const targetCenter = this.currentPlatform.getBaseCenter();

        const { x, y } = getRandomPointInRadius(
          this.currentPlatform.buildingConfig.storageRadius,
        );

        this.betterPlaceX = targetCenter.x + x;
        this.betterPlaceY = targetCenter.y + y;
      } else {
        const result = worker.legs.moveCharacter(
          worker.body,
          this.betterPlaceX,
          this.betterPlaceY,
          movingSpeed,
          delta,
        );

        if (result) {
          this.isInBetterPlace = true;
        }
      }
    }
  }

  private onReachTargetBuilding() {
    this.currentPlatform = this.path[0];

    this.path.shift();

    if (this.path.length === 0) {
      this.state = "stay";
    }
  }

  public pickPathToBuilding(task: Task) {
    this.path = task.getRouteForTarget(this.currentPlatform);

    this.pathMovingPreparing();
  }

  public pickPathToResource(task: Task) {
    const [path, resource] = task.getRouteForResource(
      this.currentPlatform,
      true,
    );

    this.path = path;

    this.pathMovingPreparing();

    return resource;
  }

  private pathMovingPreparing() {
    this.path.shift();

    this.state = "moving";
    this.isInBetterPlace = false;
    this.betterPlaceX = undefined;
    this.betterPlaceY = undefined;
  }
}
