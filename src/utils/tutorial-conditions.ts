import { aircraft } from "@aircraft/aircraft";

import { onGroundObjects } from "@objects/research-points";

import { constructionManager } from "@construction/manager";
import { joystick } from "@joystick/joystick";
import { researchManager } from "@research/manager";

import { buildingThemes } from "@utils/building-themes";
import { questList } from "@questlist/manager";

export function hasAtLeastOneBlueprint() {
  return aircraft.blueprints.length > 0;
}

export function hasClickedOnFirstBlueprint() {
  return (
    aircraft.blueprints.length > 0 &&
    aircraft.blueprints[0].recipeSign.children.length > 0
  );
}

export function hasClickedOnPlatform() {
  return constructionManager.isButtonVisible();
}

export function hasClickedOnConstructionMenuButton() {
  return constructionManager.isMenuVisible();
}

export function hasSelectedBuildingFromConstructionMenu() {
  return constructionManager.getBuildingType() !== undefined;
}

export function hasPlacedFirstBlueprint() {
  return aircraft.blueprints.length > 0;
}

export function hasPlacedSecondBlueprint() {
  return aircraft.blueprints.length > 1;
}

export function hasClickedOnPlatformAfterPlacingBlueprint() {
  return (
    constructionManager.isButtonVisible() && aircraft.blueprints.length > 1
  );
}

export function hasBuilt(name: string) {
  return aircraft.buildings.some((b) => b.buildingType === name);
}

export function hasClickedOnEngine() {
  return joystick.isVisible();
}

let firstTargetReached = false;

export function isFirstTargetReached() {
  return firstTargetReached;
}

export function checkFirstTargetReached() {
  if (firstTargetReached || !isCurrentTargetReached()) {
    return;
  }

  firstTargetReached = true;

  const researcher = buildingThemes.find((item) => item.label === "Researcher");

  if (researcher) {
    constructionManager.addMenuElement(researcher);
  }
}

export function isCurrentTargetReached() {
  return onGroundObjects.objectsOnGround[0]?.isCollide ?? false;
}

export function hasClickedOnUpgradeEngineButton() {
  return researchManager.researchProgress.usedPoints > 0;
}

export function hasClickedOnResearcher() {
  return researchManager.isMenuVisible();
}

export function hasClosedResearchMenu() {
  return hasClickedOnUpgradeEngineButton() && !researchManager.isMenuVisible();
}

export function findFirstBlueprint() {
  if (aircraft.blueprints.length > 0) {
    const blueprint = aircraft.blueprints[0];
    return {
      x: blueprint.x,
      y: blueprint.y,
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}

export function findFirstBuilding() {
  if (aircraft.buildings.length > 0) {
    const building = aircraft.buildings[0];
    return {
      x: building.x,
      y: building.y,
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}

export function findFirstBuildingByName(name: string) {
  if (aircraft.buildings.length > 0) {
    const buildings = aircraft.buildings.filter((b) => b.buildingType === name);

    if (buildings.length > 0) {
      return {
        x: buildings[0].x,
        y: buildings[0].y,
      };
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}

let hasClosedGameAboutTutorialFlag = false;
export function hasClosedGameAboutTutorial() {
  return hasClosedGameAboutTutorialFlag;
}
export function closeGameAboutTutorial() {
  hasClosedGameAboutTutorialFlag = true;
}

export function hasOpenedQuestListDisplay() {
  return questList.isDisplayVisible();
}

let hasClosedRecipeSignTutorialFlag = false;
export function hasClosedRecipeSignTutorial() {
  return hasClosedRecipeSignTutorialFlag;
}
export function closeRecipeSignTutorial() {
  hasClosedRecipeSignTutorialFlag = true;
}

let hasClosedNotEnoughResourcesTutorialFlag = false;
export function hasClosedNotEnoughResourcesTutorial() {
  return hasClosedNotEnoughResourcesTutorialFlag;
}
export function closeNotEnoughResourcesTutorial() {
  hasClosedNotEnoughResourcesTutorialFlag = true;
}

export function hasCheckedQuests() {
  return questList.isButtonIndicatorVisible() && hasOpenedQuestListDisplay();
}

export function hasClosedQuestDisplay() {
  return (
    !questList.isButtonIndicatorVisible() &&
    !hasOpenedQuestListDisplay() &&
    questList.getCurrentQuestsAmount() === 3
  );
}

export function isShownCraftSignOn(name: string) {
  if (aircraft.buildings.length > 0) {
    const collectors = aircraft.buildings.filter(
      (b) => b.buildingType === name,
    );

    if (collectors.length > 0) {
      return collectors[0].recipeSign.isShown();
    }
  }
  return false;
}
