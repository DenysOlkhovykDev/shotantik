import { test, expect } from "@playwright/test";
import {
  testSettings,
  clickCanvas,
  initGame,
  setGameReady,
} from "./test-infra/test-infra";
import {
  getGameScreenCenter,
  getHeaderDeleteButtonPosition,
} from "@utils/ui-config";

const testName = "delete-blueprint";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await setGameReady(page);

  await clickCanvas(
    page,
    getGameScreenCenter().x + 200,
    getGameScreenCenter().y,
  );

  await clickCanvas(
    page,
    getHeaderDeleteButtonPosition().x,
    getHeaderDeleteButtonPosition().y,
  );

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
