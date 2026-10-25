import { type Scenario } from "@test-situations/test-situation";

import { defaultScenario } from "@test-scenarios/_default";

export const defaultPlusAllBuildings: Scenario = {
  aircraft: {
    buildings: [
      ...defaultScenario.aircraft.buildings,
      { from: "p0", id: "mixer", type: "Mixer", x: 115, y: 75 },
      { from: "p0", id: "assembler", type: "Assembler", x: -110, y: 75 },
      { from: "p1", id: "grinder", type: "Grinder", x: 110, y: 175 },
      { from: "p2", id: "engine", type: "Engine", x: 0, y: 300 },
    ],
    resources: [
      { buildingId: "collector", resourceName: "Water", amount: 5 },
      { buildingId: "farm", resourceName: "Organic", amount: 5 },
      { buildingId: "extractor", resourceName: "Metal", amount: 5 },
      { buildingId: "mixer", resourceName: "Gum", amount: 2 },
      { buildingId: "grinder", resourceName: "Gear", amount: 2 },
      { buildingId: "assembler", resourceName: "Truss", amount: 2 },
    ],
    workers: [...(defaultScenario.aircraft.workers ?? [])],
  },
  uiElements: {
    //tutorials: [...(defaultScenario.uiElements?.tutorials ?? [])],

    compasses: [...(defaultScenario.uiElements?.compasses ?? [])],
  },

  worldObjects: {
    researchPoints: [...(defaultScenario.worldObjects?.researchPoints ?? [])],
  },
};
