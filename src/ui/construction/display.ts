import { Container, Graphics } from "pixi.js";
import { aircraft, buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";
import { getConstructionDisplayPosition } from "@utils/ui-config";
import { Road } from "@roads/road";
import { menuItems } from "./menu";
import { constructionManager } from "./manager";

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
      this.createDisplayBackround(buildingName);
      this.createCancelButton();

      if (buildingName === "Road") {
        const root = Road.crateRoadImage(0, 0);

        root.scale = 0.8;
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

  private createDisplayBackround(buildingName: string) {
    const backgroundColor = menuItems.find(
      (item) => item.label === buildingName,
    )?.color;

    const hotbar = new Graphics();
    hotbar
      .circle(0, 0, 60)
      .fill({ color: backgroundColor })
      .stroke({ width: 4, color: "#000000" });
    this.addChild(hotbar);
  }

  private createCancelButton() {
    const cancelButton = new Graphics();

    cancelButton.rect(-120, -20, 40, 40).fill({ color: "#ffffff", alpha: 0 });

    cancelButton
      .moveTo(-120, -20)
      .lineTo(-80, 20)
      .moveTo(-120, 20)
      .lineTo(-80, -20)
      .stroke({ width: 8, color: "#ff0000" });

    cancelButton.eventMode = "static";
    cancelButton.on("pointerdown", () => {
      constructionManager.setBuildingType(undefined);

      aircraft.resetConstructionSource();
      aircraft.deSelectAllBuildings();

      constructionManager.hideButton();
      constructionManager.hideMenu();
      constructionManager.updateDisplayBuildingType();
    });

    this.addChild(cancelButton);
  }
}
