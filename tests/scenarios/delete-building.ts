import { Scenario } from "@test-situations/test-situation";

export const deleteBuilding: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "p1", type: "Platform", x: 560, y: 640 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 2 },
      { buildingId: "p1", resourceName: "Water", amount: 1 },
      { buildingId: "p1", resourceName: "Metal", amount: 1 },
    ],
    workers: [{ buildingId: "p1", profession: "delivering" }],
  },
};
