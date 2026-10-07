import { type Container } from "pixi.js";
import { getGameScreenCenter } from "@utils/ui-config";
import { backgroundManager } from "../main";
import { aircraft } from "@aircraft/aircraft";
import { Engine } from "@aircraft/modules/engine";
import { onGroundObjects } from "../on-ground/objects";

const ship = {
  x: 0,
  y: 0,
  angle: 0,
  m: 1,
  thrustVelocity: 0,
  angularVelocity: 0,
};

export function moveWorld(
  delta: number,
  worldLayer: Container,
  buildingsLayer: Container,
  workersLayer: Container,
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

  if (ship.thrustVelocity !== 0 || ship.angularVelocity !== 0) {
    onGroundObjects.checkColision();
  }

  thrustWorld(delta, thrustInput);
  turnWorld(delta, turnInput);

  worldLayer.pivot.set(ship.x, ship.y);
  worldLayer.rotation = ship.angle;
  worldLayer.position.set(
    getGameScreenCenter().x * ship.m,
    getGameScreenCenter().y * ship.m,
  );

  worldLayer.scale.set(ship.m);
  buildingsLayer.scale.set(ship.m);
  workersLayer.scale.set(ship.m);

  if (import.meta.env.MODE !== "test") {
    backgroundManager.update(ship.x, ship.y);
  }

  if (thrustInput === 0) {
    return undefined;
  } else {
    return Math.atan2(thrustInput, 0);
  }
}

function thrustWorld(delta: number, thrustInput: number) {
  const thrust = Math.max(-1, Math.min(1, thrustInput));

  const engines = aircraft.buildings.filter((b) => b.buildingType === "Engine");

  const targetVelocity =
    thrust *
    ((30 * (engines.length * Engine.speedModifier)) /
      aircraft.buildings.length);

  const thrustResponse = 1 - Math.exp(-0.02 * delta);

  ship.thrustVelocity = zeroIfTiny(
    approach(ship.thrustVelocity, targetVelocity, thrustResponse),
    1e-2,
  );

  ship.x += -ship.thrustVelocity * Math.sin(-ship.angle) * delta;
  ship.y += ship.thrustVelocity * Math.cos(-ship.angle) * delta;
}

function turnWorld(delta: number, turnInput: number) {
  const turn = Math.max(-1, Math.min(1, turnInput));

  const engines = aircraft.buildings.filter((b) => b.buildingType === "Engine");

  const targetTurn =
    turn *
    ((0.1 * (engines.length * Engine.speedModifier)) /
      aircraft.buildings.length);

  const turnResponse = 1 - Math.exp(-0.08 * delta);

  ship.angularVelocity = zeroIfTiny(
    approach(ship.angularVelocity, targetTurn, turnResponse),
    1e-6,
  );

  ship.angle -= ship.angularVelocity * delta;
}

function approach(current: number, target: number, response: number) {
  return current + (target - current) * response;
}

function zeroIfTiny(value: number, threshold = 1e-8) {
  return Math.abs(value) < threshold ? 0 : value;
}
