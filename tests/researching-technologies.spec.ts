import { test, expect } from "@playwright/test";
import {
  testSettings,
  clickCanvas,
  initGame,
  skipFrames,
} from "./test-infra/test-infra";
import { getGameScreenCenter } from "@utils/ui-config";

const testName = "researching-technologies";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 15);

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y + 100,
  );

  await skipFrames(page, 2);

  await clickCanvas(page, 480, 995);

  await skipFrames(page, 2);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
