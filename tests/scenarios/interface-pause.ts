import { Scenario } from "@test-situations/test-situation";

export const interfacePause: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 640 },
      { from: "p0", id: "extractor", type: "Extractor", x: 360, y: 440 },
      { from: "p0", id: "extractor2", type: "Extractor", x: 260, y: 440 },
      { from: "p0", id: "extractor3", type: "Extractor", x: 460, y: 440 },
    ],
    workers: [{ buildingId: "p0", profession: "production" }],
  },
};
