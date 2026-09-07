import { Container, Graphics } from "pixi.js";
import { gameScreen } from "../../game-config";
import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/platform";

export class ConstructionDisplay extends Container {
  constructor() {
    super();

    this.position.set(
      gameScreen.width / 2,
      gameScreen.height - gameScreen.height / 20,
    );
  }

  public displayBuildingType(buildingName: string | undefined) {
    if (buildingName) {
      const BuildingClass = buildingMap[buildingName] || Platform;

      const building = new BuildingClass(0, 0);

      building.root.scale = 0.8;

      building.root.eventMode = "none";

      this.addChild(building.root);
      this.visible = true;
    } else {
      this.removeChildren();
      this.visible = false;
    }
  }
}

// Мені воно не дуже подобається як виглядає

// Треба кнопку відміни будівництва
