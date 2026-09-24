import { Application, Container } from "pixi.js";
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

UIcontainer.addChild(joystick);
UIcontainer.addChild(pauseButton);
UIcontainer.addChild(speedButton);
constructionManager.initialize();
UIcontainer.addChild(constructionManager);
UIcontainer.addChild(header);
UIcontainer.addChild(compasses);
UIcontainer.addChild(tutorials);

const worldLayer = new Container(); // Temp
export const backgroundManager = new BackgroundManager();
if (import.meta.env.MODE !== "test") {
  worldLayer.addChild(backgroundManager);
}

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

    constructionManager.hideButton();
    constructionManager.hideMenu();
    constructionManager.updateDisplayBuildingType();

    aircraft.hideCraftSigns();
    joystick.hide();
  }
});

app.ticker.add((delta) => {
  if (!pauseButton.isPaused() && (!isTest || getIsGameReady())) {
    const deltaTime = isTest
      ? 1 * speedButton.getSpeedModifier()
      : delta.deltaTime * speedButton.getSpeedModifier();

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

    header.updateHeader();

    compasses.updateCompasses();

    tutorials.updateTutorials();
  }
});

export function getWorldCoordinates() {
  return { x: worldLayer.pivot.x, y: worldLayer.pivot.y }; // Temp
}

export function getGlobalWorldCoordinates(x: number, y: number) {
  const global = worldLayer.toGlobal({
    x: x,
    y: y,
  });

  return { x: global.x, y: global.y }; // Temp
}
