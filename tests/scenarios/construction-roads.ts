import { type Scenario } from "@test-situations/test-situation";

export const constructionRoads: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 100, y: 0 },
      { from: "", id: "ps", type: "Platform", x: -200, y: -40 },
      { from: "p0", id: "p1", type: "Platform", x: 0, y: 0 },
      { from: "p1", id: "p2", type: "Platform", x: -100, y: 100 },
      { from: "p2", id: "p3", type: "Platform", x: 0, y: 200 },
      { from: "p3", id: "p4", type: "Platform", x: 100, y: 200 },
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
        x: 200,
        y: 200,
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
