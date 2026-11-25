import { Container } from "pixi.js";

import { constructionManager } from "@construction/manager";
import { researchManager } from "@research/manager";
import { joystick } from "@joystick/joystick";
import { QuestListDisplay, Quest } from "@questlist/display";
import { QuestListButton } from "@questlist/button";

import {
  getQuestListButtonPosition,
  getQuestListMenuPosition,
} from "@utils/ui-config";

export class QuestListManager extends Container {
  private display: QuestListDisplay | undefined = undefined;
  private button: QuestListButton | undefined = undefined;

  initialize() {
    this.button = new QuestListButton();

    this.button.eventMode = "static";

    this.button.on("pointerdown", (e) => {
      this.showDisplay();
      e.stopPropagation();
    });

    this.button.position.set(
      getQuestListButtonPosition().x,
      getQuestListButtonPosition().y,
    );

    this.addChild(this.button);

    this.display = new QuestListDisplay(
      getQuestListMenuPosition().x,
      getQuestListMenuPosition().y,
    );

    this.hideDisplay();

    this.addChild(this.display);
  }

  public showDisplay() {
    constructionManager.hideButton();
    constructionManager.hideMenu();

    researchManager.hideMenu();

    joystick.hide();

    if (this.display) {
      this.display.show();
    }
    if (this.button) {
      this.button.hideIndicator();
    }
  }

  public hideDisplay() {
    if (this.display) {
      this.display.hide();
    }
  }

  public isDisplayVisible() {
    if (this.display) {
      return this.display.isVisible();
    }
    return false;
  }

  public isButtonIndicatorVisible() {
    if (this.button) {
      return this.button.isIndicatorVisible();
    }
    return false;
  }

  public getCurrentQuestsAmount() {
    if (this.display) {
      return this.display.quests.length;
    }
    return 0;
  }

  public addBuildingQuest(name: string, text: string, building: string) {
    this.addQuest({ name, text, building });
  }

  public addCraftingQuest(name: string, text: string, resource: string) {
    this.addQuest({ name, text, resource });
  }

  public addSimpleQuest(name: string, text: string) {
    this.addQuest({ name, text });
  }

  private addQuest(quest: Quest) {
    if (this.display) {
      if (
        this.display.quests.findIndex((el) => el.name === quest.name) === -1
      ) {
        this.display.quests.push(quest);

        const position = getQuestListMenuPosition();

        this.display.createDisplay(position.x, position.y);

        this.hideDisplay();

        if (this.button) {
          this.button.showIndicator();
        }
      }
    }
  }
  public deleteQuest(name: string) {
    if (this.display) {
      this.display.quests = this.display.quests.filter(
        (quest) => quest.name !== name,
      );

      this.display.createDisplay(
        getQuestListMenuPosition().x,
        getQuestListMenuPosition().y,
      );
    }
  }
}

export const questList = new QuestListManager();
