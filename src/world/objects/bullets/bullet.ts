import { Container, Graphics, Sprite, type Texture } from "pixi.js";

import {
  generateTextureFromOrigin,
  makeCircle,
  makeStar,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Bullet extends Container {
  static baseTexture: Texture;

  private static explosion = {
    yellow: "#ffd21c",
    orange: "#ff7900",
    lightOrange: "#ffa000",
    darkOrange: "#e85b00",
    gray: "#a0a0a2",
  };

  private explosionFrame = 0;

  private temp = 0;

  constructor() {
    super();

    this.createBaseTexture();

    const base = new Sprite(Bullet.baseTexture);
    this.addChild(base);
  }

  private createBaseTexture() {
    if (Bullet.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics.circle(0, 0, 10).fill("#000000");

    Bullet.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  public reset() {
    this.removeChildren();

    this.explosionFrame = 0;

    const base = new Sprite(Bullet.baseTexture);
    this.addChild(base);
  }

  public explosionAnimation() {
    if (this.explosionFrame >= 6) {
      return false;
    }

    this.removeChildren().forEach((child) => child.destroy());

    const graphics = new Graphics();

    if (this.explosionFrame === 0) {
      makeStar(graphics, 8, 5, 12, Bullet.explosion.yellow, 0);
      makeCircle(0, 0, graphics, 4, Bullet.explosion.lightOrange, false);
    } else if (this.explosionFrame === 1) {
      makeStar(graphics, 8, 13, 25, Bullet.explosion.yellow, 0);

      makeCircle(0, 0, graphics, 15, Bullet.explosion.orange, false);
      makeCircle(-12, -12, graphics, 6, Bullet.explosion.orange, false);
      makeCircle(12, -12, graphics, 6, Bullet.explosion.orange, false);
      makeCircle(-12, 12, graphics, 6, Bullet.explosion.orange, false);
      makeCircle(12, 12, graphics, 6, Bullet.explosion.orange, false);

      makeCircle(0, 0, graphics, 9, Bullet.explosion.yellow, false);
    } else if (this.explosionFrame === 2) {
      makeStar(graphics, 12, 24, 34, Bullet.explosion.yellow, 0);
      graphics.rotation += Math.PI / 6;
      makeStar(graphics, 12, 12, 43, Bullet.explosion.yellow, 0);

      for (let i = 0; i < 9; i++) {
        const { x, y } = getRadialPoint(i, 9, 18);

        makeCircle(
          x,
          y,
          graphics,
          32 * (0.35 + Math.sin(i * 2) * 0.08),
          i % 2 === 0 ? Bullet.explosion.orange : Bullet.explosion.darkOrange,
          false,
        );
      }
      makeCircle(0, 0, graphics, 18, Bullet.explosion.orange, false);

      makeCircle(0, 0, graphics, 16, Bullet.explosion.yellow, false);
      makeCircle(0, 0, graphics, 11, Bullet.explosion.orange, false);
    } else if (this.explosionFrame === 3) {
      for (let i = 0; i < 10; i++) {
        const { x, y } = getRadialPoint(i, 10, 25);

        makeCircle(
          x,
          y,
          graphics,
          i % 2 === 0 ? 10 : 7,
          i % 2 === 0 ? Bullet.explosion.orange : Bullet.explosion.yellow,
          false,
        );
      }

      makeCircle(0, 0, graphics, 13, Bullet.explosion.gray, false);
    } else if (this.explosionFrame === 4) {
      makeCircle(-35, -20, graphics, 5, Bullet.explosion.yellow, false);
      makeCircle(30, -30, graphics, 7, Bullet.explosion.orange, false);
      makeCircle(42, 15, graphics, 5, Bullet.explosion.yellow, false);
      makeCircle(-20, 35, graphics, 6, Bullet.explosion.orange, false);
      makeCircle(5, -42, graphics, 4, Bullet.explosion.yellow, false);
      makeCircle(-43, 12, graphics, 4, Bullet.explosion.orange, false);
    } else if (this.explosionFrame === 5) {
      makeCircle(-48, -30, graphics, 3, Bullet.explosion.orange, false);
      makeCircle(42, -35, graphics, 3, Bullet.explosion.orange, false);
      makeCircle(55, 15, graphics, 2, Bullet.explosion.yellow, false);
      makeCircle(-30, 45, graphics, 3, Bullet.explosion.orange, false);
      makeCircle(15, 50, graphics, 2, Bullet.explosion.yellow, false);
    }

    this.addChild(graphics);

    this.temp++;
    if (this.temp >= 3) {
      this.explosionFrame++;
      this.temp = 0;
    }

    return true;
  }
}
