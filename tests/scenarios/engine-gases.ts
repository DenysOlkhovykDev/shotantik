import { type Scenario } from "@test-situations/test-situation";

export const engineGases: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "engine1", type: "Engine", x: 0, y: 100 },
      { from: "p0", id: "engine2", type: "Engine", x: 100, y: 100 },
      { from: "p0", id: "engine3", type: "Engine", x: 100, y: 0 },
      { from: "p0", id: "engine4", type: "Engine", x: 100, y: -100 },
      { from: "p0", id: "engine5", type: "Engine", x: 0, y: -100 },
      { from: "p0", id: "engine6", type: "Engine", x: -100, y: -100 },
      { from: "p0", id: "engine7", type: "Engine", x: -100, y: 0 },
      { from: "p0", id: "engine8", type: "Engine", x: -100, y: 100 },
    ],
  },
};
