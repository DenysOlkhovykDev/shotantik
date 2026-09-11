import { Scenario } from "@test-situations/test-situation";

export const productionPriorities: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "collector1", type: "Collector", x: 560, y: 500 },
      { from: "p0", id: "collector2", type: "Collector", x: 560, y: 700 },
    ],
    resources: [{ buildingId: "collector1", resourceName: "Water", amount: 3 }],
    workers: [{ buildingId: "p0", profession: "production" }],
  },
};
