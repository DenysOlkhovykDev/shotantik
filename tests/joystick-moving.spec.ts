import { test, expect } from "@playwright/test";
import {
  testSettings,
  clickCanvas,
  initGame,
  setGameReady,
  skipFrames,
} from "./test-infra/test-infra";
import { getGameScreenCenter } from "../src/ui/ui-config";

const testName = "joystick-moving";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await setGameReady(page);

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y + 200,
  );

  await skipFrames(page, 2);

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
