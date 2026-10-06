import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import { joystick } from "@joystick/joystick";
import { getDistance } from "@utils/basic-geometry";
import { getWorldCoordinates, getWorldRotation } from "../../src/main";
import { researchManager } from "../ui/research/manager";
import { getGameScreenCenter } from "./ui-config";
import { Researcher } from "@aircraft/modules/researcher";

export function hasAtleastOneBlueprint() {
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
  const engines = aircraft.buildings.filter((b) => b.buildingType === "Engine");

  return engines.length > 0;
}

export function hasClickedOnEngine() {
  return joystick.isVisible();
}

let wasNearTarget = false;

export function isNearTarget() {
  const { x: worldX, y: worldY } = getWorldCoordinates();

  const cos = Math.cos(-getWorldRotation());
  const sin = Math.sin(-getWorldRotation());

  for (const building of aircraft.buildings) {
    const localX =
      building.root.x + building.buildingConfig.boundsCenter.x - 360;

    const localY =
      building.root.y + building.buildingConfig.boundsCenter.y - 640;

    const buildingX = worldX + localX * cos - localY * sin;

    const buildingY = worldY + localX * sin + localY * cos;

    const distance = getDistance(buildingX, buildingY, 1000, 100);

    if (
      distance <
      building.buildingConfig.boundsRadius +
        Researcher.buildingConfig.boundsRadius
    ) {
      wasNearTarget = true;
      return true;
    }
  }

  return wasNearTarget;
}

export function hasClickedOnPlatformNearTarget() {
  return isNearTarget() && hasClickedOnPlatform();
}

export function hasClickedOnUpgradeEngineButton() {
  return researchManager.researchProgress.usedPoints > 0;
}

export function hasResearcherBuilded() {
  const researchers = aircraft.buildings.filter(
    (b) => b.buildingType === "Researcher",
  );

  return researchers.length > 0;
}

export function hasClickedOnResearcher() {
  return researchManager.isMenuVisible();
}

export function hasClosedResearchMenu() {
  return hasClickedOnUpgradeEngineButton() && !researchManager.isMenuVisible();
}

export function getPositionOfEngineUpgradeButton() {
  return {
    x: 480,
    y: 995,
  };
}

export function getPositionOfResearchingProgressBar() {
  return {
    x: getGameScreenCenter().x,
    y: 1200,
  };
}

export function hasDestroyedOneOfImportantBuildings() {
  const buildings = aircraft.buildings;

  const farms = buildings.filter((b) => b.buildingType === "Farm");
  const extractors = buildings.filter((b) => b.buildingType === "Extractor");
  const collectors = buildings.filter((b) => b.buildingType === "Collector");

  return (
    farms.length === 0 || extractors.length === 0 || collectors.length === 0
  );
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
