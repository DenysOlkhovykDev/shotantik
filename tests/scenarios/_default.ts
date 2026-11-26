import { Scenario } from "@test-situations/test-situation";
import {
  getConstructionButtonPosition,
  getCollectorPositionInConstructionMenu,
  getPositionOfEngineUpgradeButton,
  getPositionOfResearchingProgressBar,
  getQuestListButtonPosition,
} from "@utils/ui-config";

import {
  closeGameAboutTutorial,
  closeNotEnoughResourcesTutorial,
  findFirstBlueprint,
  findFirstBuilding,
  findFirstBuildingByName,
  hasAtLeastOneBlueprint,
  hasCheckedQuests,
  hasBuilt,
  hasClickedOnConstructionMenuButton,
  hasClickedOnEngine,
  hasClickedOnFirstBlueprint,
  hasClickedOnPlatform,
  hasClickedOnResearcher,
  hasClickedOnUpgradeEngineButton,
  hasClosedGameAboutTutorial,
  hasClosedNotEnoughResourcesTutorial,
  hasClosedQuestDisplay,
  hasClosedResearchMenu,
  hasOpenedQuestListDisplay,
  hasPlacedSecondBlueprint,
  hasSelectedBuildingFromConstructionMenu,
  isFirstTargetReached,
  isShownCraftSignOn,
  hasClosedRecipeSignTutorial,
  closeRecipeSignTutorial,
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
        showCondition: () => hasAtLeastOneBlueprint() && !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => closeGameAboutTutorial(),
      },
      {
        text: `Here's the 
module we're 
going to build`,
        showCondition: () =>
          hasAtLeastOneBlueprint() &&
          hasClosedGameAboutTutorial() &&
          !hasBuilt("Engine"),
        hideCondition: () => hasClickedOnFirstBlueprint(),
        needOkButton: false,
        target: { type: "finder", findTarget: () => findFirstBlueprint() },
      },
      {
        text: `Check the sign 
next to the 
module to see 
what it need`,
        showCondition: () =>
          hasClickedOnFirstBlueprint() && !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "finder", findTarget: () => findFirstBlueprint() },
        afterClose: () => {
          closeRecipeSignTutorial();
        },
      },
      {
        text: `We don't have 
the materials 
to build this yet.
First, we need 
a few other modules
to make basic 
resources`,
        showCondition: () =>
          hasClosedRecipeSignTutorial() && !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
        afterClose: () => {
          closeNotEnoughResourcesTutorial();
        },
      },
      {
        text: `Open the quest 
list to see what 
to build first`,
        showCondition: () =>
          hasClosedNotEnoughResourcesTutorial() && !hasBuilt("Engine"),
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
        showCondition: () => hasOpenedQuestListDisplay() && !hasBuilt("Engine"),
        hideCondition: () => hasCheckedQuests(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: 160,
          y: 1085,
        },
      },
      {
        text: `This is a
Platform.
Other modules
can be built 
from it`,
        showCondition: () => hasClosedQuestDisplay() && !hasBuilt("Engine"),
        hideCondition: () => hasClickedOnPlatform(),
        needOkButton: false,
        target: { type: "finder", findTarget: () => findFirstBuilding() },
      },
      {
        text: `Click to open
building menu`,
        showCondition: () => hasClickedOnPlatform() && !hasBuilt("Engine"),
        hideCondition: () => hasClickedOnConstructionMenuButton(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: getConstructionButtonPosition().x,
          y: getConstructionButtonPosition().y,
        },
      },
      {
        text: `Select 
this module`,
        showCondition: () =>
          hasClickedOnConstructionMenuButton() && !hasBuilt("Engine"),
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
          hasSelectedBuildingFromConstructionMenu() && !hasBuilt("Engine"),
        hideCondition: () => hasPlacedSecondBlueprint(),
        needOkButton: false,
        target: {
          type: "coordinates",
          x: 275,
          y: 575,
        },
      },
      {
        text: `Let's take
a look at 
this module`,
        showCondition: () => hasBuilt("Collector") && !hasBuilt("Engine"),
        hideCondition: () => isShownCraftSignOn("Collector"),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Collector"),
        },
      },
      {
        text: `The sign above it 
shows what it produces. 
It won't produce
anything until someone 
is working here`,
        showCondition: () =>
          isShownCraftSignOn("Collector") && !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Collector"),
        },
      },
      {
        text: `Now let's 
build modules 
that produce 
more advanced 
resources`,
        showCondition: () =>
          hasBuilt("Collector") &&
          hasBuilt("Farm") &&
          hasBuilt("Extractor") &&
          !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
      },
      {
        text: `Let's take 
a look at 
this module`,
        showCondition: () => hasBuilt("Mixer") && !hasBuilt("Engine"),
        hideCondition: () => isShownCraftSignOn("Mixer"),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Mixer"),
        },
      },
      {
        text: `The sign shows 
craft recipe.
The icons before 
the arrow show 
what it need. 
The icon after it 
shows what it make.`,
        showCondition: () => isShownCraftSignOn("Mixer") && !hasBuilt("Engine"),
        hideCondition: () => false,
        needOkButton: true,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Mixer"),
        },
      },
      {
        text: `Click this 
module, then 
follow the 
green compass 
arrow`,
        showCondition: () => hasBuilt("Engine"),
        hideCondition: () => hasClickedOnEngine(),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Engine"),
        },
      },
      {
        text: `You found a
new module.
Build it to unlock
upgrades`,
        showCondition: () => isFirstTargetReached(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
      },
      {
        text: `Click
to open the
research
menu`,
        showCondition: () => hasBuilt("Researcher"),
        hideCondition: () => hasClickedOnResearcher(),
        needOkButton: false,
        target: {
          type: "finder",
          findTarget: () => findFirstBuildingByName("Researcher"),
        },
      },
      {
        text: `Spend points
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
        text: `This bar
shows progress 
toward the 
next point`,
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
        text: `That's it for now! 
Explore the world 
to find more research 
points and upgrade 
your modules`,
        showCondition: () => hasClosedResearchMenu(),
        hideCondition: () => false,
        needOkButton: true,
        target: { type: "none" },
      },
    ],

    quests: [
      {
        name: "build collector",
        text: "Build x1",
        building: "Collector",
        showCondition: () =>
          hasClosedNotEnoughResourcesTutorial() && !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Collector"),
      },
      {
        name: "build farm",
        text: "Build x1",
        building: "Farm",
        showCondition: () =>
          hasClosedNotEnoughResourcesTutorial() && !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Farm"),
      },
      {
        name: "build extractor",
        text: "Build x1",
        building: "Extractor",
        showCondition: () =>
          hasClosedNotEnoughResourcesTutorial() && !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Extractor"),
      },
      {
        name: "build mixer",
        text: "Build x1",
        building: "Mixer",
        showCondition: () =>
          hasBuilt("Collector") &&
          hasBuilt("Farm") &&
          hasBuilt("Extractor") &&
          !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Mixer"),
      },
      {
        name: "build assembler",
        text: "Build x1",
        building: "Assembler",
        showCondition: () =>
          hasBuilt("Collector") &&
          hasBuilt("Farm") &&
          hasBuilt("Extractor") &&
          !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Assembler"),
      },
      {
        name: "build grinder",
        text: "Build x1",
        building: "Grinder",
        showCondition: () =>
          hasBuilt("Collector") &&
          hasBuilt("Farm") &&
          hasBuilt("Extractor") &&
          !hasBuilt("Engine"),
        hideCondition: () => hasBuilt("Grinder"),
      },
      {
        name: "follow the green arrow",
        text: "Follow the green arrow",
        showCondition: () => hasBuilt("Engine"),
        hideCondition: () => isFirstTargetReached(),
      },
      {
        name: "build researcher",
        text: "Build x1",
        building: "Researcher",
        showCondition: () => isFirstTargetReached(),
        hideCondition: () => hasBuilt("Researcher"),
      },
    ],

    compasses: [
      {
        condition: () => hasBuilt("Engine") && !isFirstTargetReached(),
        x: 1500,
        y: 100,
      },
    ],
  },

  worldObjects: { researchPoints: [{ x: 1500, y: 100 }] },
};
