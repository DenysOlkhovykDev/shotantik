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

export function hasEngineBuilded() {
  return aircraft.buildings.some((b) => b.buildingType === "Engine");
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

export function hasClickedOnPlatformNearTarget() {
  return isFirstTargetReached() && hasClickedOnPlatform();
}

export function hasClickedOnUpgradeEngineButton() {
  return researchManager.researchProgress.usedPoints > 0;
}

export function hasResearcherBuilded() {
  return aircraft.buildings.some((b) => b.buildingType === "Researcher");
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

let hasClosedNotEnoughResourcesTutorialFlag = false;
export function hasClosedNotEnoughResourcesTutorial() {
  return hasClosedNotEnoughResourcesTutorialFlag;
}

export function closeNotEnoughResourcesTutorial() {
  hasClosedNotEnoughResourcesTutorialFlag = true;
}

export function addQuestsForBuilding() {
  questList.addBuildingQuest("build collector", "Build x1", "Collector");
  questList.addBuildingQuest("build farm", "Build x1", "Farm");
  questList.addBuildingQuest("build extractor", "Build x1", "Extractor");
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

export function hasBuildedCollector() {
  return aircraft.buildings.some((b) => b.buildingType === "Collector");
}

export function removeQuestAboutCollector() {
  questList.deleteQuest("build collector");
}

export function hasBuildedFarm() {
  return aircraft.buildings.some((b) => b.buildingType === "Farm");
}

export function removeQuestAboutFarm() {
  questList.deleteQuest("build farm");
}

export function hasBuildedExtractor() {
  return aircraft.buildings.some((b) => b.buildingType === "Extractor");
}

export function removeQuestAboutExtractor() {
  questList.deleteQuest("build extractor");
}

export function hasBuildedMixer() {
  return aircraft.buildings.some((b) => b.buildingType === "Mixer");
}

export function addQuestsForAdvancedBuilding() {
  questList.addBuildingQuest("build mixer", "Build x1", "Mixer");
  questList.addBuildingQuest("build assembler", "Build x1", "Assembler");
  questList.addBuildingQuest("build grinder", "Build x1", "Grinder");
}

export function removeQuestAboutMixer() {
  questList.deleteQuest("build mixer");
}

export function hasBuildedGrinder() {
  return aircraft.buildings.some((b) => b.buildingType === "Grinder");
}

export function removeQuestAboutGrinder() {
  questList.deleteQuest("build grinder");
}

export function hasBuildedAssembler() {
  return aircraft.buildings.some((b) => b.buildingType === "Assembler");
}

export function removeQuestAboutAssembler() {
  questList.deleteQuest("build assembler");
}

export function addQuestsFollowTheGreenArrow() {
  questList.addSimpleQuest("follow the green arrow", "Move to arrow");
}

export function removeQuestFollowTheGreenArrow() {
  questList.deleteQuest("follow the green arrow");
}

export function addQuestsAboutResearcher() {
  questList.addBuildingQuest("build researcher", "Build x1", "Researcher");
}

export function removeQuestAboutResearcher() {
  questList.deleteQuest("build researcher");
}
