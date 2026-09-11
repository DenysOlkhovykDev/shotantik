import { Scenario } from "@test-situations/test-situation";

export const interfaceSpeed: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 360, y: 640 }],
    buildingTasks: [
      {
        from: "p0",
        x: 660,
        y: 640,
        buildingType: "Platform",
      },
    ],
  },
};
