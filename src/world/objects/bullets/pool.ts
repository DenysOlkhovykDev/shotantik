import { Container } from "pixi.js";

import { Bullet } from "./bullet";
import { type Target } from "@objects/targets/target";
import { targetsManager } from "@objects/targets/manager";

class activeBullet {
  constructor(
    public bullet: Bullet,
    public toX: number,
    public toY: number,
    public target: Target,
  ) {}
}

class BulletPool extends Container {
  private pool: Bullet[] = [];

  private activeBullets: activeBullet[] = [];

  public launchBullet(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    target: Target,
  ) {
    const newActiveBullet = new activeBullet(
      this.get(fromX, fromY),
      toX,
      toY,
      target,
    );

    this.activeBullets.push(newActiveBullet);
  }

  public moveActiveBullets(delta: number) {
    for (const bullet of [...this.activeBullets]) {
      let x = bullet.bullet.x;
      let y = bullet.bullet.y;

      const dx = bullet.toX - x;
      const dy = bullet.toY - y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 15) {
        const vx = dx / distance;
        const vy = dy / distance;

        x += vx * 8 * delta;
        y += vy * 8 * delta;
      } else {
        const result = bullet.bullet.explosionAnimation();
        if (!result) {
          this.release(bullet.bullet);

          targetsManager.removeTarget(bullet.target);

          const index = this.activeBullets.indexOf(bullet);
          if (index > -1) {
            this.activeBullets.splice(index, 1);
          }
        }
      }

      bullet.bullet.position.set(x, y);
    }
  }

  private get(fromX: number, fromY: number) {
    let bullet = this.pool.pop();

    if (!bullet) {
      bullet = new Bullet();
      this.addChild(bullet);
    }

    bullet.reset();
    bullet.position.set(fromX, fromY);
    bullet.rotation = 0;
    bullet.alpha = 1;
    bullet.visible = true;

    return bullet;
  }

  private release(bullet: Bullet) {
    bullet.visible = false;
    this.pool.push(bullet);
  }
}

export const bulletPool = new BulletPool();
