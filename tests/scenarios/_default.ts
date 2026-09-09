import { Scenario } from "@test-situations/test-situation";
import { constructionManager } from "@construction/manager";
import { aircraft } from "@aircraft/aircraft";
import { getDistance } from "@utils/basic-geometry";
import { gameScreen } from "../../src/game-config";
import { joystick } from "@joystick/joystick";
import { getWorldCoordinates } from "../../src/main";

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
        showCondition: () => aircraft.blueprints.length > 0,
        hideCondition: () =>
          aircraft.blueprints.length > 0 &&
          aircraft.blueprints[0].recipeSign.children.length > 0,
        needOkButton: false,
        findTarget: () => {
          const blueprint = aircraft.blueprints[0];

          if (!blueprint) {
            return {
              x: 0,
              y: 0,
            };
          }
          return {
            x: blueprint.x,
            y: blueprint.y,
          };
        },
      },
      {
        text: `This is the
Platform.
You can build
from it`,
        showCondition: () => {
          return (
            aircraft.blueprints.length > 0 &&
            aircraft.blueprints[0].recipeSign.children.length > 0
          );
        },
        hideCondition: () => constructionManager.isButtonVisible(),
        needOkButton: false,
        findTarget: () => {
          const building = aircraft.buildings[0];

          if (!building) {
            return {
              x: 0,
              y: 0,
            };
          }

          return {
            x: building.x,
            y: building.y,
          };
        },
      },
      {
        text: `Click to open
building menu`,
        showCondition: () => {
          return constructionManager.isButtonVisible();
        },
        hideCondition: () => constructionManager.isMenuVisible(),
        needOkButton: false,
        x: gameScreen.width / 2,
        y: gameScreen.height - gameScreen.height / 20,
      },
      {
        text: "Select the Mixer",
        showCondition: () => {
          return constructionManager.isMenuVisible();
        },
        hideCondition: () =>
          constructionManager.getBuildingType() !== undefined,
        needOkButton: false,
        x: 360,
        y: 1070,
      },
      {
        text: `Place it 
here`,
        showCondition: () => {
          return constructionManager.getBuildingType() !== undefined;
        },
        hideCondition: () => aircraft.blueprints.length > 1,
        needOkButton: false,
        x: 475,
        y: 675,
      },
      {
        text: `Also build
Assembler  
and Grinder`,
        showCondition: () => {
          return aircraft.blueprints.length > 1;
        },
        hideCondition: () =>
          constructionManager.isButtonVisible() &&
          aircraft.blueprints.length > 1,
        needOkButton: true,
        findTarget: () => {
          const building = aircraft.buildings[0];

          if (!building) {
            return {
              x: 0,
              y: 0,
            };
          }

          return {
            x: building.x,
            y: building.y,
          };
        },
      },
      {
        text: `Use Engine
to follow the
green compass 
arrow`,
        showCondition: () => {
          const engines = aircraft.buildings.filter(
            (b) => b.buildingType === "Engine",
          );

          return engines.length > 0;
        },
        hideCondition: () => joystick.isVisible(),
        needOkButton: false,
        findTarget: () => {
          const engines = aircraft.buildings.filter(
            (b) => b.buildingType === "Engine",
          );

          if (engines.length === 0) {
            return {
              x: 0,
              y: 0,
            };
          }

          return {
            x: engines[0].x,
            y: engines[0].y,
          };
        },
      },
      {
        text: `You Win`,
        showCondition: () => {
          return (
            getDistance(
              getWorldCoordinates().x,
              getWorldCoordinates().y,
              1000,
              100,
            ) < 50
          );
        },
        hideCondition: () =>
          getDistance(
            getWorldCoordinates().x,
            getWorldCoordinates().y,
            1000,
            100,
          ) < 50 && constructionManager.isButtonVisible(),
        needOkButton: true,
        findTarget: () => {
          const building = aircraft.buildings[0];

          if (!building) {
            return {
              x: 0,
              y: 0,
            };
          }

          return {
            x: building.x,
            y: building.y,
          };
        },
      },
      {
        text: `You can't
complete tutorial.
Try again`,
        showCondition: () => {
          const farms = aircraft.buildings.filter(
            (b) => b.buildingType === "Farm",
          );
          const extractors = aircraft.buildings.filter(
            (b) => b.buildingType === "Extractor",
          );
          const collectors = aircraft.buildings.filter(
            (b) => b.buildingType === "Collector",
          );

          return (
            farms.length === 0 ||
            extractors.length === 0 ||
            collectors.length === 0
          );
        },
        hideCondition: () => false,
        needOkButton: true,
        findTarget: () => {
          const building = aircraft.buildings[0];

          if (!building) {
            return {
              x: 0,
              y: 0,
            };
          }

          return {
            x: building.x,
            y: building.y,
          };
        },
      },
    ],

    compasses: [
      {
        condition: () => {
          const engines = aircraft.buildings.filter(
            (b) => b.buildingType === "Engine",
          );

          return engines.length > 0;
        },
        x: 1000,
        y: 100,
      },
    ],
  },
};
