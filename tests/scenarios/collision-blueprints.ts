import { type Scenario } from "@test-situations/test-situation";

export const collisionBlueprints: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "p1", type: "Platform", x: 200, y: -120 },
      { from: "p0", id: "p2", type: "Platform", x: 200, y: 120 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 205,
        y: -25,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 205,
        y: 25,
        buildingType: "Platform",
      },
    ],
  },
};
