import { type Container } from "pixi.js";

import { type Building } from "@aircraft/building";

import { Worker } from "@workers/worker";

export class Workers {
  public workers: Worker[] = [];

  public addWorker(
    x: number,
    y: number,
    container: Container,
    currentPlatform: Building,
    profession: string,
  ) {
    const worker = new Worker(x, y, currentPlatform, profession);
    this.workers.push(worker);
    container.addChild(worker);
  }

  public moveWorkers(delta: number) {
    for (const worker of this.workers) {
      worker.moveWorker(delta);
    }
  }
}
