import { type Scenario } from "@test-situations/test-situation";

export const movingResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 200, y: -100 },
      { from: "p0", id: "p2", type: "Platform", x: 200, y: 100 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 1 },
      { buildingId: "p2", resourceName: "Water", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "delivering" }],
    deliveryTasks: [
      {
        target: "p2",
        priority: 5,
        resource: "Organic",
        amount: 1,
      },
      {
        target: "p1",
        priority: 5,
        resource: "Water",
        amount: 1,
      },
    ],
  },
};
