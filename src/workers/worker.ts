import { Graphics, Container } from "pixi.js";

import { type Building } from "@aircraft/building";

import { Inventory } from "@workers/worker-parts/inventory";
import { TaskManager } from "@workers/worker-parts/task-manager";
import { Navigator } from "@workers/worker-parts/navigator";
import { Legs } from "@workers/worker-parts/legs";

export class Worker extends Container {
  public body = new Container();
  public head: Graphics = new Graphics();
  private inventory: Inventory = new Inventory();

  public legs: Legs = new Legs();

  private tasks: TaskManager;
  navigator: Navigator;

  private mainColor = "#000000";

  static movingSpeed = 1;

  constructor(
    x: number,
    y: number,
    currentPlatform: Building,
    profession: string,
  ) {
    super();

    this.navigator = new Navigator(currentPlatform);
    this.tasks = new TaskManager(profession);

    this.draw();
    this.initEvents();

    this.addChild(this.legs);
    this.addChild(this.body);
    this.body.addChild(this.head);
    this.body.addChild(this.inventory);

    this.position.set(0, 0);
    this.teleportTo(x, y);
  }

  private draw() {
    this.head
      .circle(0, 0, 8)
      .stroke({ width: 3, color: "#000000" })
      .fill(this.mainColor);

    this.head.circle(-5, -4, 2).fill("#ffffff");
    this.head.circle(5, -4, 2).fill("#ffffff");

    let jobColor = "#000000";
    if (this.tasks.profession === "building") {
      jobColor = "#127ce1";
    } else if (this.tasks.profession === "delivering") {
      jobColor = "#bdb434";
    } else if (this.tasks.profession === "production") {
      jobColor = "#2ccb1a";
    }

    this.head.circle(0, 3, 4).fill(jobColor);
  }

  private initEvents() {
    this.eventMode = "none";
  }

  public teleportTo(x: number, y: number) {
    this.body.position.set(x, y);
    this.body.rotation = 0;
    this.legs.setWorkerPosition(x, y);
  }

  public moveWorker(delta: number) {
    if (!this.tasks.task) {
      this.pickTaskAndPath();
      if (this.tasks.task === undefined) {
        this.navigator.moveToBetterPlace(this, Worker.movingSpeed, delta);
      }
    } else if (this.navigator.state === "moving") {
      this.handleMoving(delta);
    } else if (this.navigator.state === "stay") {
      this.handleStaying(delta);
    }
  }

  private pickTaskAndPath() {
    this.tasks.pickTask(this.navigator.currentPlatform);
    if (this.tasks.task) {
      if (this.tasks.profession === "production") {
        this.navigator.pickPathToBuilding(this.tasks.task);
      } else {
        this.navigator.pickPathToResource(this.tasks.task);
      }
    }
  }

  private handleMoving(delta: number) {
    this.navigator.moveToTargetBuilding(this, Worker.movingSpeed, delta);
  }

  private handleStaying(delta: number) {
    if (this.tasks.profession === "production") {
      this.tasks.handleProductionLogic(delta);
    } else {
      this.handleStoreOrGiveResource();

      if (this.tasks.task) {
        this.navigator.pickPathToBuilding(this.tasks.task);
      }
    }
  }

  private handleStoreOrGiveResource() {
    if (this.inventory.storage) {
      this.tasks.giveResource(this.inventory.storage);

      this.inventory.removeResource();
    } else {
      const result = this.tasks.takeResource(this.navigator.currentPlatform);

      if (result) {
        this.inventory.storeResource(result);
      }
    }
  }
}
