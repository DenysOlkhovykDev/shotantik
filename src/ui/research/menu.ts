import { Container, Graphics, Text } from "pixi.js";

import { getConstructionMenuPosition } from "@utils/ui-config";
import { Road } from "@roads/road";
import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";

import { Navigator } from "@workers/worker-parts/navigator";

export interface MenuItem {
  label: string;
  color: string;
  level: number;
}

export const menuItems: MenuItem[] = [
  {
    label: "Collector",
    color: "#a8d0db",
    level: 1,
  },
  {
    label: "Farm",
    color: "#bad895",
    level: 1,
  },
  {
    label: "Extractor",
    color: "#dba8a8",
    level: 1,
  },
  {
    label: "Assembler",
    color: "#d6de90",
    level: 1,
  },
  {
    label: "Mixer",
    color: "#caa5c3",
    level: 1,
  },
  {
    label: "Grinder",
    color: "#b7ded3",
    level: 1,
  },
  {
    label: "Engine",
    color: "#a8b1db",
    level: 1,
  },
  {
    label: "Road",
    color: "#dbcaa8",
    level: 1,
  },
];

export class ResearchMenu extends Container {
  private menuBackground = new Graphics();
  private researchingProgreesBar = new Graphics();
  private menuItemsContainers: Container[] = [];

  private levelTextElements: Text[] = [];
  private upgradesInfoDisplay = new Text();

  private rows = menuItems.length + 2;

  private columnWidth = 300;
  private rowHeight = 60;
  private gap = 10;
  private borderRadius = 26;

  private centerBottom = {
    x: getConstructionMenuPosition().x,
    y: getConstructionMenuPosition().y,
  };

  private menuWidth = this.columnWidth + 2 * this.gap;
  private menuHeight =
    this.rows * this.rowHeight + (this.rows - 1) * this.gap + 2 * this.gap;

  constructor(private useOneUpgradePoint: () => boolean) {
    super();

    this.draw();

    this.eventMode = "static";

    this.x = this.centerBottom.x - this.menuWidth / 2 + this.gap;
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
        -this.gap,
        -this.gap,
        this.menuWidth,
        this.menuHeight,
        this.borderRadius,
      )
      .fill("#cfcbc8");

    this.menuBackground.eventMode = "static";
    this.menuBackground.on("pointerdown", (e) => {
      e.stopPropagation();
    });

    this.addChild(this.menuBackground);
  }

  private makeMenuItems() {
    menuItems.forEach((item, index) => {
      const row = index;

      const x = 0;
      const y = row * (this.rowHeight + this.gap);

      this.menuItemsContainers[index] = new Container();

      this.menuItemsContainers[index].position.set(x, y);

      this.createMenuItem(item, this.menuItemsContainers[index]);

      this.addChild(this.menuItemsContainers[index]);
    });
  }

  private createMenuItem(item: MenuItem, container: Container) {
    this.createInfoBlock(item, container);

    this.createUpgradeButton(container, item);
  }

  private createInfoBlock(item: MenuItem, container: Container) {
    this.createInfoBackground(item.color, container);

    if (item.label === "Road") {
      this.createRoadImage(container);
    } else {
      this.createBuildingImage(item.label, container);
    }

    this.createInfoText(item.label, item.level, container);
  }

  private createInfoBackground(backgroundColor: string, container: Container) {
    const labelPartWidth = (this.columnWidth / 3) * 2;
    const levelPartX = labelPartWidth - this.borderRadius - this.gap;
    const levelPartWidth = this.columnWidth / 5;
    const buildingImagePartWidth = this.columnWidth / 5;

    const background = new Graphics()
      .roundRect(
        0,
        0,
        labelPartWidth,
        this.rowHeight,
        this.borderRadius - this.gap,
      )
      .fill("#b2afad");

    background
      .roundRect(
        levelPartX,
        0,
        levelPartWidth + this.borderRadius - this.gap,
        this.rowHeight,
        this.borderRadius - this.gap,
      )
      .fill("#ece7e3");

    background
      .rect(levelPartX, 0, levelPartWidth, this.rowHeight)
      .fill("#ece7e3");

    background
      .roundRect(
        0,
        0,
        buildingImagePartWidth,
        this.rowHeight,
        this.borderRadius - this.gap,
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
    const labelX = this.columnWidth / 5 + textGap;
    const levelX =
      (this.columnWidth / 3) * 2 - this.borderRadius - this.gap + textGap;
    const textY = (this.rowHeight / 10) * 3;

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
    const root = Road.crateRoadImage(this.rowHeight, this.rowHeight);

    root.scale = 0.5;
    root.eventMode = "none";

    container.addChild(root);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      this.rowHeight / 2,
      this.rowHeight / 2,
      true,
    );

    building.root.scale = 0.5;
    building.root.eventMode = "none";
    building.contentContainer.filters = [];

    container.addChild(building.root);
  }

  private createUpgradeButton(container: Container, item: MenuItem) {
    const buttonX = (this.columnWidth / 5) * 4;
    const buttonWidth = this.columnWidth / 5;

    const button = new Graphics()
      .roundRect(
        buttonX,
        0,
        buttonWidth,
        this.rowHeight,
        this.borderRadius - this.gap,
      )
      .fill("#b0e9af");

    const centerX = buttonX + buttonWidth / 2;
    const centerY = 0 + this.rowHeight / 2;

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
        menuItems.length * (this.rowHeight + this.gap),
        this.columnWidth,
        this.rowHeight,
        this.borderRadius - this.gap,
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
      menuItems.length * (this.rowHeight + this.gap) + this.rowHeight / 8;

    this.upgradesInfoDisplay.eventMode = "none";

    this.addChild(this.upgradesInfoDisplay);
  }

  private createProgreesBar() {
    this.menuBackground
      .roundRect(
        0,
        (menuItems.length + 1) * (this.rowHeight + this.gap),
        this.columnWidth,
        this.rowHeight,
        this.borderRadius - this.gap,
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
      this.levelTextElements[i].text = "Lvl: " + menuItems[i].level;
    }

    this.researchingProgreesBar.clear();

    const padding = 8;

    const progressBarWidth = (this.columnWidth / goal) * currentProgress;

    this.researchingProgreesBar
      .roundRect(
        0 + padding,
        (menuItems.length + 1) * (this.rowHeight + this.gap) + padding,
        progressBarWidth - padding * 2,
        this.rowHeight - padding * 2,
        this.borderRadius - this.gap - padding,
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
