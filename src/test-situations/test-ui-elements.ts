import { compasses } from "@compass/manager";
import { tutorials } from "@tutorial/manager";

import { UiElementsScenario } from "@test-situations/test-situation";
import { questList } from "@questlist/manager";

export function createUiElementsByScenario(scenario: UiElementsScenario) {
  for (const tutorial of scenario.tutorials || []) {
    tutorials.addTutorial(
      tutorial.text,
      tutorial.showCondition,
      tutorial.hideCondition,
      tutorial.needOkButton,
      tutorial.target,
      tutorial.afterClose,
    );
  }

  for (const quest of scenario.quests || []) {
    if (quest.building !== undefined) {
      questList.addBuildingQuest(
        quest.name,
        quest.text,
        quest.building,
        quest.showCondition,
        quest.hideCondition,
      );
    } else if (quest.resource !== undefined) {
      questList.addCraftingQuest(
        quest.name,
        quest.text,
        quest.resource,
        quest.showCondition,
        quest.hideCondition,
      );
    } else {
      questList.addSimpleQuest(
        quest.name,
        quest.text,
        quest.showCondition,
        quest.hideCondition,
      );
    }
  }

  for (const compass of scenario.compasses || []) {
    compasses.addCompass(compass.x, compass.y, compass.condition);
  }
}
