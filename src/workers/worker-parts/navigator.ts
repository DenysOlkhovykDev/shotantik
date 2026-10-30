import { type Building } from "@aircraft/building";

import { type Task } from "@dashboard/task";
import { type Worker } from "@workers/worker";

const isTest = import.meta.env.MODE === "test";

export class Navigator {
  static speed = 2;

  private path: Building[] = [];
  state: string;

  constructor(public currentPlatform: Building) {
    this.state = "stay";
  }

  public moveToTargetBuilding(worker: Worker, delta: number) {
    if (this.path.length > 0) {
      const targetCenter = this.path[0].getBaseCenterInWorld();

      if (this.move(worker, delta, targetCenter.x, targetCenter.y)) {
        this.onReachTargetBuilding();
      }
    } else {
      this.state = "stay";
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

      const angle = Math.atan2(dy, dx);
      worker.rotation = angle + Math.PI / 2;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 15) {
        const vx = dx / distance;
        const vy = dy / distance;

        x += vx * Navigator.speed * delta;
        y += vy * Navigator.speed * delta;
      } else {
        isReachedTarget = true;
      }
    }

    worker.position.set(x, y);
    return isReachedTarget;
  }

  private pathMovingPreparing() {
    this.path.shift();

    this.state = "moving";
  }
}
