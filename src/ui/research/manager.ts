import { Container } from "pixi.js";
import { ResearchMenu } from "./menu";

export class ResearchManager extends Container {
  menu: ResearchMenu | undefined = undefined;

  buildingType: string | undefined = undefined;

  defaultTimer = 1000;

  researchProgress = {
    goal: this.defaultTimer,
    amountOfResearchers: 0,
    current: 0,
    usedPoints: 0,
    unusedPoints: 1,
  };

  public initialize() {
    this.menu = new ResearchMenu(() => this.useOneUpgradePoint());

    this.menu.eventMode = "static";

    this.menu.on("pointerdown", () => {});

    this.hideMenu();

    this.addChild(this.menu);
  }

  public useOneUpgradePoint() {
    if (this.researchProgress.unusedPoints > 0) {
      this.researchProgress.usedPoints++;
      this.researchProgress.unusedPoints--;

      if (this.isMenuVisible()) {
        this.showMenu();
      }
      return true;
    } else {
      return false;
    }
  }

  public updateReserachProgress(delta: number) {
    this.researchProgress.current +=
      delta * this.researchProgress.amountOfResearchers;
    if (this.researchProgress.current >= this.researchProgress.goal) {
      this.researchProgress.current = 0;
      this.researchProgress.unusedPoints++;

      this.researchProgress.goal += this.researchProgress.goal / 2;
    }

    if (this.isMenuVisible()) {
      this.showMenu();
    }
  }

  public showMenu() {
    if (this.menu) {
      this.menu.show(
        this.researchProgress.goal,
        this.researchProgress.current,
        this.researchProgress.usedPoints,
        this.researchProgress.unusedPoints,
      );
    }
  }

  public hideMenu() {
    if (this.menu) {
      this.menu.hide();
    }
  }

  public isMenuVisible() {
    if (this.menu) {
      return this.menu.visible;
    }
    return false;
  }
}

export const researchManager = new ResearchManager();
