import { type Scenario } from "@test-situations/test-situation";

export const researchingTechnologies: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: -100, y: 0 },
      { from: "p0", id: "researcher", type: "Researcher", x: 0, y: 100 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Water", amount: 2 },
      { buildingId: "p1", resourceName: "Organic", amount: 2 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 100,
        y: 0,
        buildingType: "Platform",
      },
    ],
  },

  worldObjects: { researchPoints: [{ x: 100, y: -75 }] },
};
