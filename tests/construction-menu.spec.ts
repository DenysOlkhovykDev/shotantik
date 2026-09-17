import { test, expect } from "@playwright/test";
import {
  testSettings,
  clickCanvas,
  initGame,
  setGameReady,
  skipFrames,
} from "./test-infra/test-infra";
import {
  getConstructionButtonPosition,
  getGameScreenCenter,
  getMixerPositionInConstructionMenuPosition,
} from "@utils/ui-config";

const testName = "construction-menu";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await setGameReady(page);

  await skipFrames(page, 0);

  await clickCanvas(page, getGameScreenCenter().x, getGameScreenCenter().y);

  await skipFrames(page, 2);

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-1-button" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getConstructionButtonPosition().x,
    getConstructionButtonPosition().y,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-2-menu" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getMixerPositionInConstructionMenuPosition().x,
    getMixerPositionInConstructionMenuPosition().y,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-3-select-mixer" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getGameScreenCenter().x + 200,
    getGameScreenCenter().y,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-4-place-mixer" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(page, getGameScreenCenter().x, getGameScreenCenter().y);

  await clickCanvas(
    page,
    getConstructionButtonPosition().x,
    getConstructionButtonPosition().y,
  );

  await clickCanvas(
    page,
    getMixerPositionInConstructionMenuPosition().x,
    getMixerPositionInConstructionMenuPosition().y,
  );

  await clickCanvas(
    page,
    getGameScreenCenter().x - 200,
    getGameScreenCenter().y,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-5-place-mixer-blueprint" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(page, getGameScreenCenter().x, getGameScreenCenter().y);

  await clickCanvas(
    page,
    getConstructionButtonPosition().x,
    getConstructionButtonPosition().y,
  );

  await clickCanvas(
    page,
    getMixerPositionInConstructionMenuPosition().x,
    getMixerPositionInConstructionMenuPosition().y,
  );

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y + 200,
  );

  await clickCanvas(
    page,
    getGameScreenCenter().x - 200,
    getGameScreenCenter().y + 200,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-6-change-construction-position" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(page, getGameScreenCenter().x, getGameScreenCenter().y);

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y - 100,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-7-hide-construction-button" + ".png",
    testSettings,
  );

  await skipFrames(page, 0);

  await clickCanvas(page, getGameScreenCenter().x, getGameScreenCenter().y);

  await clickCanvas(
    page,
    getConstructionButtonPosition().x,
    getConstructionButtonPosition().y,
  );

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y - 100,
  );

  await skipFrames(page, 2);

  screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    testName + "-8-hide-construction-menu" + ".png",
    testSettings,
  );
});
