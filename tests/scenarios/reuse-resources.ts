import { type Scenario } from "@test-situations/test-situation";

export const reuseResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 140, y: -50 },
      { from: "p0", id: "p2", type: "Platform", x: 140, y: 50 },
    ],
    resources: [
      { buildingId: "p0", resourceName: "Water", amount: 1 },
      { buildingId: "p0", resourceName: "Water", amount: 1 },
      { buildingId: "p0", resourceName: "Organic", amount: 1 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 0,
        buildingType: "Grinder",
      },

      {
        from: "p0",
        x: -100,
        y: -100,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: -100,
        y: 0,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: -100,
        y: 100,
        buildingType: "Platform",
      },
    ],
  },
};
