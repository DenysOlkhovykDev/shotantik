import { Container } from "pixi.js";
import { constructionManager } from "@construction/manager";
import { aircraft } from "@aircraft/aircraft";

import { createAirCraftByScenario } from "./test-aircraft";
import { createTestWorld } from "./test-world";
import { createUiElementsByScenario } from "./test-ui-elements";

import { defaultScenario } from "@test-scenarios/_default";
import { autoConstructionOfBuildings } from "@test-scenarios/auto-construction-of-buildings";
import { collisionBlueprints } from "@test-scenarios/collision-blueprints";
import { constructionOfBuildings } from "@test-scenarios/construction-of-buildings";
import { craftingResourcesForConstruction } from "@test-scenarios/crafting-resources-for-construction";
import { craftingResources } from "@test-scenarios/crafting-resources";
import { deleteBlueprint } from "@test-scenarios/delete-blueprint";
import { deleteBuilding } from "@test-scenarios/delete-building";
import { deliveringPriorities } from "@test-scenarios/delivering-priorities";
import { differentAngles } from "@test-scenarios/different-angles";
import { interfacePause } from "@test-scenarios/interface-pause";
import { interfaceSpeed } from "@test-scenarios/interface-speed";
import { joystickMoving } from "@test-scenarios/joystick-moving";
import { movingBlueprints } from "@test-scenarios/moving-blueprints";
import { movingResources } from "@test-scenarios/moving-resources";
import { multipleConstructionOfBuildings } from "@test-scenarios/multiple-construction-of-buildings";
import { multipleConstructionOfDifferentBuildings } from "@test-scenarios/multiple-construction-of-different-buildings";
import { multipleDelivering } from "@test-scenarios/multiple-delivering";
import { sceneRender } from "@test-scenarios/scene-render";
import { showingPointers } from "@test-scenarios/showing-pointers";
import { productionPriorities } from "@test-scenarios/production-priorities";
import { reuseResources } from "@test-scenarios/reuse-resources";
import { constructionMenu } from "@test-scenarios/construction-menu";

function getScenarioName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") || "default";
}

export interface AircraftScenario {
  buildings: {
    from: string;
    id: string;
    type: string;
    x: number;
    y: number;
  }[];

  resources?: {
    buildingId: string;
    resourceName: string;
    amount: number;
  }[];

  workers?: {
    buildingId: string;
    profession: string;
  }[];

  deliveryTasks?: {
    target: string;
    priority: number;
    resource: string;
    amount: number;
  }[];

  buildingTasks?: {
    from: string;
    x: number;
    y: number;
    buildingType: string;
  }[];
}

export interface UiElementsScenario {
  tutorials?: {
    text: string;
    showCondition: Function;
    hideCondition: Function;
    needOkButton: boolean;
    x?: number;
    y?: number;
    findTarget?: Function;
  }[];

  compasses?: {
    condition: Function;
    x: number;
    y: number;
  }[];
}

export interface Scenario {
  aircraft: AircraftScenario;

  uiElements?: UiElementsScenario;
}

const scenarios: Record<string, Scenario> = {
  default: defaultScenario,
  // tests
  "auto-construction-of-buildings": autoConstructionOfBuildings,
  "collision-blueprints": collisionBlueprints,
  "construction-menu": constructionMenu,
  "construction-of-buildings": constructionOfBuildings,
  "crafting-resources-for-construction": craftingResourcesForConstruction,
  "crafting-resources": craftingResources,
  "delete-blueprint": deleteBlueprint,
  "delete-building": deleteBuilding,
  "delivering-priorities": deliveringPriorities,
  "different-angles": differentAngles,
  "interface-pause": interfacePause,
  "interface-speed": interfaceSpeed,
  "joystick-moving": joystickMoving,
  "moving-blueprints": movingBlueprints,
  "moving-resources": movingResources,
  "multiple-construction-of-buildings": multipleConstructionOfBuildings,
  "multiple-construction-of-different-buildings":
    multipleConstructionOfDifferentBuildings,
  "multiple-delivering": multipleDelivering,
  "production-priorities": productionPriorities,
  "reuse-resources": reuseResources,
  "scene-render": sceneRender,
  "showing-pointers": showingPointers,
};

export function createTestSituation(worldLayer: Container) {
  const scenarioName = getScenarioName();
  const scenario = scenarios[scenarioName];

  if (!scenario) {
    throw new Error("Scenario not found: " + scenarioName);
  }

  createAirCraftByScenario(scenario.aircraft);
  if (scenario.uiElements) {
    createUiElementsByScenario(scenario.uiElements);
  }
  createTestWorld(worldLayer);

  aircraft.hideCraftSigns();
  aircraft.resetConstructionSource();
  constructionManager.hideButton();
}
