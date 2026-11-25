import { compasses } from "@compass/manager";
import { tutorials } from "@tutorial/manager";

import { UiElementsScenario } from "@test-situations/test-situation";

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

  for (const compass of scenario.compasses || []) {
    compasses.addCompass(compass.x, compass.y, compass.condition);
  }
}
