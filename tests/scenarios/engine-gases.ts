import { type Scenario } from "@test-situations/test-situation";

export const engineGases: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "engine1", type: "Engine", x: 360, y: 740 },
      { from: "p0", id: "engine2", type: "Engine", x: 460, y: 740 },
      { from: "p0", id: "engine3", type: "Engine", x: 460, y: 640 },
      { from: "p0", id: "engine4", type: "Engine", x: 460, y: 540 },
      { from: "p0", id: "engine5", type: "Engine", x: 360, y: 540 },
      { from: "p0", id: "engine6", type: "Engine", x: 260, y: 540 },
      { from: "p0", id: "engine7", type: "Engine", x: 260, y: 640 },
      { from: "p0", id: "engine8", type: "Engine", x: 260, y: 740 },
    ],
  },
};
