import { gameScreen } from "@utils/game-config";

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

export function getResearchMenuPosition() {
  return {
    x: getGameScreenCenter().x,
    y: gameScreen.height - gameScreen.height / 50,
  };
}

export function getQuestListMenuPosition() {
  return {
    x: 20,
    y: gameScreen.height - gameScreen.height / 250,
  };
}

export function getQuestListButtonPosition() {
  return {
    x: 20,
    y: gameScreen.height - gameScreen.height / 18,
  };
}

export function getCollectorPositionInConstructionMenu() {
  return {
    x: 228,
    y: 915,
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
    x: getHeaderPosition().x + 10,
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
    x: 70,
    y: 20,
  };
}

export function getPositionOfEngineUpgradeButton() {
  return {
    x: 480,
    y: 995,
  };
}

export function getPositionOfResearchingProgressBar() {
  return {
    x: getGameScreenCenter().x,
    y: 1200,
  };
}

export function getCameraResetButtonPosition() {
  return {
    x: gameScreen.width - gameScreen.width / 18,
    y: 40,
  };
}
