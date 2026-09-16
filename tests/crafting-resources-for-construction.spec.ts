import { test, expect } from "@playwright/test";

import { testSettings, skipFrames, initGame } from "./test-infra/test-infra";

const testName = "crafting-resources-for-construction";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 35);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
