import { type Scenario } from "@test-situations/test-situation";

export const interfacePause: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: 0 },
      { from: "p0", id: "extractor", type: "Extractor", x: 0, y: -200 },
      { from: "p0", id: "extractor2", type: "Extractor", x: -100, y: -200 },
      { from: "p0", id: "extractor3", type: "Extractor", x: 100, y: -200 },
    ],
    workers: [{ buildingId: "p0", profession: "production" }],
  },
};
