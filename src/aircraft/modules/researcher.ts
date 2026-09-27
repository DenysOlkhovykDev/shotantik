import { Graphics, Sprite } from "pixi.js";
import { Building, type BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

export class Researcher extends Building {
  static buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    inventorySize: 1,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 46,

    baseGraphicalSize: 38,

    minRoadLength: 120,
    maxRoadLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Truss", amount: 1 },
    { resourceName: "Gear", amount: 1 },
    { resourceName: "Water", amount: 3 },
  ];

  static buildingParams = {
    baseColor: "#cab8db",
    backgroundColor: "#ae6bde",
    backgroundStrokeColor: "#581c74",
    backgroundPointsAmount: 8,
    backgroundSize: Researcher.buildingConfig.baseGraphicalSize + 8,
    backgroundStrokeWidth: 4,
  };

  static cubesParams = {
    baseColor: "#ae6bde",
    strokeWidth: 2,
    strokeColor: "#000000",
    baseRotation: Math.PI / 2,

    maxOffsetFromCenter: 4,
    minffsetFromCenter: -2,
  };

  // contentContainer
  // ├── baseGraphics
  // ├── cubesGraphics

  cubesGraphics: Graphics[] = [];

  hideAnimationParticle = new Graphics();

  hideAnimationDirection = 1;
  hideAnimationPosition = 0;

  cube = [
    // R
    [
      ["#ff0000", "#ff0000", "#ff0000"],
      ["#ff0000", "#ff0000", "#ff0000"],
      ["#ff0000", "#ff0000", "#ff0000"],
    ],

    // F
    [
      ["#00ff00", "#00ff00", "#00ff00"],
      ["#00ff00", "#00ff00", "#00ff00"],
      ["#00ff00", "#00ff00", "#00ff00"],
    ],

    // U
    [
      ["#ffffff", "#ffffff", "#ffffff"],
      ["#ffffff", "#ffffff", "#ffffff"],
      ["#ffffff", "#ffffff", "#ffffff"],
    ],

    // D
    [
      ["#ffff00", "#ffff00", "#ffff00"],
      ["#ffff00", "#ffff00", "#ffff00"],
      ["#ffff00", "#ffff00", "#ffff00"],
    ],

    // B
    [
      ["#0000ff", "#0000ff", "#0000ff"],
      ["#0000ff", "#0000ff", "#0000ff"],
      ["#0000ff", "#0000ff", "#0000ff"],
    ],

    // L
    [
      ["#ff9500", "#ff9500", "#ff9500"],
      ["#ff9500", "#ff9500", "#ff9500"],
      ["#ff9500", "#ff9500", "#ff9500"],
    ],
  ];

  constructor(x: number, y: number) {
    super(x, y, "Researcher");
    this.draw();
    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createBaseTexture();

    const base = new Sprite(Researcher.baseTexture);
    this.contentContainer.addChild(base);

    this.makeCubeStructure();
    this.contentContainer.addChild(this.hideAnimationParticle);
  }

  private createBaseTexture() {
    if (Researcher.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Researcher.buildingConfig.baseGraphicalSize,
      Researcher.buildingParams.baseColor,
      true,
    );

    Researcher.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeCubeStructure() {
    const size = 10;

    for (let face = 0; face < 3; face++) {
      const type = face === 0 ? "front" : face === 1 ? "top" : "right";

      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          const graphic = new Graphics();

          const position = this.getCubeTilePosition(type, row, column, size);

          graphic.position.set(position.x, position.y);

          this.makeCubeTile(graphic, size, type, this.cube[face][row][column]);

          this.cubesGraphics.push(graphic);
          this.contentContainer.addChild(graphic);
        }
      }
    }
  }

  private getCubeTileVectors(type: string, size: number) {
    const tileType = this.getCubeTileTypeToNumber(type);

    const {
      startX: sx,
      startY: sy,
      endX: ex,
      endY: ey,
    } = getRadialLine(tileType, 3, 0, size);

    const { x: rx, y: ry } = getRadialPoint(tileType * 3 + 3, 9, size);

    return {
      horizontal: {
        x: ex - sx,
        y: ey - sy,
      },

      vertical: {
        x: rx - sx,
        y: ry - sy,
      },
    };
  }

  private getCubeTilePosition(
    type: string,
    row: number,
    column: number,
    size: number,
  ) {
    const { horizontal, vertical } = this.getCubeTileVectors(type, size);

    return {
      x: column * horizontal.x + row * vertical.x,

      y: column * horizontal.y + row * vertical.y,
    };
  }

  private makeCubeTile(
    graphic: Graphics,
    size: number,
    type: string,
    color: string,
  ) {
    const tileType = this.getCubeTileTypeToNumber(type);

    const {
      startX: sx,
      startY: sy,
      endX: ex,
      endY: ey,
    } = getRadialLine(tileType, 3, 0, size);

    const { x: lx, y: ly } = getRadialPoint(tileType * 3 + 1.5, 3 * 3, size);

    const { x: rx, y: ry } = getRadialPoint(tileType * 3 + 3, 3 * 3, size);

    graphic
      .moveTo(sx, sy)
      .lineTo(ex, ey)
      .lineTo(lx, ly)
      .lineTo(rx, ry)
      .closePath()
      .stroke({
        width: Researcher.cubesParams.strokeWidth,
        color: Researcher.cubesParams.strokeColor,
        join: "round",
      })
      .fill(color);
  }

  private getCubeTileTypeToNumber(type: string) {
    if (type === "front") {
      return 0;
    } else if (type === "top") {
      return 1;
    } else if (type === "right") {
      return 2;
    } else {
      return -1;
    }
  }

  animation() {
    // const maxPosition = 5;
    // const speed = 0.03;
    // this.hideAnimationPosition += speed;
    // this.hideAnimationParticle.clear();
    // const segments = [
    //   { x1: 24, y1: 14, x2: 0, y2: 25 },
    //   { x1: 0, y1: 25, x2: 0, y2: 0 },
    //   { x1: 0, y1: 0, x2: 22, y2: -10 },
    //   { x1: 22, y1: -10, x2: 22, y2: 3 },
    //   { x1: 22, y1: 3, x2: 10, y2: 8 },
    // ];
    // const drawSegment = (segment, start, end) => {
    //   const startX = segment.x1 + (segment.x2 - segment.x1) * start;
    //   const startY = segment.y1 + (segment.y2 - segment.y1) * start;
    //   const endX = segment.x1 + (segment.x2 - segment.x1) * end;
    //   const endY = segment.y1 + (segment.y2 - segment.y1) * end;
    //   this.hideAnimationParticle
    //     .moveTo(startX, startY)
    //     .lineTo(endX, endY)
    //     .stroke({
    //       width: 13,
    //       color: "#ffffff",
    //       cap: "round",
    //     });
    // };
    // // Фаза появлення
    // if (this.hideAnimationPosition <= maxPosition) {
    //   const completedSegments = Math.floor(this.hideAnimationPosition);
    //   const partialProgress = this.hideAnimationPosition % 1;
    //   for (let i = 0; i < completedSegments; i++) {
    //     drawSegment(segments[i], 0, 1);
    //   }
    //   if (completedSegments < segments.length) {
    //     drawSegment(segments[completedSegments], 0, partialProgress);
    //   }
    //   return;
    // }
    // // Фаза прибирання
    // const hidePosition = this.hideAnimationPosition - maxPosition;
    // const completedHiddenSegments = Math.floor(hidePosition);
    // const partialProgress = hidePosition % 1;
    // for (let i = completedHiddenSegments + 1; i < segments.length; i++) {
    //   drawSegment(segments[i], 0, 1);
    // }
    // if (completedHiddenSegments < segments.length) {
    //   drawSegment(segments[completedHiddenSegments], partialProgress, 1);
    // }
  }
}
