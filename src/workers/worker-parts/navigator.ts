import { type Building } from "@aircraft/building";

import { type Task } from "@dashboard/task";
import { type Worker } from "@workers/worker";

import { getRandomPointInRadius } from "@utils/basic-geometry";

const isTest = import.meta.env.MODE === "test";

export class Navigator {
  static movingSpeed = 2;
  static rotationSpeed = 0.16;

  private path: Building[] = [];
  state: string;

  private isInBetterPlace = false;
  private betterPlaceX: number | undefined;
  private betterPlaceY: number | undefined;

  constructor(public currentPlatform: Building) {
    this.state = "stay";
  }

  public moveToTargetBuilding(worker: Worker, delta: number) {
    if (this.path.length > 0) {
      const targetCenter = this.path[0].getBaseCenterInWorld();

      const result = this.move(worker, delta, targetCenter.x, targetCenter.y);

      if (result) {
        this.onReachTargetBuilding();
      }
    } else {
      this.state = "stay";
    }
  }

  public moveToBetterPlace(worker: Worker, delta: number) {
    if (!this.isInBetterPlace && !isTest) {
      if (this.betterPlaceX === undefined || this.betterPlaceY === undefined) {
        const targetCenter = this.currentPlatform.getBaseCenterInWorld();

        const { x, y } = getRandomPointInRadius(
          this.currentPlatform.buildingConfig.storageRadius,
        );

        this.betterPlaceX = targetCenter.x + x;
        this.betterPlaceY = targetCenter.y + y;
      } else {
        const result = this.move(
          worker,
          delta,
          this.betterPlaceX,
          this.betterPlaceY,
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

  private move(
    worker: Worker,
    delta: number,
    moveToX: number,
    moveToY: number,
  ) {
    let x = worker.x;
    let y = worker.y;
    let isReachedTarget = false;

    if (isTest) {
      x = moveToX;
      y = moveToY;
      isReachedTarget = true;
    } else {
      const dx = moveToX - x;
      const dy = moveToY - y;

      const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;

      const angleDiff = targetAngle - worker.rotation;

      const normalizedAngleDiff = Math.atan2(
        Math.sin(angleDiff),
        Math.cos(angleDiff),
      );

      if (Math.abs(normalizedAngleDiff) > Navigator.rotationSpeed * delta) {
        worker.rotation +=
          Math.sign(normalizedAngleDiff) * Navigator.rotationSpeed * delta;
      } else {
        worker.rotation = targetAngle;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 15) {
          const vx = dx / distance;
          const vy = dy / distance;

          x += vx * Navigator.movingSpeed * delta;
          y += vy * Navigator.movingSpeed * delta;
        } else {
          isReachedTarget = true;
        }
      }
    }

    worker.position.set(x, y);
    return isReachedTarget;
  }

  private pathMovingPreparing() {
    this.path.shift();

    this.state = "moving";
    this.isInBetterPlace = false;
    this.betterPlaceX = undefined;
    this.betterPlaceY = undefined;
  }
}
