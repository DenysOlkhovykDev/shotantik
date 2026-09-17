import { Scenario } from "@test-situations/test-situation";

export const constructionRoads: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 460, y: 640 },
      { from: "", id: "ps", type: "Platform", x: 160, y: 600 },
      { from: "p0", id: "p1", type: "Platform", x: 360, y: 640 },
      { from: "p1", id: "p2", type: "Platform", x: 260, y: 740 },
      { from: "p2", id: "p3", type: "Platform", x: 360, y: 840 },
      { from: "p3", id: "p4", type: "Platform", x: 460, y: 840 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    resources: [
      { buildingId: "p1", resourceName: "Metal", amount: 2 },
      { buildingId: "p1", resourceName: "Water", amount: 1 },
      { buildingId: "p4", resourceName: "Organic", amount: 1 },
    ],
    buildingTasks: [
      {
        from: "p4",
        x: 560,
        y: 840,
        buildingType: "Platform",
      },
    ],
    buildingAlternativeRoadsTasks: [
      {
        from: "p1",
        to: "ps",
      },
      {
        from: "p0",
        to: "p4",
      },
    ],
  },
};
