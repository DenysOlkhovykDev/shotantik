import { Container } from "pixi.js";
import { Tutorial } from "./tutorial";

export class Tutorials extends Container {
  tutorials: Tutorial[] = [];

  currentTutorial = 0;
  public addTutorial(
    text: string,
    showCondition: Function,
    hideCondition: Function,
    needOkButton: boolean,
    x?: number,
    y?: number,
    findTarget?: Function,
  ) {
    const tutorial = new Tutorial(
      text,
      showCondition,
      hideCondition,
      needOkButton,
      x,
      y,
      findTarget,
    );
    this.tutorials.push(tutorial);
    this.addChild(tutorial);
  }

  public updateTutorials() {
    if (this.tutorials.length > 0) {
      this.tutorials[this.currentTutorial].updateTutorial();
      if (!this.tutorials[this.currentTutorial].isActive) {
        if (this.currentTutorial < this.tutorials.length - 1) {
          this.currentTutorial++;
        }
      }
    }
  }
}

export const tutorials: Tutorials = new Tutorials();
