import { type Scenario } from "@test-situations/test-situation";

export const researchingTechnologies: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "p1", type: "Platform", x: 260, y: 640 },
      { from: "p0", id: "researcher", type: "Researcher", x: 360, y: 740 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Water", amount: 2 },
      { buildingId: "p1", resourceName: "Organic", amount: 2 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 460,
        y: 640,
        buildingType: "Platform",
      },
    ],
  },

  worldObjects: { researchPoints: [{ x: 100, y: -75 }] },
};
