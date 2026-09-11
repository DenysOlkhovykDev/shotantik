import { Scenario } from "@test-situations/test-situation";

export const constructionMenu: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "p1", type: "Platform", x: 360, y: 840 },
    ],
    resources: [
      { buildingId: "p0", resourceName: "Organic", amount: 2 },
      { buildingId: "p0", resourceName: "Water", amount: 1 },
      { buildingId: "p0", resourceName: "Metal", amount: 1 },
    ],
  },
};
