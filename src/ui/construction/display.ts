import { Container, Graphics } from "pixi.js";
import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";
import { getConstructionDisplayPosition } from "@utils/ui-config";
import { Road } from "@roads/road";

export class ConstructionDisplay extends Container {
  constructor() {
    super();

    this.position.set(
      getConstructionDisplayPosition().x,
      getConstructionDisplayPosition().y,
    );
  }

  public displayBuildingType(buildingName: string | undefined) {
    if (buildingName) {
      if (buildingName == "Road") {
        const root = Road.crateRoadImage();

        root.eventMode = "none";
        this.addChild(root);
      } else {
        const BuildingClass = buildingMap[buildingName] || Platform;

        const building = new BuildingClass(0, 0);

        building.root.scale = 0.8;
        building.root.eventMode = "none";
        this.addChild(building.root);
      }
      this.visible = true;
    } else {
      this.removeChildren();
      this.visible = false;
    }
  }
}
