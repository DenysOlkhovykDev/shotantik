import { type Scenario } from "@test-situations/test-situation";

export const craftingResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "mixer", type: "Mixer", x: 100, y: -100 },
      { from: "p0", id: "collector", type: "Collector", x: -100, y: -100 },
      { from: "p0", id: "farm", type: "Farm", x: 0, y: -100 },
    ],
    workers: [
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
  },
};
