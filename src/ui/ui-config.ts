import { gameScreen } from "../game-config";

export function getGameScreenCenter() {
  return {
    x: gameScreen.width / 2,
    y: gameScreen.height / 2,
  };
}

export function getConstructionButtonPosition() {
  return {
    x: getGameScreenCenter().x,
    y: gameScreen.height - gameScreen.height / 20,
  };
}

export function getConstructionDisplayPosition() {
  return {
    x: getGameScreenCenter().x,
    y: gameScreen.height - gameScreen.height / 20,
  };
}

export function getConstructionMenuPosition() {
  return {
    x: getGameScreenCenter().x,
    y: gameScreen.height - gameScreen.height / 50,
  };
}

export function getMixerPositionInConstructionMenuPosition() {
  return {
    x: 360,
    y: 1070,
  };
}

export function getJoyStickPosition() {
  return {
    x: getGameScreenCenter().x,
    y: gameScreen.height - gameScreen.height / 15,
  };
}

export function getHeaderPosition() {
  return {
    x: getGameScreenCenter().x,
    y: 20,
  };
}

export function getHeaderDeleteButtonPosition() {
  return {
    x: getHeaderPosition().x,
    y: getHeaderPosition().y + 40,
  };
}

export function getPauseButtonPosition() {
  return {
    x: 20,
    y: 20,
  };
}
export function getSpeedButtonPosition() {
  return {
    x: 60,
    y: 20,
  };
}
