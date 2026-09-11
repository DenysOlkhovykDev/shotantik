import { test, expect } from "@playwright/test";

import { testSettings, skipFrames, initGame } from "./test-infra";

const testName = "reuse-resources";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 45);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
