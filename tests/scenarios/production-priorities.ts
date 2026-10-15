import { type Scenario } from "@test-situations/test-situation";

export const productionPriorities: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "collector1", type: "Collector", x: 200, y: -100 },
      { from: "p0", id: "collector2", type: "Collector", x: 200, y: 100 },
    ],
    resources: [{ buildingId: "collector1", resourceName: "Water", amount: 3 }],
    workers: [{ buildingId: "p0", profession: "production" }],
  },
};
