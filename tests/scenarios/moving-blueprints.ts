import { type Scenario } from "@test-situations/test-situation";

export const movingBlueprints: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 0, y: 0 }],
    buildingTasks: [
      {
        from: "p0",
        x: 5,
        y: -150,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: -5,
        y: -150,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: -5,
        y: -250,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 400,
        y: 0,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 0,
        y: 5,
        buildingType: "Platform",
      },
    ],
  },
};
