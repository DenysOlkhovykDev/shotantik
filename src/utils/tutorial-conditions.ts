import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import { joystick } from "@joystick/joystick";
import { getDistance } from "@utils/basic-geometry";
import { getWorldCoordinates } from "../../src/main";

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

export function isNearTarget() {
  return (
    getDistance(getWorldCoordinates().x, getWorldCoordinates().y, 1000, 100) <
    50
  );
}

export function hasClickedOnPlatformNearTarget() {
  return isNearTarget() && hasClickedOnPlatform();
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
