import { type Scenario } from "@test-situations/test-situation";
import {
  findFirstBlueprint,
  hasPlacedFirstBlueprint,
} from "@utils/tutorial-conditions";

export const showingTutorials: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 0, y: 0 }],
    buildingTasks: [
      {
        from: "p0",
        x: 0,
        y: -150,
        buildingType: "Platform",
      },
    ],
  },
  uiElements: {
    tutorials: [
      {
        text: `Hello world`,
        showCondition: () => hasPlacedFirstBlueprint(),
        hideCondition: () => false,
        needOkButton: true,
        findTarget: () => findFirstBlueprint(),
      },
    ],

    compasses: [
      {
        condition: () => {
          return true;
        },
        x: 1500,
        y: 100,
      },
    ],
  },

  worldObjects: { researchPoints: [{ x: 1500, y: 100 }] },
};
