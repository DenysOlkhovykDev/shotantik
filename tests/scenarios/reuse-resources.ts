import { Scenario } from "@test-situations/test-situation";

export const reuseResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 550 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 650 },
    ],
    resources: [
      { buildingId: "p0", resourceName: "Water", amount: 1 },
      { buildingId: "p0", resourceName: "Water", amount: 1 },
      { buildingId: "p0", resourceName: "Organic", amount: 1 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 660,
        y: 600,
        buildingType: "Grinder",
      },

      {
        from: "p0",
        x: 260,
        y: 500,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 260,
        y: 600,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 260,
        y: 700,
        buildingType: "Platform",
      },
    ],
  },
};
