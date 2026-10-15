import { Container, Graphics, Text } from "pixi.js";

import { getConstructionMenuPosition } from "@utils/ui-config";
import { Road } from "@roads/road";
import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";

import { Navigator } from "@workers/worker-parts/navigator";
import { menuItems, type MenuItem } from "@utils/menu-items";

interface ResearchMenuItem extends MenuItem {
  level: number;
}

export class ResearchMenu extends Container {
  public menuItems: ResearchMenuItem[] = menuItems
    .filter((item) =>
      [
        "Collector",
        "Farm",
        "Extractor",
        "Assembler",
        "Mixer",
        "Grinder",
        "Engine",
        "Road",
      ].includes(item.label),
    )
    .map((item) => ({
      ...item,
      level: 1,
    }));

  private menuBackground = new Graphics();
  private researchingProgreesBar = new Graphics();
  private menuItemsContainers: Container[] = [];

  private levelTextElements: Text[] = [];
  private upgradesInfoDisplay = new Text();

  private rows = this.menuItems.length + 2;

  private static params = {
    columnWidth: 300,
    rowHeight: 60,
    gap: 10,
    borderRadius: 26,

    backgroundColor: "#cfcbc8",
  };

  private centerBottom = {
    x: getConstructionMenuPosition().x,
    y: getConstructionMenuPosition().y,
  };

  private menuWidth =
    ResearchMenu.params.columnWidth + 2 * ResearchMenu.params.gap;
  private menuHeight =
    this.rows * ResearchMenu.params.rowHeight +
    (this.rows - 1) * ResearchMenu.params.gap +
    2 * ResearchMenu.params.gap;

  constructor(private useOneUpgradePoint: () => boolean) {
    super();

    this.draw();

    this.eventMode = "static";

    this.x = this.centerBottom.x - this.menuWidth / 2 + ResearchMenu.params.gap;
    this.y = this.centerBottom.y - this.menuHeight;
  }

  private draw() {
    this.makeMenuBackground();

    this.makeMenuItems();

    this.createUpgradesInfoDisplay();

    this.createProgreesBar();
  }

  private makeMenuBackground() {
    this.menuBackground
      .roundRect(
        -ResearchMenu.params.gap,
        -ResearchMenu.params.gap,
        this.menuWidth,
        this.menuHeight,
        ResearchMenu.params.borderRadius,
      )
      .fill("#cfcbc8");

    this.menuBackground.eventMode = "static";
    this.menuBackground.on("pointerdown", (e) => {
      e.stopPropagation();
    });

    this.addChild(this.menuBackground);
  }

  private makeMenuItems() {
    this.menuItems.forEach((item, index) => {
      const row = index;

      const x = 0;
      const y = row * (ResearchMenu.params.rowHeight + ResearchMenu.params.gap);

      this.menuItemsContainers[index] = new Container();

      this.menuItemsContainers[index].position.set(x, y);

      this.createMenuItem(item, this.menuItemsContainers[index]);

      this.addChild(this.menuItemsContainers[index]);
    });
  }

  private createMenuItem(item: ResearchMenuItem, container: Container) {
    this.createInfoBlock(item, container);

    this.createUpgradeButton(container, item);
  }

  private createInfoBlock(item: ResearchMenuItem, container: Container) {
    this.createInfoBackground(item.color, container);

    if (item.label === "Road") {
      this.createRoadImage(container);
    } else {
      this.createBuildingImage(item.label, container);
    }

    this.createInfoText(item.label, item.level, container);
  }

  private createInfoBackground(backgroundColor: string, container: Container) {
    const labelPartWidth = (ResearchMenu.params.columnWidth / 3) * 2;
    const levelPartX =
      labelPartWidth -
      ResearchMenu.params.borderRadius -
      ResearchMenu.params.gap;
    const levelPartWidth = ResearchMenu.params.columnWidth / 5;
    const buildingImagePartWidth = ResearchMenu.params.columnWidth / 5;

    const background = new Graphics()
      .roundRect(
        0,
        0,
        labelPartWidth,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill("#b2afad");

    background
      .roundRect(
        levelPartX,
        0,
        levelPartWidth +
          ResearchMenu.params.borderRadius -
          ResearchMenu.params.gap,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill("#ece7e3");

    background
      .rect(levelPartX, 0, levelPartWidth, ResearchMenu.params.rowHeight)
      .fill("#ece7e3");

    background
      .roundRect(
        0,
        0,
        buildingImagePartWidth,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill(backgroundColor);

    background.eventMode = "none";
    container.addChild(background);
  }

  private createInfoText(label: string, level: number, container: Container) {
    const textStyle = {
      fill: "#000000",
      fontSize: 20,
    };

    const textGap = 5;
    const labelX = ResearchMenu.params.columnWidth / 5 + textGap;
    const levelX =
      (ResearchMenu.params.columnWidth / 3) * 2 -
      ResearchMenu.params.borderRadius -
      ResearchMenu.params.gap +
      textGap;
    const textY = (ResearchMenu.params.rowHeight / 10) * 3;

    const labelText = new Text({
      text: label,
      style: textStyle,
    });

    labelText.x = labelX;
    labelText.y = textY;

    labelText.eventMode = "none";
    container.addChild(labelText);

    const levelText = new Text({
      text: "Lvl: " + level,
      style: textStyle,
    });

    levelText.x = levelX;
    levelText.y = textY;

    levelText.eventMode = "none";

    this.levelTextElements.push(levelText);
    container.addChild(levelText);
  }

  private createRoadImage(container: Container) {
    const road = Road.crateRoadImage(
      ResearchMenu.params.rowHeight,
      ResearchMenu.params.rowHeight,
    );

    road.scale = 0.5;
    road.eventMode = "none";

    container.addChild(road);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      ResearchMenu.params.rowHeight / 2,
      ResearchMenu.params.rowHeight / 2,
      true,
    );

    building.scale = 0.5;
    building.eventMode = "none";
    building.contentContainer.filters = [];

    container.addChild(building);
  }

  private createUpgradeButton(container: Container, item: ResearchMenuItem) {
    const buttonX = (ResearchMenu.params.columnWidth / 5) * 4;
    const buttonWidth = ResearchMenu.params.columnWidth / 5;

    const button = new Graphics()
      .roundRect(
        buttonX,
        0,
        buttonWidth,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill("#b0e9af");

    const centerX = buttonX + buttonWidth / 2;
    const centerY = ResearchMenu.params.rowHeight / 2;

    button
      .moveTo(centerX - 10, centerY + 15)
      .lineTo(centerX - 10, centerY - 5)
      .lineTo(centerX - 15, centerY - 5)
      .lineTo(centerX, centerY - 20)
      .lineTo(centerX + 15, centerY - 5)
      .lineTo(centerX + 10, centerY - 5)
      .lineTo(centerX + 10, centerY + 15)
      .closePath()
      .fill("#558754")
      .stroke({ width: 4, color: "#2f4c2e" });

    button.eventMode = "static";

    button.on("pointerdown", (e) => {
      e.stopPropagation();

      if (this.useOneUpgradePoint()) {
        item.level++;

        if (item.label === "Road") {
          const baseSpeed = 2;
          const maxSpeed = 5;

          Navigator.speed =
            maxSpeed - (maxSpeed - baseSpeed) / (1 + (item.level - 1) * 0.1);
        } else if (item.label === "Engine") {
          const EngineClass = buildingMap["Engine"];

          if (EngineClass && "speedModifier" in EngineClass) {
            const baseSpeed = 1;
            const maxSpeed = 5;

            EngineClass.speedModifier =
              maxSpeed - (maxSpeed - baseSpeed) / (1 + (item.level - 1) * 0.1);
          }
        } else {
          const BuildingClass = buildingMap[item.label] || Platform;

          if (BuildingClass.craftRecipe) {
            const defaultDuration = 60;

            BuildingClass.craftRecipe.duration =
              defaultDuration / (1 + (item.level - 1) * 0.25);
          }
        }
      }
    });

    container.addChild(button);
  }

  private createUpgradesInfoDisplay() {
    this.menuBackground
      .roundRect(
        0,
        this.menuItems.length *
          (ResearchMenu.params.rowHeight + ResearchMenu.params.gap),
        ResearchMenu.params.columnWidth,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill("#ece7e3");

    this.upgradesInfoDisplay = new Text({
      text: "a",
      style: {
        fill: "#000000",
        fontSize: 20,
      },
    });

    this.upgradesInfoDisplay.x = 8;
    this.upgradesInfoDisplay.y =
      this.menuItems.length *
        (ResearchMenu.params.rowHeight + ResearchMenu.params.gap) +
      ResearchMenu.params.rowHeight / 8;

    this.upgradesInfoDisplay.eventMode = "none";

    this.addChild(this.upgradesInfoDisplay);
  }

  private createProgreesBar() {
    this.menuBackground
      .roundRect(
        0,
        (this.menuItems.length + 1) *
          (ResearchMenu.params.rowHeight + ResearchMenu.params.gap),
        ResearchMenu.params.columnWidth,
        ResearchMenu.params.rowHeight,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap,
      )
      .fill("#b2afad");

    this.addChild(this.researchingProgreesBar);
  }

  private updateResearchingMenu(
    goal: number,
    currentProgress: number,
    usedPoints: number,
    unusedPoints: number,
  ) {
    for (let i = 0; i < this.levelTextElements.length; i++) {
      this.levelTextElements[i].text = "Lvl: " + this.menuItems[i].level;
    }

    this.researchingProgreesBar.clear();

    const padding = 8;

    const progressBarWidth =
      (ResearchMenu.params.columnWidth / goal) * currentProgress;

    this.researchingProgreesBar
      .roundRect(
        padding,
        (this.menuItems.length + 1) *
          (ResearchMenu.params.rowHeight + ResearchMenu.params.gap) +
          padding,
        progressBarWidth - padding * 2,
        ResearchMenu.params.rowHeight - padding * 2,
        ResearchMenu.params.borderRadius - ResearchMenu.params.gap - padding,
      )
      .fill("#35eb38")
      .stroke({
        width: 2,
        color: "#000000",
      });

    this.upgradesInfoDisplay.text =
      "Total upgrades: " +
      usedPoints +
      ".\nAvailable upgrades : " +
      unusedPoints;
  }

  show(
    goal: number,
    currentProgress: number,
    usedPoints: number,
    unusedPoints: number,
  ) {
    this.updateResearchingMenu(goal, currentProgress, usedPoints, unusedPoints);
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  isVisible() {
    return this.visible;
  }
}
