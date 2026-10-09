import { type Scenario } from "@test-situations/test-situation";

export const tooMuchBlueprints: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "p1", type: "Platform", x: 260, y: 600 },
      { from: "p0", id: "p2", type: "Platform", x: 460, y: 600 },
      { from: "p0", id: "p3", type: "Platform", x: 360, y: 540 },
      { from: "p3", id: "p4", type: "Platform", x: 360, y: 440 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Truss", amount: 3 },
      { buildingId: "p4", resourceName: "Gear", amount: 3 },
      { buildingId: "p2", resourceName: "Water", amount: 9 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 260,
        y: 740,
        buildingType: "Researcher",
      },
      {
        from: "p0",
        x: 360,
        y: 740,
        buildingType: "Researcher",
      },
      {
        from: "p0",
        x: 460,
        y: 740,
        buildingType: "Researcher",
      },
    ],
  },
};
