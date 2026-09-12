import { test, expect } from "@playwright/test";
import { testSettings, skipFrames, clickCanvas, initGame } from "./test-infra";
import { getPauseButtonPosition } from "../src/ui/ui-config";

const testName = "interface-pause";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 0);

  await clickCanvas(
    page,
    getPauseButtonPosition().x,
    getPauseButtonPosition().y,
  );

  await skipFrames(page, 5);

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
