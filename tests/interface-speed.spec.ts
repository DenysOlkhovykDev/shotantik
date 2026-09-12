import { test, expect } from "@playwright/test";
import { testSettings, skipFrames, clickCanvas, initGame } from "./test-infra";
import { getSpeedButtonPosition } from "../src/ui/ui-config";

const testName = "interface-speed";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await clickCanvas(
    page,
    getSpeedButtonPosition().x,
    getSpeedButtonPosition().y,
  );

  await skipFrames(page, 150);

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
