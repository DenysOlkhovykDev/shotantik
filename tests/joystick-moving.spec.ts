import { test, expect } from "@playwright/test";
import { testSettings, clickCanvas, initGame } from "./test-infra";
import { getGameScreenCenter } from "../src/ui/ui-config";

const testName = "joystick-moving";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await clickCanvas(
    page,
    getGameScreenCenter().x,
    getGameScreenCenter().y + 200,
  );

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
