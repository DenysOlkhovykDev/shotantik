import { Application, Container, Text } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";

import { BackgroundManager } from "@background/manager";
import { BackgroundTile } from "@background/tile";
import { onGroundObjects } from "@on-ground/objects";
import { createTestSituation } from "@test-situations/test-situation";
import { moveWorld } from "@moving/moving";

import { joystick } from "@joystick/joystick";
import { pauseButton } from "@pause/button";
import { speedButton } from "@speed/button";
import { constructionManager } from "@construction/manager";
import { compasses } from "@compass/manager";
import { tutorials } from "@tutorial/manager";
import { header } from "@header/manager";
import { researchManager } from "@research/manager";

import { gameScreen, getIsGameReady, setIsGameReady } from "@utils/game-config";
import {
  isCurrentTargetReached,
  checkFirstTargetReached,
} from "@utils/tutorial-conditions";
import { setTestRandom } from "@utils/initializers";
import { getGameScreenCenter } from "@utils/ui-config";

export const app = new Application();

await app.init({
  width: gameScreen.width,
  height: gameScreen.height,
  background: "#e5ecea",
  resolution: 2,
  antialias: false,
});

window.app = app;
app.canvas.setAttribute("aria-label", "Shotantik game world");
app.canvas.setAttribute("role", "img");

document.body.appendChild(app.canvas);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

const isTest = import.meta.env.MODE === "test";

if (isTest) {
  setTestRandom();
  window.setIsGameReady = setIsGameReady;
}

const UIcontainer = new Container();

const DEBUG_INFO = new Text({
  text: ``,
  style: {
    fill: "#000000",
    fontSize: 28,
  },
});

UIcontainer.addChild(joystick);
UIcontainer.addChild(pauseButton);
UIcontainer.addChild(speedButton);
constructionManager.initialize();
UIcontainer.addChild(constructionManager);
researchManager.initialize();
UIcontainer.addChild(researchManager);
UIcontainer.addChild(header);
UIcontainer.addChild(compasses);
UIcontainer.addChild(tutorials);
UIcontainer.addChild(DEBUG_INFO);

BackgroundTile.initialize(app.renderer);

const worldLayer = new Container();
worldLayer.position.set(getGameScreenCenter().x, getGameScreenCenter().y);

export const backgroundManager = new BackgroundManager();
worldLayer.addChild(backgroundManager);

createTestSituation(worldLayer);
aircraft.initializeAircraft(worldLayer);

app.stage.addChild(worldLayer);
app.stage.addChild(UIcontainer);

app.stage.on("pointerdown", (event) => {
  const buildingType = constructionManager.getBuildingType();

  if (buildingType !== "Road") {
    if (buildingType !== undefined) {
      const local = aircraft.toLocal(event.global);
      aircraft.addBlueprint(local.x, local.y, buildingType);
      constructionManager.setBuildingType(undefined);
    }

    aircraft.resetConstructionSource();
    aircraft.deSelectAllBuildings();
    aircraft.hideCraftSigns();

    constructionManager.hideButton();
    constructionManager.hideMenu();
    constructionManager.updateDisplayBuildingType();

    researchManager.hideMenu();

    joystick.hide();
  }
});

let previousFrameTime = performance.now();

app.ticker.add((delta) => {
  if (!isTest || getIsGameReady()) {
    const now = performance.now();

    const frameTime = now - previousFrameTime;
    previousFrameTime = now;

    const deltaTime = isTest
      ? 1 * speedButton.getSpeedModifier()
      : delta.deltaTime * speedButton.getSpeedModifier();

    updateAlways();

    if (import.meta.env.VITE_IS_DEBUG === "true") {
      DEBUG_INFO.position.set(100, 100);

      DEBUG_INFO.text = `${frameTime.toFixed(1)} ms, \nFPS: ${delta.FPS.toFixed(1)}, \ndeltaMC: ${delta.deltaMS.toFixed(1)}`;
    }

    if (!pauseButton.isPaused()) {
      updateGame(deltaTime);
    }
  }
});

function updateAlways() {
  backgroundManager.createNextChunk();
}

function updateGame(deltaTime: number) {
  const angle = moveWorld(
    deltaTime,
    worldLayer,
    joystick.inputX,
    joystick.inputY,
  );

  const shipPosition = getWorldCoordinates();
  backgroundManager.update(shipPosition.x, shipPosition.y);
  onGroundObjects.checkCollision();

  aircraft.workers.moveWorkers(deltaTime);

  aircraft.buildingAnimations(deltaTime, angle);

  aircraft.movingBlueprints(deltaTime);

  if (isCurrentTargetReached()) {
    checkFirstTargetReached();

    onGroundObjects.deleteOldAndCreateNewTarget();
  }

  compasses.updateCompasses();

  tutorials.updateTutorials();

  researchManager.updateResearchProgress(deltaTime);
}

export function getWorldCoordinates() {
  return { x: aircraft.x, y: aircraft.y };
}

export function getWorldRotation() {
  return -aircraft.rotation;
}

export function getGlobalWorldCoordinates(x: number, y: number) {
  const global = worldLayer.toGlobal({
    x: x,
    y: y,
  });

  return { x: global.x, y: global.y };
}
