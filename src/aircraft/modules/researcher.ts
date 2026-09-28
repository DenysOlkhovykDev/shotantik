import { Graphics, Sprite } from "pixi.js";
import { Building, type BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

type RotationSide = "R" | "L" | "U" | "D" | "F" | "B";

type RotationPoint = {
  x: number;
  y: number;
};

type RotationParams = {
  segments: Record<RotationSide, RotationPoint[]>;
  schedule: RotationSide[];
  speed: number;
};

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
    baseColor: "#908d92",
  };

  static cubesParams = {
    size: 10,
    strokeWidth: 2,
    strokeColor: "#000000",
  };

  static rotationParams: RotationParams = {
    segments: {
      R: [
        { x: 20, y: 23 },
        { x: -15, y: 22 },
        { x: -1, y: -3 },
        { x: 26, y: -3 },
        { x: 20, y: 10 },
        { x: 4, y: 10 },
      ],
      L: [
        { x: -26, y: 2 },
        { x: -19, y: -10 },
        { x: -12, y: -22 },
        { x: 3, y: -22 },
        { x: 18, y: -22 },
      ],
      U: [
        { x: 12, y: -22 },
        { x: 24, y: 2 },
        { x: -2, y: 2 },
        { x: -13, y: -22 },
        { x: 4, y: -22 },
        { x: 8, y: -12 },
      ],
      D: [
        { x: 18, y: 22 },
        { x: 3, y: 22 },
        { x: -12, y: 22 },
        { x: -20, y: 10 },
        { x: -28, y: -2 },
      ],
      F: [
        { x: -24, y: 2 },
        { x: -10, y: -22 },
        { x: 2, y: 0 },
        { x: -10, y: 22 },
        { x: -20, y: 12 },
        { x: -16, y: 2 },
      ],
      B: [
        { x: 12, y: -22 },
        { x: 18, y: -10 },
        { x: 24, y: 2 },
        { x: 18, y: 12.5 },
        { x: 12, y: 23 },
      ],
    },
    schedule: ["R", "R", "L", "L", "U", "U", "D", "D", "F", "F", "B", "B"],
    speed: 0.6,
  };

  // contentContainer
  // ├── baseGraphics
  // ├── cubesGraphics

  cubesGraphics: Graphics[] = [];
  rotationSparkle = new Graphics();

  rubiksCubeTiles = [
    Array.from({ length: 3 }, () => Array(3).fill("#ea0600")), // R
    Array.from({ length: 3 }, () => Array(3).fill("#07a42e")), // F
    Array.from({ length: 3 }, () => Array(3).fill("#f2f2f2")), // U
    Array.from({ length: 3 }, () => Array(3).fill("#fff144")), // D
    Array.from({ length: 3 }, () => Array(3).fill("#2512d6")), // B
    Array.from({ length: 3 }, () => Array(3).fill("#ffa40d")), // L
  ];

  private rotationState = {
    isSideRotated: false,
    currentRotatedSide: 0,

    rotationSparklePosition: 0,
  };

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
    this.contentContainer.addChild(this.rotationSparkle);
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
    const transforms = [
      (row: number, column: number) => [row, column],
      (row: number, column: number) => [2 - column, row],
      (row: number, column: number) => [2 - row, 2 - column],
    ];

    for (let face = 0; face < 3; face++) {
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          const graphic = new Graphics();

          const [cubeRow, cubeColumn] = transforms[face](row, column);
          const position = this.getCubeTilePosition(
            face,
            cubeRow,
            cubeColumn,
            Researcher.cubesParams.size,
          );

          graphic.position.set(position.x, position.y);

          this.makeCubeTile(
            graphic,
            Researcher.cubesParams.size,
            face,
            this.rubiksCubeTiles[face][row][column],
          );

          this.cubesGraphics.push(graphic);
          this.contentContainer.addChild(graphic);
        }
      }
    }
  }

  private getCubeTilePosition(
    type: number,
    row: number,
    column: number,
    size: number,
  ) {
    const { startX, startY, endX, endY } = getRadialLine(type, 3, 0, size);

    const { x, y } = getRadialPoint(type * 3 + 3, 9, size);

    return {
      x: column * (endX - startX) + row * (x - startX),
      y: column * (endY - startY) + row * (y - startY),
    };
  }

  private makeCubeTile(
    graphic: Graphics,
    size: number,
    type: number,
    color: string,
  ) {
    const {
      startX: sx,
      startY: sy,
      endX: ex,
      endY: ey,
    } = getRadialLine(type, 3, 0, size);

    const { x: x1, y: y1 } = getRadialPoint(type * 3 + 1.5, 3 * 3, size);

    const { x: x2, y: y2 } = getRadialPoint(type * 3 + 3, 3 * 3, size);

    graphic
      .moveTo(sx, sy)
      .lineTo(ex, ey)
      .lineTo(x1, y1)
      .lineTo(x2, y2)
      .closePath()
      .stroke({
        width: Researcher.cubesParams.strokeWidth,
        color: Researcher.cubesParams.strokeColor,
        join: "round",
      })
      .fill("#ffffff");

    graphic.tint = color;
  }

  animation(delta: number) {
    const maxPosition =
      Researcher.rotationParams.segments[this.getCurrnetSide()].length;

    this.rotationState.rotationSparklePosition +=
      Researcher.rotationParams.speed * delta;
    this.rotationSparkle.clear();

    if (this.rotationState.rotationSparklePosition <= maxPosition) {
      this.showSegmentPart();
      return;
    }

    if (!this.rotationState.isSideRotated) {
      this.rotateSide();
      this.rotationState.isSideRotated = true;
    }

    this.hideSegmentPart(maxPosition);

    if (this.rotationState.rotationSparklePosition > 50) {
      this.rotationState.rotationSparklePosition = 0;
      this.rotationState.isSideRotated = false;

      this.rotationState.currentRotatedSide++;
      if (
        this.rotationState.currentRotatedSide >=
        Researcher.rotationParams.schedule.length
      ) {
        this.rotationState.currentRotatedSide = 0;
      }
    }
  }

  private showSegmentPart() {
    const segments = Researcher.rotationParams.segments[this.getCurrnetSide()];
    const completedSegments = Math.floor(
      this.rotationState.rotationSparklePosition,
    );
    const partialProgress = this.rotationState.rotationSparklePosition % 1;

    for (let i = 0; i < completedSegments; i++) {
      this.drawSegment(segments[i], segments[i + 1], 0, 1);
    }
    if (completedSegments < segments.length - 1) {
      this.drawSegment(
        segments[completedSegments],
        segments[completedSegments + 1],
        0,
        partialProgress,
      );
    }
  }

  private hideSegmentPart(maxPosition: number) {
    const segments = Researcher.rotationParams.segments[this.getCurrnetSide()];
    const hidePosition =
      this.rotationState.rotationSparklePosition - maxPosition;
    const completedHiddenSegments = Math.floor(hidePosition);
    const partialProgress = hidePosition % 1;

    for (let i = completedHiddenSegments + 1; i < segments.length - 1; i++) {
      this.drawSegment(segments[i], segments[i + 1], 0, 1);
    }
    if (completedHiddenSegments < segments.length - 1) {
      this.drawSegment(
        segments[completedHiddenSegments],
        segments[completedHiddenSegments + 1],
        partialProgress,
        1,
      );
    }
  }

  private drawSegment(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    start: number,
    end: number,
  ) {
    const startX = startPoint.x + (endPoint.x - startPoint.x) * start;
    const startY = startPoint.y + (endPoint.y - startPoint.y) * start;
    const endX = startPoint.x + (endPoint.x - startPoint.x) * end;
    const endY = startPoint.y + (endPoint.y - startPoint.y) * end;
    this.rotationSparkle
      .moveTo(startX, startY)
      .lineTo(endX, endY)
      .stroke({ width: 15, color: "#ffffff", cap: "round" });
  }

  private getCurrnetSide() {
    return Researcher.rotationParams.schedule[
      this.rotationState.currentRotatedSide
    ];
  }

  private rotateSide() {
    const rotateMethods = {
      R: () => this.rotateRightSide(),
      L: () => this.rotateLeftSide(),
      U: () => this.rotateUpSide(),
      D: () => this.rotateDownSide(),
      F: () => this.rotateFrontSide(),
      B: () => this.rotateBackSide(),
    };

    rotateMethods[this.getCurrnetSide()]();
  }

  private rotateRightSide() {
    this.rubiksCubeTiles[0] = rotateMatrix(this.rubiksCubeTiles[0]);

    const front = this.rubiksCubeTiles[1];
    const up = this.rubiksCubeTiles[2];
    const down = this.rubiksCubeTiles[3];
    const back = this.rubiksCubeTiles[4];

    const frontRow = [front[0][2], front[1][2], front[2][2]];

    for (let i = 0; i < 3; i++) {
      front[i][2] = down[i][2];
      down[i][2] = back[2 - i][0];
      back[2 - i][0] = up[i][2];
      up[i][2] = frontRow[i];
    }

    this.dyeTiles();
  }

  private rotateLeftSide() {
    this.rubiksCubeTiles[5] = rotateMatrix(this.rubiksCubeTiles[5]);

    const front = this.rubiksCubeTiles[1];
    const up = this.rubiksCubeTiles[2];
    const down = this.rubiksCubeTiles[3];
    const back = this.rubiksCubeTiles[4];

    const frontRow = [front[0][0], front[1][0], front[2][0]];

    for (let i = 0; i < 3; i++) {
      front[i][0] = down[i][0];
      down[i][0] = back[2 - i][2];
      back[2 - i][2] = up[i][0];
      up[i][0] = frontRow[i];
    }

    this.dyeTiles();
  }

  private rotateUpSide() {
    this.rubiksCubeTiles[2] = rotateMatrix(this.rubiksCubeTiles[2]);

    const right = this.rubiksCubeTiles[0];
    const front = this.rubiksCubeTiles[1];
    const back = this.rubiksCubeTiles[4];
    const left = this.rubiksCubeTiles[5];

    const frontRow = [...front[0]];

    for (let i = 0; i < 3; i++) {
      front[0][i] = right[0][i];
      right[0][i] = back[0][i];
      back[0][i] = left[0][i];
      left[0][i] = frontRow[i];
    }

    this.dyeTiles();
  }

  private rotateDownSide() {
    this.rubiksCubeTiles[3] = rotateMatrix(this.rubiksCubeTiles[3]);

    const right = this.rubiksCubeTiles[0];
    const front = this.rubiksCubeTiles[1];
    const back = this.rubiksCubeTiles[4];
    const left = this.rubiksCubeTiles[5];

    const frontRow = [...front[2]];

    for (let i = 0; i < 3; i++) {
      front[2][i] = right[2][i];
      right[2][i] = back[2][i];
      back[2][i] = left[2][i];
      left[2][i] = frontRow[i];
    }

    this.dyeTiles();
  }

  private rotateFrontSide() {
    this.rubiksCubeTiles[1] = rotateMatrix(this.rubiksCubeTiles[1]);

    const right = this.rubiksCubeTiles[0];
    const up = this.rubiksCubeTiles[2];
    const down = this.rubiksCubeTiles[3];
    const left = this.rubiksCubeTiles[5];

    const upRow = [...up[2]];

    for (let i = 0; i < 3; i++) {
      up[2][2 - i] = left[i][2];
      left[i][2] = down[0][i];
      down[0][i] = right[2 - i][0];
      right[2 - i][0] = upRow[2 - i];
    }

    this.dyeTiles();
  }

  private rotateBackSide() {
    this.rubiksCubeTiles[4] = rotateMatrix(this.rubiksCubeTiles[4]);

    const right = this.rubiksCubeTiles[0];
    const up = this.rubiksCubeTiles[2];
    const down = this.rubiksCubeTiles[3];
    const left = this.rubiksCubeTiles[5];

    const upRow = [...up[0]];

    for (let i = 0; i < 3; i++) {
      up[0][2 - i] = left[i][0];
      left[i][0] = down[2][i];
      down[2][i] = right[2 - i][2];
      right[2 - i][2] = upRow[2 - i];
    }

    this.dyeTiles();
  }

  private dyeTiles() {
    for (let face = 0; face < 3; face++) {
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          const index = face * 9 + row * 3 + column;

          this.cubesGraphics[index].tint =
            this.rubiksCubeTiles[face][row][column];
        }
      }
    }
  }
}

function rotateMatrix(matrix: string[][]): string[][] {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}
