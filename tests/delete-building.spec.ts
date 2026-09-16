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
} from "../src/ui/ui-config";

const testName = "delete-building";

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

  let screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
