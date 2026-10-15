import { type Scenario } from "@test-situations/test-situation";

export const multipleConstructionOfDifferentBuildings: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 200, y: -100 },
      { from: "p0", id: "p2", type: "Platform", x: 200, y: 100 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 8 },
      { buildingId: "p2", resourceName: "Water", amount: 2 },
      { buildingId: "p2", resourceName: "Metal", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 0,
        y: -150,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 0,
        y: 150,
        buildingType: "Assembler",
      },
    ],
  },
};
