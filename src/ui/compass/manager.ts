import { Container } from "pixi.js";
import { Compass } from "./compass";

export class Compasses extends Container {
  compasses: Compass[] = [];

  public addCompass(x: number, y: number, condition: () => boolean) {
    const compass = new Compass(x, y, condition);
    this.compasses.push(compass);
    this.addChild(compass.graphics);
  }

  public deleteCompass(x: number, y: number) {
    for (let i = 0; i < this.compasses.length; i++) {
      if (
        this.compasses[i].compassTargetX === x &&
        this.compasses[i].compassTargetY === y
      ) {
        this.compasses[i].destroy();
        this.compasses.splice(i, 1);
        i--;
      }
    }
  }

  public updateCompasses() {
    for (let i = 0; i < this.compasses.length; i++) {
      const result = this.compasses[i].condition();
      this.compasses[i].visible = result;

      if (result) {
        this.compasses[i].updateCompassPosition();
      }
    }
  }
}

export const compasses: Compasses = new Compasses();
