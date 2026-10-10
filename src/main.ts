import { Application, Container, Text } from "pixi.js";
import { aircraft } from "@aircraft/aircraft";
import { moveWorld } from "./moving/moving";
import { joystick } from "@joystick/joystick";
import { setTestRandom } from "@utils/initializers";
import { createTestSituation } from "@test-situations/test-situation";
import { pauseButton } from "@pause/button";
import { speedButton } from "@speed/button";
import { constructionManager } from "@construction/manager";
import { gameScreen, getIsGameReady, setIsGameReady } from "@utils/game-config";
import { compasses } from "./ui/compass/manager";
import { tutorials } from "./ui/tutorial/manager";
import { header } from "./ui/header/manager";
import { BackgroundManager } from "./backround/manager";
import { researchManager } from "./ui/research/manager";
import { onGroundObjects } from "./on-ground/objects";
import {
  isCurrentTargetReached,
  checkFirstTargetReached,
} from "@utils/tutorial-conditions";
import { BackgroundTile } from "./backround/tile";

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

const UIcontainer = new Container(); // Temp

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

const worldLayer = new Container(); // Temp

BackgroundTile.initialize(app.renderer);

export const backgroundManager = new BackgroundManager();

worldLayer.addChild(backgroundManager);

createTestSituation(worldLayer);

app.stage.addChild(worldLayer); // Temp

aircraft.initilaizeAircraft(app.stage);

app.stage.addChild(UIcontainer); // Temp

app.stage.on("pointerdown", (event) => {
  const buildingType = constructionManager.getBuildingType();

  if (buildingType !== "Road") {
    if (buildingType !== undefined) {
      const { x, y } = event.global;

      aircraft.addBlueprint(x, y, buildingType);
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

  header.updateHeader();
}

function updateGame(deltaTime: number) {
  const angle = moveWorld(
    deltaTime,
    worldLayer,
    aircraft.airCraftLayer,
    aircraft.workersLayer,
    joystick.inputX,
    joystick.inputY,
  );

  aircraft.workers.moveWorkers(deltaTime);

  aircraft.buildingAnimations(deltaTime, angle);

  aircraft.movingBlueprints(deltaTime);

  if (isCurrentTargetReached()) {
    checkFirstTargetReached();

    onGroundObjects.deleteAndCreateNewTarget();
  }

  compasses.updateCompasses();

  tutorials.updateTutorials();

  researchManager.updateReserachProgress(deltaTime);
}

export function getWorldCoordinates() {
  return { x: worldLayer.pivot.x, y: worldLayer.pivot.y }; // Temp
}

export function getWorldRotation() {
  return worldLayer.rotation;
}

export function getGlobalWorldCoordinates(x: number, y: number) {
  const global = worldLayer.toGlobal({
    x: x,
    y: y,
  });

  return { x: global.x, y: global.y }; // Temp
}
