import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { joystick } from "@joystick/joystick";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRandomDelay } from "@utils/delay";
import { getRadialPoint, getRandomCoordinate } from "@utils/basic-geometry";

interface Particle {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
  isActive: boolean;
}

export class Engine extends Building {
  static buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 12,

    inventorySize: 1,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 27,

    baseGraphicalSize: 20,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Gum", amount: 1 },
    { resourceName: "Gear", amount: 1 },
    { resourceName: "Truss", amount: 1 },
  ];

  static propellerParams = {
    amount: 3,
    size: 7,
    strokeColor: "#000000",
    wingColor: "#a7a7a7",
    rotationSpeed: 0.035,
  };

  static decoPropellerParams = {
    amount: 3,
    tracesWidth: 1.6,
    traceRadiuses: [
      Engine.buildingConfig.baseGraphicalSize - 14,
      Engine.buildingConfig.baseGraphicalSize - 10,
      Engine.buildingConfig.baseGraphicalSize - 5,
    ],
    color: "#a7a7a7",
  };

  static buildingParams = {
    baseColor: "#c9c9c9",
  };

  // contentContainer
  // ├── particle
  // ├── propellerGraphics
  // ├── baseGraphics

  propellerGraphics: Graphics = new Graphics();

  particles: Particle[] = [];
  particlesColor = "#000000";
  amountOfParticles: number = 4;

  constructor(x: number, y: number) {
    super(x, y, "Engine");
    this.draw();
  }

  onClick(event: FederatedPointerEvent) {
    super.onClick(event);
    joystick.show();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Engine.buildingConfig.baseGraphicalSize,
    );

    this.createPropellerBlades();

    this.createBaseTexture();

    const base = new Sprite(Engine.baseTexture);
    this.contentContainer.addChild(base);

    for (let i = 0; i < this.amountOfParticles; i++) {
      const particle = new Graphics().circle(0, 0, 5).fill(this.particlesColor);

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.7,
        scale: 0,
        delay: getRandomDelay(1, 64),
        isActive: false,
      });
      this.contentContainer.addChildAt(particle, 0);
    }
  }

  private createPropellerBlades() {
    for (let i = 0; i < Engine.propellerParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i * 8,
        Engine.propellerParams.amount * 8,
        Engine.buildingConfig.baseGraphicalSize,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i * 8 - 1,
        Engine.propellerParams.amount * 8,
        Engine.buildingConfig.baseGraphicalSize + Engine.propellerParams.size,
      );

      this.propellerGraphics.moveTo(x1, y1).lineTo(x2, y2).stroke({
        width: 14,
        color: Engine.propellerParams.strokeColor,
        cap: "round",
      });
      this.propellerGraphics.moveTo(x1, y1).lineTo(x2, y2).stroke({
        width: 10,
        color: Engine.propellerParams.wingColor,
        cap: "round",
      });
    }
    this.contentContainer.addChild(this.propellerGraphics);
  }

  private createBaseTexture() {
    if (Engine.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Engine.buildingConfig.baseGraphicalSize,
      Engine.buildingParams.baseColor,
      true,
    );

    this.makeDecorativePropellerBlades(baseGraphics);

    Engine.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeDecorativePropellerBlades(baseGraphics: Graphics) {
    baseGraphics.circle(0, 0, 3).fill(Engine.decoPropellerParams.color);

    for (let i = 0; i < Engine.decoPropellerParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        Engine.decoPropellerParams.amount,
        Engine.buildingConfig.baseGraphicalSize - 15,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i,
        Engine.decoPropellerParams.amount,
        Engine.buildingConfig.baseGraphicalSize - 4,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);

      baseGraphics.stroke({
        width: 6,
        color: Engine.decoPropellerParams.color,
      });

      const { angle } = getRadialPoint(i, Engine.decoPropellerParams.amount, 1);

      for (
        let j = 0;
        j < Engine.decoPropellerParams.traceRadiuses.length;
        j++
      ) {
        const startX =
          Math.cos(angle - Engine.decoPropellerParams.tracesWidth) *
          Engine.decoPropellerParams.traceRadiuses[j];
        const startY =
          Math.sin(angle - Engine.decoPropellerParams.tracesWidth) *
          Engine.decoPropellerParams.traceRadiuses[j];

        baseGraphics.moveTo(startX, startY);
        baseGraphics.arc(
          0,
          0,
          Engine.decoPropellerParams.traceRadiuses[j],
          angle - Engine.decoPropellerParams.tracesWidth,
          angle,
        );

        baseGraphics.stroke({
          width: j + 1,
          color: Engine.decoPropellerParams.color,
        });
      }
    }
  }

  animation(delta: number, movingAngle?: number) {
    this.propellerGraphics.rotation +=
      Engine.propellerParams.rotationSpeed * delta;

    const isMoving = movingAngle !== undefined;
    const backAngle = isMoving ? movingAngle + this.geometry.orientation : 0;

    for (const particle of this.particles) {
      if (particle.scale <= 0.1) {
        if (isMoving) {
          this.resetParticle(particle);
        }
        continue;
      }

      if (!particle.isActive) {
        if (isMoving) {
          particle.delay -= delta;

          if (particle.delay <= 0) {
            const spread = 0.4;
            particle.angle = backAngle + (Math.random() - 0.5) * spread;
            particle.isActive = true;
          }
        }
        continue;
      }

      particle.gfx.x += Math.cos(particle.angle) * particle.speed * delta;
      particle.gfx.y += Math.sin(particle.angle) * particle.speed * delta;

      particle.scale -= 0.02 * delta;
      particle.gfx.scale.set(particle.scale);
    }
  }

  private resetParticle(particle: Particle) {
    particle.gfx.x = getRandomCoordinate(
      Engine.buildingConfig.baseGraphicalSize,
      7,
    );
    particle.gfx.y = getRandomCoordinate(
      Engine.buildingConfig.baseGraphicalSize,
      7,
    );

    particle.scale = 1;
    particle.delay = getRandomDelay(1, 64);
    particle.isActive = false;

    particle.gfx.scale.set(1);
  }
}
