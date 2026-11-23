import { Container } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";
import { Engine } from "@aircraft/modules/engine";

import { getGameScreenCenter } from "@utils/ui-config";
import { rotatePointByCenter } from "@utils/basic-geometry";
import { chunkManager } from "../../main";

export function moveWorld(
  delta: number,
  cameraLayer: Container,
  turnInput: number,
  thrustInput: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
) {
  const absTurn = Math.abs(turnInput);
  const absThrust = Math.abs(thrustInput);

  if (absTurn > absThrust * 4) {
    thrustInput = 0;
  }

  if (absThrust > absTurn * 4) {
    turnInput = 0;
  }

  thrustShip(delta, thrustInput);
  turnShip(delta, turnInput);

  const { x: newX, y: newY } = rotatePointByCenter(
    offsetX,
    offsetY,
    0,
    0,
    aircraft.rotation,
  );

  cameraLayer.pivot.set(aircraft.x + newX, aircraft.y + newY);
  cameraLayer.position.set(getGameScreenCenter().x, getGameScreenCenter().y);
  cameraLayer.rotation = -aircraft.rotation;
  cameraLayer.scale.set(zoom);

  return thrustInput === 0 ? undefined : Math.atan2(thrustInput, 0);
}

function thrustShip(delta: number, thrustInput: number) {
  const thrust = Math.max(-1, Math.min(1, thrustInput));
  const engines = aircraft.buildings.filter((b) => b.buildingType === "Engine");
  const targetVelocity =
    thrust *
    ((30 * (engines.length * Engine.speedModifier)) /
      aircraft.buildings.length);
  const thrustResponse = 1 - Math.exp(-0.02 * delta);

  aircraft.motionParameters.thrustVelocity = zeroIfTiny(
    approach(
      aircraft.motionParameters.thrustVelocity,
      targetVelocity,
      thrustResponse,
    ),
    1e-2,
  );

  const newX =
    aircraft.x -
    aircraft.motionParameters.thrustVelocity *
      Math.sin(aircraft.rotation) *
      delta;

  const newY =
    aircraft.y +
    aircraft.motionParameters.thrustVelocity *
      Math.cos(aircraft.rotation) *
      delta;

  const isCollide = chunkManager.checkCollision(aircraft.rotation, newX, newY);

  if (!isCollide) {
    aircraft.x = newX;
    aircraft.y = newY;
  }
}

function turnShip(delta: number, turnInput: number) {
  const turn = Math.max(-1, Math.min(1, turnInput));
  const engines = aircraft.buildings.filter((b) => b.buildingType === "Engine");
  const targetTurn =
    turn *
    ((0.1 * (engines.length * Engine.speedModifier)) /
      aircraft.buildings.length);
  const turnResponse = 1 - Math.exp(-0.08 * delta);

  aircraft.motionParameters.angularVelocity = zeroIfTiny(
    approach(
      aircraft.motionParameters.angularVelocity,
      targetTurn,
      turnResponse,
    ),
    1e-6,
  );

  const newRotation =
    aircraft.rotation + aircraft.motionParameters.angularVelocity * delta;

  const isCollide = chunkManager.checkCollision(
    newRotation,
    aircraft.x,
    aircraft.y,
  );

  if (!isCollide) {
    aircraft.rotation = newRotation;
  }
}

function approach(current: number, target: number, response: number) {
  return current + (target - current) * response;
}

function zeroIfTiny(value: number, threshold = 1e-8) {
  return Math.abs(value) < threshold ? 0 : value;
}
