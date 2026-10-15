import { type Scenario } from "@test-situations/test-situation";

export const manyProducersOnDifferentTasks: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p1", type: "Platform", x: 0, y: -500 },
      { from: "p1", id: "p2", type: "Platform", x: 0, y: -400 },
      { from: "p2", id: "p3", type: "Platform", x: 0, y: -300 },
      { from: "p3", id: "p4", type: "Platform", x: 0, y: -200 },
      { from: "p4", id: "p5", type: "Platform", x: 0, y: -100 },
      { from: "p5", id: "p6", type: "Platform", x: 0, y: 0 },
      { from: "p6", id: "p7", type: "Platform", x: 0, y: 100 },
      { from: "p7", id: "p8", type: "Platform", x: 0, y: 200 },
      { from: "p8", id: "p9", type: "Platform", x: 0, y: 300 },
      { from: "p9", id: "p10", type: "Platform", x: 0, y: 400 },
      { from: "p1", id: "c1", type: "Collector", x: -100, y: -500 },
      { from: "p2", id: "c2", type: "Collector", x: -100, y: -400 },
      { from: "p3", id: "c3", type: "Collector", x: -100, y: -300 },
      { from: "p4", id: "c4", type: "Collector", x: -100, y: -200 },
      { from: "p5", id: "c5", type: "Collector", x: -100, y: -100 },
      { from: "p6", id: "c6", type: "Collector", x: -100, y: 0 },
      { from: "p7", id: "c7", type: "Collector", x: -100, y: 100 },
      { from: "p8", id: "c8", type: "Collector", x: -100, y: 200 },
      { from: "p9", id: "c9", type: "Collector", x: -100, y: 300 },
      { from: "p10", id: "c10", type: "Collector", x: -100, y: 400 },
    ],
    workers: [
      { buildingId: "p1", profession: "production" },
      { buildingId: "p2", profession: "production" },
      { buildingId: "p3", profession: "production" },
      { buildingId: "p4", profession: "production" },
      { buildingId: "p5", profession: "production" },
      { buildingId: "p6", profession: "production" },
      { buildingId: "p7", profession: "production" },
      { buildingId: "p8", profession: "production" },
      { buildingId: "p9", profession: "production" },
    ],
  },
};
