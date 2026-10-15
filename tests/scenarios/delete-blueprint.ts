import { type Scenario } from "@test-situations/test-situation";

export const deleteBlueprint: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 0, y: 0 }],
    buildingTasks: [
      {
        from: "p0",
        x: 200,
        y: 0,
        buildingType: "Platform",
      },
    ],
  },
};
