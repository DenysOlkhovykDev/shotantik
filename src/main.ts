import { Application, Container, FederatedPointerEvent, Text } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";

import { onGroundObjects } from "@objects/research-points";
import { createTestSituation } from "@test-situations/test-situation";
import { moveWorld } from "@moving/moving";
import { ChunkManager } from "@chunks/manager";

import { joystick } from "@joystick/joystick";
import { pauseButton } from "@pause/button";
import { speedButton } from "@speed/button";
import { constructionManager } from "@construction/manager";
import { compasses } from "@compass/manager";
import { tutorials } from "@tutorial/manager";
import { header } from "@header/manager";
import { researchManager } from "@research/manager";
import { cameraSettings } from "@camera/manager";

import { getGameScreenCenter } from "@utils/ui-config";
import { gameScreen, getIsGameReady, setIsGameReady } from "@utils/game-config";
import {
  isCurrentTargetReached,
  checkFirstTargetReached,
} from "@utils/tutorial-conditions";
import { setTestRandom } from "@utils/initializers";
import { logo } from "@utils/logo";
import { rotatePointByCenter } from "@utils/basic-geometry";
import { questList } from "@questlist/manager";

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

const rect = app.canvas.getBoundingClientRect();
const scaleX = app.screen.width / rect.width;
const scaleY = app.screen.height / rect.height;

UIcontainer.addChild(joystick);
UIcontainer.addChild(pauseButton);
UIcontainer.addChild(speedButton);
cameraSettings.setSensitivity(scaleX);
UIcontainer.addChild(cameraSettings);
questList.initialize();
UIcontainer.addChild(questList);
constructionManager.initialize();
UIcontainer.addChild(constructionManager);
researchManager.initialize();
UIcontainer.addChild(researchManager);
UIcontainer.addChild(header);
UIcontainer.addChild(compasses);
UIcontainer.addChild(tutorials);
UIcontainer.addChild(DEBUG_INFO);

const worldLayer = new Container();
worldLayer.position.set(getGameScreenCenter().x, getGameScreenCenter().y);

export const chunkManager = new ChunkManager();
worldLayer.addChild(chunkManager);

createTestSituation(worldLayer);
aircraft.initializeAircraft(worldLayer);

app.stage.addChild(worldLayer);
app.stage.addChild(UIcontainer);

if (import.meta.env.VITE_IS_DEBUG_LOGO === "true") {
  app.stage.addChild(logo);
}

app.stage.on(
  "wheel",
  (event) => {
    event.preventDefault();

    cameraSettings.changeZoomByScrolling(-event.deltaY);
  },
  { passive: false },
);

app.stage.on("pointerdown", (event) => {
  cameraSettings.onPointerDown(event);

  clickToBuild(event);
});

app.stage.on("pointermove", (event) => {
  if (event.pointerType === "touch") {
    cameraSettings.continueChangingZoomByTouch(
      event.pointerId,
      event.clientX,
      event.clientY,
    );
  }

  cameraSettings.continuePanning(event.pointerId, event.clientX, event.clientY);
});

app.stage.on("pointerup", (event) => {
  cameraSettings.stopChangingZoomByTouch(event.pointerId);
  cameraSettings.stopPanning(event.pointerId);
});

app.stage.on("pointerupoutside", (event) => {
  cameraSettings.stopChangingZoomByTouch(event.pointerId);
  cameraSettings.stopPanning(event.pointerId);
});

function clickToBuild(event: FederatedPointerEvent) {
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
    constructionManager.updateDisplay();

    questList.hideDisplay();

    researchManager.hideMenu();

    joystick.hide();
  }
}

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

    if (import.meta.env.VITE_IS_DEBUG_UI_UX === "true") {
      DEBUG_INFO.position.set(100, 100);

      DEBUG_INFO.text = `${frameTime.toFixed(1)} ms, 
FPS: ${delta.FPS.toFixed(1)}, 
deltaMC: ${delta.deltaMS.toFixed(1)}, 
pointers: ${cameraSettings.getPointersAmount()}
offsetX: ${cameraSettings.offsetX}
offsetY: ${cameraSettings.offsetY}
CSS canvas: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}
Pixi screen: ${app.screen.width}x${app.screen.height}
CSS→Pixi: ${scaleX.toFixed(2)}x${scaleY.toFixed(2)}
Viewport: ${innerWidth}x${innerHeight}, DPR: ${devicePixelRatio}`;
    }

    if (!pauseButton.isPaused()) {
      updateGame(deltaTime);
    }
  }
});

function updateAlways() {
  chunkManager.createNextChunk();
}

function updateGame(deltaTime: number) {
  const angle = moveWorld(
    deltaTime,
    worldLayer,
    joystick.inputX,
    joystick.inputY,
    cameraSettings.offsetX,
    cameraSettings.offsetY,
    cameraSettings.getZoom(),
  );

  const shipPosition = getWorldCoordinates();

  const { x: cameraX, y: cameraY } = rotatePointByCenter(
    cameraSettings.offsetX,
    cameraSettings.offsetY,
    0,
    0,
    aircraft.rotation,
  );

  chunkManager.update(shipPosition.x + cameraX, shipPosition.y + cameraY);
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

  questList.updateQuests();

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
