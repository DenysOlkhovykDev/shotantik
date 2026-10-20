import { type Scenario } from "@test-situations/test-situation";

export const sceneRender: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 0, y: -500 },
      { from: "p0", id: "collector", type: "Collector", x: -100, y: -500 },

      { from: "p0", id: "p1", type: "Platform", x: 0, y: -400 },
      { from: "p1", id: "farm", type: "Farm", x: 100, y: -400 },

      { from: "p1", id: "p2", type: "Platform", x: 0, y: -300 },
      { from: "p2", id: "extractor", type: "Extractor", x: -100, y: -300 },

      { from: "p2", id: "p3", type: "Platform", x: 0, y: -200 },
      { from: "p3", id: "house", type: "House", x: 100, y: -200 },

      { from: "p3", id: "p4", type: "Platform", x: 0, y: -100 },
      { from: "p4", id: "junkyard", type: "Junkyard", x: -120, y: -100 },

      { from: "p4", id: "p5", type: "Platform", x: 0, y: 0 },
      { from: "p5", id: "assembler", type: "Assembler", x: 100, y: 0 },

      { from: "p5", id: "p6", type: "Platform", x: 0, y: 100 },
      { from: "p6", id: "engine", type: "Engine", x: -100, y: 100 },

      { from: "p6", id: "p7", type: "Platform", x: 0, y: 200 },
      { from: "p7", id: "mixer", type: "Mixer", x: 100, y: 200 },

      { from: "p7", id: "p8", type: "Platform", x: 0, y: 300 },
      { from: "p8", id: "grinder", type: "Grinder", x: -100, y: 300 },

      { from: "p8", id: "p9", type: "Platform", x: 0, y: 400 },
      { from: "p9", id: "portal", type: "Portal", x: 100, y: 400 },

      { from: "p9", id: "p10", type: "Platform", x: 0, y: 500 },
      { from: "p10", id: "researcher", type: "Researcher", x: -100, y: 500 },
    ],
    resources: [
      { buildingId: "collector", resourceName: "Water", amount: 5 },
      { buildingId: "farm", resourceName: "Organic", amount: 5 },
      { buildingId: "extractor", resourceName: "Metal", amount: 5 },
      { buildingId: "engine", resourceName: "Battery", amount: 1 },
      { buildingId: "mixer", resourceName: "Gum", amount: 4 },
      { buildingId: "grinder", resourceName: "Gear", amount: 4 },
      { buildingId: "assembler", resourceName: "Truss", amount: 4 },
      { buildingId: "junkyard", resourceName: "Truss", amount: 1 },
      { buildingId: "junkyard", resourceName: "Gum", amount: 1 },
      { buildingId: "junkyard", resourceName: "Gear", amount: 1 },
      { buildingId: "junkyard", resourceName: "Water", amount: 1 },
      { buildingId: "junkyard", resourceName: "Organic", amount: 1 },
      { buildingId: "junkyard", resourceName: "Metal", amount: 1 },
      { buildingId: "junkyard", resourceName: "Battery", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
  },

  worldObjects: { researchPoints: [{ x: -300, y: -500 }] },
};
