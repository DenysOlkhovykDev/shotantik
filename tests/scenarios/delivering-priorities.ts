import { type Scenario } from "@test-situations/test-situation";

export const deliveringPriorities: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 200, y: -100 },
      { from: "p0", id: "p2", type: "Platform", x: 100, y: 100 },
    ],
    resources: [{ buildingId: "p0", resourceName: "Organic", amount: 1 }],
    workers: [{ buildingId: "p0", profession: "delivering" }],
    deliveryTasks: [
      {
        target: "p1",
        priority: 6,
        resource: "Organic",
        amount: 1,
      },
      {
        target: "p2",
        priority: 5,
        resource: "Organic",
        amount: 1,
      },
    ],
  },
};
