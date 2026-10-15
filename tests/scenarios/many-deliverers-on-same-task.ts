import { type Scenario } from "@test-situations/test-situation";

export const manyDeliverersOnSameTask: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p1", type: "Platform", x: 0, y: 9 },
      { from: "p1", id: "p2", type: "Platform", x: -100, y: 0 },
      { from: "p1", id: "p3", type: "Platform", x: -90, y: -90 },
      { from: "p1", id: "p4", type: "Platform", x: 0, y: -130 },
      { from: "p1", id: "p5", type: "Platform", x: 90, y: -90 },
      { from: "p1", id: "p6", type: "Platform", x: 100, y: 0 },
    ],
    resources: [
      { buildingId: "p2", resourceName: "Water", amount: 1 },
      { buildingId: "p3", resourceName: "Water", amount: 1 },
      { buildingId: "p4", resourceName: "Water", amount: 1 },
      { buildingId: "p5", resourceName: "Water", amount: 1 },
      { buildingId: "p6", resourceName: "Water", amount: 1 },
    ],
    workers: [
      { buildingId: "p1", profession: "delivering" },
      { buildingId: "p1", profession: "delivering" },
      { buildingId: "p1", profession: "delivering" },
      { buildingId: "p1", profession: "delivering" },
      { buildingId: "p1", profession: "delivering" },
    ],
    deliveryTasks: [
      { target: "p1", priority: 5, resource: "Water", amount: 5 },
    ],
  },
};
