import { Graphics, Sprite } from "pixi.js";

import { Building, type BuildingConfig } from "@aircraft/building";

import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRandomDelay } from "@utils/delay";

type Particle = {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
};

export class Junkyard extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 52,

    inventorySize: 20,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 60,

    baseGraphicalSize: 60,

    minRoadLength: 120,
    maxRoadLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 5 },
    { resourceName: "Water", amount: 2 },
  ];

  private static buildingParams = {
    baseColor: "#cac8a5",
  };

  // contentContainer
  // ├── particles
  // ├── baseGraphics

  private particles: Particle[] = [];
  private particlesColor = "#000000";
  private amountOfParticles = 4;

  constructor(x: number, y: number, isDecorative = false) {
    super(x, y, "Junkyard", isDecorative);
    this.draw();
  }

  protected draw() {
    this.shadowFilter.addBasicShadowFilter(this.contentContainer);

    this.createBaseTexture();

    const base = new Sprite(Junkyard.baseTexture);
    this.contentContainer.addChild(base);

    this.createParticles();
  }

  private createBaseTexture() {
    if (Junkyard.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Junkyard.buildingConfig.baseGraphicalSize,
      Junkyard.buildingParams.baseColor,
      true,
    );

    Junkyard.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private createParticles() {
    for (let i = 0; i < this.amountOfParticles; i++) {
      const particle = new Graphics()
        .circle(0, 0, 20)
        .fill(this.particlesColor);

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.3,
        scale: 1,
        delay: getRandomDelay(32, 64),
      });
      this.contentContainer.addChildAt(particle, 0);
    }
  }

  animation(delta: number) {
    for (const particle of this.particles) {
      if (particle.delay <= 0) {
        particle.gfx.x += Math.cos(particle.angle) * particle.speed * delta;
        particle.gfx.y += Math.sin(particle.angle) * particle.speed * delta;

        particle.scale -= 0.012 * delta;
        particle.gfx.scale.set(particle.scale);

        if (particle.scale <= 0.2) {
          this.resetParticle(particle);
        }
      } else {
        particle.delay -= delta;
      }
    }
  }

  private resetParticle(particle: Particle) {
    particle.gfx.x = 0;
    particle.gfx.y = 0;

    particle.angle = Math.random() * Math.PI * 2;
    particle.scale = 1;
    particle.delay = getRandomDelay(32, 64);

    particle.gfx.scale.set(1);
  }
}
