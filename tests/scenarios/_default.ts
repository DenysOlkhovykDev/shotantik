import { Scenario } from "@test-situations/test-situation";
import {
  getConstructionButtonPosition,
  getCollectorPositionInConstructionMenu,
  getPositionOfEngineUpgradeButton,
  getPositionOfResearchingProgressBar,
  getQuestListButtonPosition,
} from "@utils/ui-config";

import {
  addQuestsAboutResearcher,
  addQuestsFollowTheGreenArrow,
  addQuestsForAdvancedBuilding,
  addQuestsForBuilding,
  closeGameAboutTutorial,
  closeNotEnoughResourcesTutorial,
  findFirstBlueprint,
  findFirstBuilding,
  findFirstBuildingByName,
  hasAtLeastOneBlueprint,
  hasBuildedAssembler,
  hasBuildedCollector,
  hasBuildedExtractor,
  hasBuildedFarm,
  hasBuildedGrinder,
  hasBuildedMixer,
  hasCheckedQuests,
  hasClickedOnConstructionMenuButton,
  hasClickedOnEngine,
  hasClickedOnFirstBlueprint,
  hasClickedOnPlatform,
  hasClickedOnPlatformNearTarget,
  hasClickedOnResearcher,
  hasClickedOnUpgradeEngineButton,
  hasClosedGameAboutTutorial,
  hasClosedNotEnoughResourcesTutorial,
  hasClosedQuestDisplay,
  hasClosedResearchMenu,
  hasEngineBuilded,
  hasOpenedQuestListDisplay,
  hasPlacedSecondBlueprint,
  hasResearcherBuilded,
  hasSelectedBuildingFromConstructionMenu,
  isFirstTargetReached,
  removeQuestAboutAssembler,
  removeQuestAboutCollector,
  removeQuestAboutExtractor,
  removeQuestAboutFarm,
  removeQuestAboutGrinder,
  removeQuestAboutMixer,
  removeQuestAboutResearcher,
  removeQuestFollowTheGreenArrow,
} from "@utils/tutorial-conditions";

export const defaultScenario: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 0, y: 100 },
      { from: "p1", id: "p2", type: "Platform", x: 0, y: 200 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 1 },
      { buildingId: "p1", resourceName: "Metal", amount: 2 },
    ],
    workers: [
      { buildingId: "p2", profession: "building" },
      { buildingId: "p1", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
    buildingTasks: [
      {
        from: "p2",
        x: 0,
        y: 300,
        buildingType: "Engine",
      },
    ],
  },
  uiElements: {
    tutorials: [
      {
        text: `Hi! Shotantik is
a simple resource
management game.
Let's take a look at it`,
        showCondition: () => hasAtLeastOneBlueprint() && !hasEngineBuilded(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => closeGameAboutTutorial(),
      },
      {
        text: `Here's what we're 
going to build.
Let's check what
we need`,
        showCondition: () =>
          hasAtLeastOneBlueprint() &&
          hasClosedGameAboutTutorial() &&
          !hasEngineBuilded(),
        hideCondition: () => hasClickedOnFirstBlueprint(),
        needOkButton: false,
        target: { type: "finder", findTarget: () => findFirstBlueprint() },
      },
      {
        text: `We don't have 
the materials 
to build this yet.
So let's make a few
other structures
to make simple 
resources.`,
        showCondition: () =>
          hasClickedOnFirstBlueprint() && !hasEngineBuilded(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          closeNotEnoughResourcesTutorial();
          addQuestsForBuilding();
        },
      },
      {
        text: `Open the quest 
list to see what 
to build first`,
        showCondition: () =>
          hasClosedNotEnoughResourcesTutorial() && !hasEngineBuilded(),
        hideCondition: () => hasOpenedQuestListDisplay(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: getQuestListButtonPosition().x + 20,
          y: getQuestListButtonPosition().y + 25,
        },
      },
      {
        text: `Let's build
the first module`,
        showCondition: () => hasOpenedQuestListDisplay() && !hasEngineBuilded(),
        hideCondition: () => hasCheckedQuests(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: 160,
          y: 1085,
        },
      },
      {
        text: `This is the
Platform.
You can build
from it`,
        showCondition: () => hasClosedQuestDisplay() && !hasEngineBuilded(),
        hideCondition: () => hasClickedOnPlatform(),
        needOkButton: false,
        target: { type: "finder", findTarget: () => findFirstBuilding() },
      },
      {
        text: `Click to open
building menu`,
        showCondition: () => hasClickedOnPlatform() && !hasEngineBuilded(),
        hideCondition: () => hasClickedOnConstructionMenuButton(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: getConstructionButtonPosition().x,
          y: getConstructionButtonPosition().y,
        },
      },
      {
        text: "Select it",
        showCondition: () =>
          hasClickedOnConstructionMenuButton() && !hasEngineBuilded(),
        hideCondition: () => hasSelectedBuildingFromConstructionMenu(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: getCollectorPositionInConstructionMenu().x,
          y: getCollectorPositionInConstructionMenu().y,
        },
      },
      {
        text: `Place it
here`,
        showCondition: () =>
          hasSelectedBuildingFromConstructionMenu() && !hasEngineBuilded(),
        hideCondition: () => hasPlacedSecondBlueprint(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: 275,
          y: 575,
        },
      },
      {
        text: `Also build
other two modules`,
        showCondition: () => hasBuildedCollector() && !hasEngineBuilded(),
        hideCondition: () =>
          hasBuildedCollector() && hasOpenedQuestListDisplay(),
        needOkButton: true,
        target: {
          type: "coordinates",
          x: getQuestListButtonPosition().x + 20,
          y: getQuestListButtonPosition().y + 25,
        },
        afterClose: () => removeQuestAboutCollector(),
      },
      {
        text: `One more`,
        showCondition: () =>
          hasBuildedCollector() && hasBuildedFarm() && !hasEngineBuilded(),
        hideCondition: () =>
          hasBuildedCollector() &&
          hasBuildedFarm() &&
          hasOpenedQuestListDisplay(),
        needOkButton: true,
        target: {
          type: "coordinates",
          x: getQuestListButtonPosition().x + 20,
          y: getQuestListButtonPosition().y + 25,
        },
        afterClose: () => removeQuestAboutFarm(),
      },
      {
        text: `Now build new
type of modules.
They can make 
new resources`,
        showCondition: () =>
          hasBuildedCollector() &&
          hasBuildedFarm() &&
          hasBuildedExtractor() &&
          !hasEngineBuilded(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          removeQuestAboutExtractor();
          addQuestsForAdvancedBuilding();
        },
      },
      {
        text: `no text Mixer`,
        showCondition: () => false,
        hideCondition: () => hasBuildedMixer(),
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          removeQuestAboutMixer();
        },
      },
      {
        text: `no text Grinder`,
        showCondition: () => false,
        hideCondition: () => hasBuildedGrinder(),
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          removeQuestAboutGrinder();
        },
      },
      {
        text: `no text Assembler`,
        showCondition: () => false,
        hideCondition: () => hasBuildedAssembler(),
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          removeQuestAboutAssembler();
        },
      },
      {
        text: `Use it to 
follow the
green compass 
arrow`,
        showCondition: () => hasEngineBuilded(),
        hideCondition: () => hasClickedOnEngine(),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Engine"),
        },
        afterClose: () => {
          addQuestsFollowTheGreenArrow();
        },
      },
      {
        text: `You found a
new module.
Build it to unlock
upgrades`,
        showCondition: () => isFirstTargetReached(),
        hideCondition: () => hasClickedOnPlatformNearTarget(),
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          removeQuestFollowTheGreenArrow();
          addQuestsAboutResearcher();
        },
      },
      {
        text: `Click
to open the
research
menu`,
        showCondition: () => hasResearcherBuilded(),
        hideCondition: () => hasClickedOnResearcher(),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Researcher"),
        },
        afterClose: () => {
          removeQuestAboutResearcher();
        },
      },
      {
        text: `Use points
to upgrade
modules`,
        showCondition: () => hasClickedOnResearcher(),
        hideCondition: () => hasClickedOnUpgradeEngineButton(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: getPositionOfEngineUpgradeButton().x,
          y: getPositionOfEngineUpgradeButton().y,
        },
      },
      {
        text: `The bar
shows progress
to the next point`,
        showCondition: () => hasClickedOnUpgradeEngineButton(),
        hideCondition: () => hasClosedResearchMenu(),
        needOkButton: true,
        target: {
          type: "coordinates",
          x: getPositionOfResearchingProgressBar().x,
          y: getPositionOfResearchingProgressBar().y,
        },
      },
      {
        text: `You are free now!
Try to find 
research points
while exploring 
the world`,
        showCondition: () => hasClosedResearchMenu(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
      },
    ],

    compasses: [
      {
        condition: () => hasEngineBuilded() && !isFirstTargetReached(),
        x: 1500,
        y: 100,
      },
    ],
  },

  worldObjects: { researchPoints: [{ x: 1500, y: 100 }] },
};
