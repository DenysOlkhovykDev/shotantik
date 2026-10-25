import { type Container } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";
import { Engine } from "@aircraft/modules/engine";
import { getGameScreenCenter } from "@utils/ui-config";

export function moveWorld(
  delta: number,
  cameraLayer: Container,
  turnInput: number,
  thrustInput: number,
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

  cameraLayer.pivot.set(aircraft.x, aircraft.y);
  cameraLayer.position.set(getGameScreenCenter().x, getGameScreenCenter().y);
  cameraLayer.rotation = -aircraft.rotation;
  cameraLayer.scale.set(1);

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

  aircraft.x -=
    aircraft.motionParameters.thrustVelocity *
    Math.sin(aircraft.rotation) *
    delta;
  aircraft.y +=
    aircraft.motionParameters.thrustVelocity *
    Math.cos(aircraft.rotation) *
    delta;
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

  aircraft.rotation += aircraft.motionParameters.angularVelocity * delta;
}

function approach(current: number, target: number, response: number) {
  return current + (target - current) * response;
}

function zeroIfTiny(value: number, threshold = 1e-8) {
  return Math.abs(value) < threshold ? 0 : value;
}
