import { Scenario } from "@test-situations/test-situation";

export const joystickMoving: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "engine", type: "Engine", x: 360, y: 840 },
    ],
  },
};
