import { Container, Graphics } from "pixi.js";

import { getMiddlePoint, getRadialPoint } from "@utils/basic-geometry";
import { getGameScreenCenter } from "@utils/ui-config";

class Logo extends Container {
  constructor() {
    super();

    const graphics = new Graphics();

    graphics.rect(-58, -64, 128, 128).fill("#f8f7f1");

    const { x: roadX1, y: roadY1 } = getRadialPoint(0, 3, 30);
    const { x: roadX2, y: roadY2 } = getRadialPoint(1, 3, 30);
    const { x: roadX3, y: roadY3 } = getRadialPoint(2, 3, 30);

    graphics
      .moveTo(roadX1, roadY1)
      .lineTo(roadX2, roadY2)
      .lineTo(roadX3, roadY3)
      .closePath()
      .stroke({ width: 12, color: "#212121" });

    graphics.circle(roadX2, roadY2, 22).fill("#212121");
    graphics.roundRect(roadX1 - 20, roadY1 - 20, 40, 40, 8).fill("#212121");

    const { x: triangleX1, y: triangleY1 } = getRadialPoint(0, 3, 22);
    const { x: triangleX2, y: triangleY2 } = getRadialPoint(1, 3, 22);
    const { x: triangleX3, y: triangleY3 } = getRadialPoint(2, 3, 22);

    graphics
      .moveTo(triangleX1 + roadX3, triangleY1 + roadY3)
      .lineTo(triangleX2 + roadX3, triangleY2 + roadY3)
      .lineTo(triangleX3 + roadX3, triangleY3 + roadY3)
      .closePath()
      .stroke({ width: 10, color: "#212121", join: "round" })
      .fill("#212121");

    const { x: middleX1, y: middleY1 } = getMiddlePoint(
      roadX1,
      roadY1,
      roadX2,
      roadY2,
    );
    const { x: middleX2, y: middleY2 } = getMiddlePoint(
      roadX2,
      roadY2,
      roadX3,
      roadY3,
    );
    const { x: middleX3, y: middleY3 } = getMiddlePoint(
      roadX1,
      roadY1,
      roadX3,
      roadY3,
    );

    graphics.circle(middleX1, middleY1, 2).fill("#f8f7f1");
    graphics.circle(middleX2, middleY2, 2).fill("#f8f7f1");
    graphics.circle(middleX3, middleY3, 2).fill("#f8f7f1");

    graphics.rotation = Math.PI / 2 + Math.PI;
    graphics.position.set(getGameScreenCenter().x, 128);

    this.addChild(graphics);
  }
}

export const logo = new Logo();
