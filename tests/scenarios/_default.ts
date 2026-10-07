import { type Scenario } from "@test-situations/test-situation";
import {
  getConstructionButtonPosition,
  getMixerPositionInConstructionMenu,
} from "@utils/ui-config";

import {
  findFirstBlueprint,
  findFirstBuilding,
  findFirstBuildingByName,
  getPositionOfEngineUpgradeButton,
  getPositionOfResearchingProgressBar,
  hasAtleastOneBlueprint,
  hasClickedOnConstructionMenuButton,
  hasClickedOnEngine,
  hasClickedOnFirstBlueprint,
  hasClickedOnPlatform,
  hasClickedOnPlatformAfterPlacingBlueprint,
  hasClickedOnPlatformNearTarget,
  hasClickedOnResearcher,
  hasClickedOnUpgradeEngineButton,
  hasClosedResearchMenu,
  hasDestroyedOneOfImportantBuildings,
  hasEngineBuilded,
  hasPlacedSecondBlueprint,
  hasResearcherBuilded,
  hasSelectedBuildingFromConstructionMenu,
  isFirstTargetReached,
} from "@utils/tutorial-conditions";

export const defaultScenario: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "collector", type: "Collector", x: 260, y: 590 },
      { from: "p0", id: "extractor", type: "Extractor", x: 460, y: 590 },
      { from: "p0", id: "farm", type: "Farm", x: 360, y: 540 },
      { from: "p0", id: "p1", type: "Platform", x: 360, y: 740 },
      { from: "p1", id: "p2", type: "Platform", x: 360, y: 840 },
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
        y: 940,
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
        showCondition: () => hasAtleastOneBlueprint() && !hasEngineBuilded(),
        hideCondition: () => hasClickedOnFirstBlueprint(),
        needOkButton: false,
        findTarget: () => findFirstBlueprint(),
      },
      {
        text: `This is the
Platform.
You can build
from it`,
        showCondition: () =>
          hasClickedOnFirstBlueprint() && !hasEngineBuilded(),
        hideCondition: () => hasClickedOnPlatform(),
        needOkButton: false,
        findTarget: () => findFirstBuilding(),
      },
      {
        text: `Click to open
building menu`,
        showCondition: () => hasClickedOnPlatform() && !hasEngineBuilded(),
        hideCondition: () => hasClickedOnConstructionMenuButton(),
        needOkButton: false,
        x: getConstructionButtonPosition().x,
        y: getConstructionButtonPosition().y,
      },
      {
        text: "Select the Mixer",
        showCondition: () =>
          hasClickedOnConstructionMenuButton() && !hasEngineBuilded(),
        hideCondition: () => hasSelectedBuildingFromConstructionMenu(),
        needOkButton: false,
        x: getMixerPositionInConstructionMenu().x,
        y: getMixerPositionInConstructionMenu().y,
      },
      {
        text: `Place it 
here`,
        showCondition: () =>
          hasSelectedBuildingFromConstructionMenu() && !hasEngineBuilded(),
        hideCondition: () => hasPlacedSecondBlueprint(),
        needOkButton: false,
        x: 475,
        y: 715,
      },
      {
        text: `Also build
Assembler  
and Grinder`,
        showCondition: () => hasPlacedSecondBlueprint() && !hasEngineBuilded(),
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
        text: `You found a
new module: 
Researcher.
Build it to unlock
upgrades`,
        showCondition: () => isFirstTargetReached(),
        hideCondition: () => hasClickedOnPlatformNearTarget(),
        needOkButton: true,
        findTarget: () => findFirstBuilding(),
      },
      {
        text: `Click
to open the
research
menu`,
        showCondition: () => hasResearcherBuilded(),
        hideCondition: () => hasClickedOnResearcher(),
        needOkButton: false,
        findTarget: () => findFirstBuildingByName("Researcher"),
      },
      {
        text: `Use points
to upgrade
modules`,
        showCondition: () => hasClickedOnResearcher(),
        hideCondition: () => hasClickedOnUpgradeEngineButton(),
        needOkButton: false,
        findTarget: () => getPositionOfEngineUpgradeButton(),
      },
      {
        text: `The bar
shows progress
to the next point`,
        showCondition: () => hasClickedOnUpgradeEngineButton(),
        hideCondition: () => hasClosedResearchMenu(),
        needOkButton: true,
        findTarget: () => getPositionOfResearchingProgressBar(),
      },
      {
        text: `You are free now!
Build more
Researchers
to upgrade
your ship,
or find 
research points
while exploring 
the world`,
        showCondition: () => hasClosedResearchMenu(),
        hideCondition: () => false,
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
        condition: () => hasEngineBuilded() && !isFirstTargetReached(),
        x: 1000,
        y: 100,
      },
    ],
  },
};
