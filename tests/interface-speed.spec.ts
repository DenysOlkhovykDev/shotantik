import { test, expect } from "@playwright/test";
import {
  testSettings,
  skipFrames,
  clickCanvas,
  initGame,
} from "./test-infra/test-infra";
import { getSpeedButtonPosition } from "@utils/ui-config";

const testName = "interface-speed";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await clickCanvas(
    page,
    getSpeedButtonPosition().x,
    getSpeedButtonPosition().y,
  );

  await skipFrames(page, 160);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
