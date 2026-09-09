import { Scenario } from "@test-situations/test-situation";
import {
  findFirstBlueprint,
  hasPlacedFirstBlueprint,
} from "@utils/tutorial-conditions";

export const showingPointers: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 360, y: 600 }],
    buildingTasks: [
      {
        from: "p0",
        x: 360,
        y: 450,
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
        x: 1000,
        y: 100,
      },
    ],
  },
};
