import { Container, Graphics } from "pixi.js";

import { getAngleDifference, rotatePointByCenter } from "@utils/basic-geometry";

const isTest = import.meta.env.MODE === "test";

export class Legs extends Container {
  private leftLeg = new Graphics();
  private rightLeg = new Graphics();

  private static params = {
    size: 4,
    offset: 10,

    color: "#000000",

    toeWidth: 4,
    toeHeight: 2,
  };

  private standingLeg = "left";

  private distanceThreshold = 12;

  private productionAnimationSpeed = 0.05;

  constructor() {
    super();

    this.leftLeg.circle(0, 0, Legs.params.size).fill(Legs.params.color);
    this.leftLeg.position.set(-Legs.params.offset, 0);
    this.addChild(this.leftLeg);

    this.rightLeg.circle(0, 0, Legs.params.size).fill(Legs.params.color);
    this.rightLeg.position.set(Legs.params.offset, 0);
    this.addChild(this.rightLeg);
  }

  public setWorkerPosition(x: number, y: number) {
    this.leftLeg.position.set(x - Legs.params.offset, y);
    this.rightLeg.position.set(x + Legs.params.offset, y);

    this.standingLeg = "left";
    this.setToes();
  }

  public productionAnimation(delta: number) {
    if (!isTest) {
      if (this.standingLeg === "left") {
        this.rightLeg.rotation -= this.productionAnimationSpeed * delta;
      } else {
        this.leftLeg.rotation -= this.productionAnimationSpeed * delta;
      }
    }
  }

  public moveCharacter(
    body: Container,
    moveToX: number,
    moveToY: number,
    movingSpeed: number,
    delta: number,
  ) {
    const x = body.x;
    const y = body.y;
    let isReachedTarget = false;

    if (isTest) {
      body.position.set(moveToX, moveToY);

      this.leftLeg.position.set(moveToX - Legs.params.offset, moveToY);
      this.rightLeg.position.set(moveToX + Legs.params.offset, moveToY);

      isReachedTarget = true;
    } else {
      const dx = moveToX - x;
      const dy = moveToY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.distanceThreshold) {
        if (this.standingLeg === "left") {
          this.moveBodyAndLegs(
            this.leftLeg,
            this.rightLeg,
            body,
            moveToX,
            moveToY,
            movingSpeed,
            delta,
          );
        } else {
          this.moveBodyAndLegs(
            this.rightLeg,
            this.leftLeg,
            body,
            moveToX,
            moveToY,
            movingSpeed,
            delta,
          );
        }
      } else {
        isReachedTarget = true;
      }
    }

    return isReachedTarget;
  }

  private moveBodyAndLegs(
    freeLeg: Graphics,
    standingLeg: Graphics,
    body: Container,
    targetX: number,
    targetY: number,
    movingSpeed: number,
    delta: number,
  ) {
    const rotationSpeed = 0.15 * movingSpeed;
    const maxRotation = rotationSpeed * delta;

    const currentAngleFromStandingToFreeLeg = Math.atan2(
      freeLeg.y - standingLeg.y,
      freeLeg.x - standingLeg.x,
    );
    const targetAngleFromStandingToFreeLeg = Math.atan2(
      targetY - standingLeg.y,
      targetX - standingLeg.x,
    );
    const targetBodyRotation = targetAngleFromStandingToFreeLeg + Math.PI / 2;

    const bodyRotationDifference = getAngleDifference(
      body.rotation,
      targetBodyRotation,
    );

    if (Math.abs(bodyRotationDifference) > 0.01) {
      body.rotation +=
        Math.sign(bodyRotationDifference) *
        Math.min(Math.abs(bodyRotationDifference), maxRotation * 2);
    } else {
      body.rotation = targetBodyRotation;

      const shortestLegAngleDifference = getAngleDifference(
        currentAngleFromStandingToFreeLeg,
        targetAngleFromStandingToFreeLeg,
      );

      const isNearHalfTurn =
        Math.abs(shortestLegAngleDifference) >= Math.PI - Math.PI / 6;
      const preferredDirection = freeLeg === this.leftLeg ? 1 : -1;
      const legAngleDifference = isNearHalfTurn
        ? preferredDirection * Math.abs(shortestLegAngleDifference)
        : shortestLegAngleDifference;

      const stepPartAngle =
        Math.sign(legAngleDifference) *
        Math.min(Math.abs(legAngleDifference), maxRotation);

      if (Math.abs(legAngleDifference) > 0.001) {
        this.doStepPart(freeLeg, standingLeg, body, stepPartAngle);
      } else {
        this.changeStandingLeg();
        this.setToes();
      }
    }
  }

  private changeStandingLeg() {
    this.standingLeg = this.standingLeg === "left" ? "right" : "left";
  }

  private doStepPart(
    freeLeg: Graphics,
    standingLeg: Graphics,
    body: Container,
    rotation: number,
  ) {
    const newWorkerPosition = rotatePointByCenter(
      body.x,
      body.y,
      standingLeg.x,
      standingLeg.y,
      rotation,
    );

    const newLegPosition = rotatePointByCenter(
      freeLeg.x,
      freeLeg.y,
      standingLeg.x,
      standingLeg.y,
      rotation,
    );

    body.position.set(newWorkerPosition.x, newWorkerPosition.y);

    freeLeg.position.set(newLegPosition.x, newLegPosition.y);
  }

  private setToes() {
    this.leftLeg.clear();
    this.rightLeg.clear();

    if (this.standingLeg === "left") {
      this.leftLeg.circle(0, 0, Legs.params.size).fill(Legs.params.color);

      this.rightLeg
        .moveTo(0, -Legs.params.size - Legs.params.toeHeight)
        .lineTo(0, Legs.params.size + Legs.params.toeHeight)
        .moveTo(-Legs.params.size - Legs.params.toeHeight, 0)
        .lineTo(Legs.params.size + Legs.params.toeHeight, 0)
        .stroke({ width: Legs.params.toeWidth, color: Legs.params.color })
        .circle(0, 0, Legs.params.size)
        .fill(Legs.params.color);
    } else {
      this.rightLeg.circle(0, 0, Legs.params.size).fill(Legs.params.color);

      this.leftLeg
        .moveTo(0, -Legs.params.size - Legs.params.toeHeight)
        .lineTo(0, Legs.params.size + Legs.params.toeHeight)
        .moveTo(-Legs.params.size - Legs.params.toeHeight, 0)
        .lineTo(Legs.params.size + Legs.params.toeHeight, 0)
        .stroke({ width: Legs.params.toeWidth, color: Legs.params.color })
        .circle(0, 0, Legs.params.size)
        .fill(Legs.params.color);
    }
  }
}
