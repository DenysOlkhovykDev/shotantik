import { type Scenario } from "@test-situations/test-situation";

export const interfaceSpeed: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 0, y: 0 }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 0,
        buildingType: "Platform",
      },
    ],
  },
};
