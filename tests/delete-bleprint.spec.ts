import { test, expect } from "@playwright/test";
import { testSettings, clickCanvas, initGame } from "./test-infra";
import {
  getGameScreenCenter,
  getHeaderDeleteButtonPosition,
} from "../src/ui/ui-config";

const testName = "delete-blueprint";

test(testName, async ({ page }) => {
  await initGame(page, testName);

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
