import { test, expect } from "@playwright/test";

import { testSettings, skipFrames, initGame } from "./test-infra/test-infra";

const testName = "construction-roads";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 12);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
