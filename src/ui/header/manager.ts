import { Container } from "pixi.js";
import { gameScreen } from "../../game-config";
import { Display } from "./display";
import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import { InfoButton } from "./info-button";
import { DeleteButton } from "./delete-button";

class Header extends Container {
  display: Display;
  infoButton: InfoButton;
  deleteButton: DeleteButton;

  constructor() {
    super();

    this.display = new Display("");
    this.infoButton = new InfoButton();
    this.deleteButton = new DeleteButton();

    this.addChild(this.display);
    this.addChild(this.deleteButton);
    this.addChild(this.infoButton);

    this.position.set(gameScreen.width / 2, 20);
  }

  updateHeader() {
    if (
      aircraft.selectedBuilding.index !== undefined &&
      aircraft.selectedBuilding.index >= 0 &&
      !constructionManager.getBuildingType()
    ) {
      const buildingType = aircraft.getSelectedNodeType();

      if (buildingType !== undefined) {
        this.display.showText(buildingType);
        this.infoButton.showButton();
        this.deleteButton.showButton();
      } else {
        this.display.hideText();
        this.infoButton.hideButton();
        this.deleteButton.hideButton();
      }
    } else {
      this.display.hideText();
      this.infoButton.hideButton();
      this.deleteButton.hideButton();
    }
  }
}

export const header = new Header();
