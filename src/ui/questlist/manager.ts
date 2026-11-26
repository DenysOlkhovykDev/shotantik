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

  public quests = new Map<string, Quest>();

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

    this.display = new QuestListDisplay();

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
    return new Map([...this.quests].filter(([, quest]) => quest.isActive)).size;
  }

  public updateQuests() {
    let needUpdate = false;
    this.quests.forEach((item) => {
      if (item.showCondition() && !item.hideCondition() && !item.isActive) {
        needUpdate = true;
        item.isActive = true;
      }

      if (item.hideCondition() && item.isActive) {
        needUpdate = true;
        item.isActive = false;
      }
    });

    if (this.display && needUpdate) {
      this.display.createDisplay(
        getQuestListMenuPosition().x,
        getQuestListMenuPosition().y,
        new Map([...this.quests].filter(([, quest]) => quest.isActive)),
      );

      if (this.button && !this.isDisplayVisible()) {
        this.button.showIndicator();
      }
    }
  }

  public addBuildingQuest(
    name: string,
    text: string,
    building: string,
    showCondition: () => boolean,
    hideCondition: () => boolean,
  ) {
    this.addQuest(name, {
      text,
      building,
      showCondition,
      hideCondition,
      isActive: false,
    });
  }

  public addCraftingQuest(
    name: string,
    text: string,
    resource: string,
    showCondition: () => boolean,
    hideCondition: () => boolean,
  ) {
    this.addQuest(name, {
      text,
      resource,
      showCondition,
      hideCondition,
      isActive: false,
    });
  }

  public addSimpleQuest(
    name: string,
    text: string,
    showCondition: () => boolean,
    hideCondition: () => boolean,
  ) {
    this.addQuest(name, {
      text,
      showCondition,
      hideCondition,
      isActive: false,
    });
  }

  private addQuest(name: string, quest: Quest) {
    if (this.display) {
      if (!this.quests.has(name)) {
        this.quests.set(name, quest);
      }
    }
  }
}

export const questList = new QuestListManager();
