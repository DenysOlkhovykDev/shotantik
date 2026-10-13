import { Container } from "pixi.js";
import { Display } from "./display";
import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import { InfoButton } from "./info-button";
import { InfoBoard } from "./info-board";
import { DeleteButton } from "./delete-button";
import { getHeaderPosition } from "@utils/ui-config";

class Header extends Container {
  display: Display;
  infoButton: InfoButton;
  deleteButton: DeleteButton;
  infoBoard: InfoBoard;

  constructor() {
    super();

    this.display = new Display();
    this.infoBoard = new InfoBoard();
    this.infoButton = new InfoButton(
      () => this.infoBoard.show(),
      () => this.infoBoard.hide(),
    );
    this.deleteButton = new DeleteButton();

    this.infoBoard.position.set(0, 100);
    this.infoButton.position.set(-50, 40);
    this.deleteButton.position.set(10, 40);

    this.addChild(this.display);
    this.addChild(this.infoBoard);
    this.addChild(this.infoButton);
    this.addChild(this.deleteButton);

    this.position.set(getHeaderPosition().x, getHeaderPosition().y);
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
