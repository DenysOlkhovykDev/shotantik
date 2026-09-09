import { Scenario } from "@test-situations/test-situation";
import { gameScreen } from "../../src/game-config";

import {
  findFirstBlueprint,
  findFirstBuilding,
  findFirstBuildingByName,
  hasClickedOnConstructionMenuButton,
  hasClickedOnEngine,
  hasClickedOnFirstBlueprint,
  hasClickedOnPlatform,
  hasClickedOnPlatformAfterPlacingBlueprint,
  hasClickedOnPlatformNearTarget,
  hasDestroyedOneOfImportantBuildings,
  hasEngineBuilded,
  hasPlacedSecondBlueprint,
  hasSelectedBuildingFromConstructionMenu,
  isNearTarget,
} from "@utils/tutorial-conditions";

export const defaultScenario: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "collector", type: "Collector", x: 260, y: 550 },
      { from: "p0", id: "extractor", type: "Extractor", x: 460, y: 550 },
      { from: "p0", id: "farm", type: "Farm", x: 360, y: 500 },
      { from: "p0", id: "p1", type: "Platform", x: 360, y: 700 },
      { from: "p1", id: "p2", type: "Platform", x: 360, y: 800 },
    ],
    workers: [
      { buildingId: "p0", profession: "building" },
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
    buildingTasks: [
      {
        from: "p2",
        x: 360,
        y: 900,
        buildingType: "Engine",
      },
    ],
  },
  uiElements: {
    tutorials: [
      {
        text: `This is the
blueprint 
of Engine`,
        showCondition: () => true,
        hideCondition: () => hasClickedOnFirstBlueprint(),
        needOkButton: false,
        findTarget: () => findFirstBlueprint(),
      },
      {
        text: `This is the
Platform.
You can build
from it`,
        showCondition: () => hasClickedOnFirstBlueprint(),
        hideCondition: () => hasClickedOnPlatform(),
        needOkButton: false,
        findTarget: () => findFirstBuilding(),
      },
      {
        text: `Click to open
building menu`,
        showCondition: () => hasClickedOnPlatform(),
        hideCondition: () => hasClickedOnConstructionMenuButton(),
        needOkButton: false,
        x: gameScreen.width / 2,
        y: gameScreen.height - gameScreen.height / 20,
      },
      {
        text: "Select the Mixer",
        showCondition: () => hasClickedOnConstructionMenuButton(),
        hideCondition: () => hasSelectedBuildingFromConstructionMenu(),
        needOkButton: false,
        x: 360,
        y: 1070,
      },
      {
        text: `Place it 
here`,
        showCondition: () => hasSelectedBuildingFromConstructionMenu(),
        hideCondition: () => hasPlacedSecondBlueprint(),
        needOkButton: false,
        x: 475,
        y: 675,
      },
      {
        text: `Also build
Assembler  
and Grinder`,
        showCondition: () => hasPlacedSecondBlueprint(),
        hideCondition: () => hasClickedOnPlatformAfterPlacingBlueprint(),
        needOkButton: true,
        findTarget: () => findFirstBuilding(),
      },
      {
        text: `Use Engine
to follow the
green compass 
arrow`,
        showCondition: () => hasEngineBuilded(),
        hideCondition: () => hasClickedOnEngine(),
        needOkButton: false,
        findTarget: () => findFirstBuildingByName("Engine"),
      },
      {
        text: `You Win`,
        showCondition: () => isNearTarget(),
        hideCondition: () => hasClickedOnPlatformNearTarget(),
        needOkButton: true,
        findTarget: () => findFirstBuilding(),
      },
      {
        text: `You can't
complete tutorial.
Try again`,
        showCondition: () => hasDestroyedOneOfImportantBuildings(),
        hideCondition: () => false,
        needOkButton: true,
        findTarget: () => findFirstBuilding(),
      },
    ],

    compasses: [
      {
        condition: () => hasEngineBuilded(),
        x: 1000,
        y: 100,
      },
    ],
  },
};
