import { Container, Graphics } from "pixi.js";
import { aircraft, buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";
import { getConstructionDisplayPosition } from "@utils/ui-config";
import { Road } from "@roads/road";
import { menuItems } from "@utils/menu-items";
import { constructionManager } from "./manager";

export class ConstructionDisplay extends Container {
  static display = {
    scale: 0.8,
    size: 60,

    strokeWidth: 4,
    strokeColor: "#000000",
  };

  static cancelButton = {
    x: -100,
    width: 40,
    height: 40,

    strokeWidth: 8,
    strokeColor: "#ff0000",
  };

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

        root.scale = ConstructionDisplay.display.scale;
        root.eventMode = "none";
        this.addChild(root);
      } else {
        const BuildingClass = buildingMap[buildingName] || Platform;

        const building = new BuildingClass(0, 0, true);

        building.root.scale = ConstructionDisplay.display.scale;
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
      .circle(0, 0, ConstructionDisplay.display.size)
      .fill({ color: backgroundColor })
      .stroke({
        width: ConstructionDisplay.display.strokeWidth,
        color: ConstructionDisplay.display.strokeColor,
      });
    this.addChild(hotbar);
  }

  private createCancelButton() {
    const cancelButton = new Graphics();

    cancelButton
      .rect(
        ConstructionDisplay.cancelButton.x -
          ConstructionDisplay.cancelButton.width / 2,
        -ConstructionDisplay.cancelButton.height / 2,
        ConstructionDisplay.cancelButton.width,
        ConstructionDisplay.cancelButton.height,
      )
      .fill({ alpha: 0 });

    cancelButton
      .moveTo(
        ConstructionDisplay.cancelButton.x -
          ConstructionDisplay.cancelButton.width / 2,
        -ConstructionDisplay.cancelButton.height / 2,
      )
      .lineTo(
        ConstructionDisplay.cancelButton.x +
          ConstructionDisplay.cancelButton.width / 2,
        ConstructionDisplay.cancelButton.height / 2,
      )
      .moveTo(
        ConstructionDisplay.cancelButton.x -
          ConstructionDisplay.cancelButton.width / 2,
        ConstructionDisplay.cancelButton.height / 2,
      )
      .lineTo(
        ConstructionDisplay.cancelButton.x +
          ConstructionDisplay.cancelButton.width / 2,
        -ConstructionDisplay.cancelButton.height / 2,
      )
      .stroke({
        width: ConstructionDisplay.cancelButton.strokeWidth,
        color: ConstructionDisplay.cancelButton.strokeColor,
      });

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
