import { test, expect } from "@playwright/test";
import {
  testSettings,
  clickCanvas,
  initGame,
  setGameReady,
  skipFrames,
  swipeCanvas,
} from "./test-infra/test-infra";
import { getGameScreenCenter, getJoyStickPosition } from "@utils/ui-config";

const testName = "engine-gases";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await setGameReady(page);

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y + 100,
  );

  await skipFrames(page, 2);

  await swipeCanvas(
    page,
    getJoyStickPosition().x,
    getJoyStickPosition().y,
    getJoyStickPosition().x,
    getJoyStickPosition().y - 10,
  );

  await skipFrames(page, 38);

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
