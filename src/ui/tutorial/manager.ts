import { Container } from "pixi.js";
import { Tutorial } from "./tutorial";

export class Tutorials extends Container {
  tutorials: Tutorial[] = [];

  currentTutorial = 0;
  public addTutorial(
    text: string,
    showCondition: () => boolean,
    hideCondition: () => boolean,
    needOkButton: boolean,
    x?: number,
    y?: number,
    findTarget?: () => { x: number; y: number },
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
      for (let i = 0; i < this.tutorials.length; i++) {
        this.tutorials[i].updateTutorial();
      }
    }
  }
}

export const tutorials: Tutorials = new Tutorials();
