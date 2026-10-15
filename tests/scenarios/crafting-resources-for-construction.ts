import { type Scenario } from "@test-situations/test-situation";

export const craftingResourcesForConstruction: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "collector", type: "Collector", x: -100, y: 0 },
      { from: "p0", id: "extractor", type: "Extractor", x: 100, y: 0 },
      { from: "p0", id: "farm", type: "Farm", x: 0, y: -100 },
    ],
    workers: [
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "building" },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 0,
        y: 200,
        buildingType: "Platform",
      },
    ],
  },
};
