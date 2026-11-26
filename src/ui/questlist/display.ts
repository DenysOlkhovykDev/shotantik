import {
  Container,
  Graphics,
  Text,
  TextStyle,
  CanvasTextMetrics,
} from "pixi.js";

import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";

import { buildingThemes } from "@utils/building-themes";
import { resourceThemes } from "@utils/resource-themes";
import { createResource } from "@resources/create-resources";

export interface Quest {
  text: string;
  showCondition: () => boolean;
  hideCondition: () => boolean;
  isActive: boolean;
  building?: string;
  resource?: string;
}

export class QuestListDisplay extends Container {
  private static params = {
    rowHeight: 60,
    gap: 10,
    borderRadius: 26,

    backgroundColor: "#cfcbc8",

    buildingLabelX: 10,
    buildingLabelY: 15,
  };

  private displayBackground = new Graphics();
  private displayItemsContainers: Container[] = [];

  private rows = 0;
  private columns = 1;

  private columnWidth = 0;

  private displayWidth = 0;
  private displayHeight = 0;

  private textStyle = new TextStyle({
    fontSize: 25,
    fill: "#000000",
  });

  private headerTextStyle = new TextStyle({
    fontSize: 28,
    fill: "#000000",
  });

  public createDisplay(x: number, y: number, quests: Map<string, Quest>) {
    this.rows = Math.ceil(quests.size / this.columns);

    let maxWidth = 170;

    quests.forEach((item) => {
      const width =
        CanvasTextMetrics.measureText(item.text, this.textStyle).width +
        QuestListDisplay.params.buildingLabelX * 2 +
        (item.building !== undefined || item.resource !== undefined
          ? QuestListDisplay.params.rowHeight
          : 0);

      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    this.columnWidth = maxWidth;

    this.displayWidth =
      this.columns * this.columnWidth +
      (this.columns - 1) * QuestListDisplay.params.gap +
      2 * QuestListDisplay.params.gap;

    this.displayHeight =
      this.rows * QuestListDisplay.params.rowHeight +
      (this.rows - 1) * QuestListDisplay.params.gap +
      2 * QuestListDisplay.params.gap;

    this.draw(quests);

    this.x = x;
    this.y = y - this.displayHeight;
  }

  private draw(quests: Map<string, Quest>) {
    this.removeChild();

    this.makeDisplayBackground();

    this.makeDisplayItems(quests);
  }

  private makeDisplayBackground() {
    this.displayBackground.clear();

    this.displayBackground
      .roundRect(
        -QuestListDisplay.params.gap,
        -QuestListDisplay.params.gap - QuestListDisplay.params.rowHeight + 10,
        this.displayWidth,
        this.displayHeight + QuestListDisplay.params.rowHeight - 10,
        QuestListDisplay.params.borderRadius,
      )
      .fill(QuestListDisplay.params.backgroundColor);

    this.addChild(this.displayBackground);

    const text = new Text({
      text: "Quests",
      style: this.headerTextStyle,
    });

    text.x = this.columnWidth / 2 - text.width / 2;
    text.y = -QuestListDisplay.params.rowHeight / 2 - text.height / 2;

    text.eventMode = "none";
    this.addChild(text);
  }

  private makeDisplayItems(quests: Map<string, Quest>) {
    let index = 0;

    this.removeChild(...this.displayItemsContainers);

    this.displayItemsContainers = [];

    quests.forEach((item) => {
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);

      const x = column * (this.columnWidth + QuestListDisplay.params.gap);
      const y =
        row * (QuestListDisplay.params.rowHeight + QuestListDisplay.params.gap);

      this.displayItemsContainers[index] = new Container();

      this.displayItemsContainers[index].position.set(x, y);

      this.createDisplayItem(item, this.displayItemsContainers[index]);

      this.addChild(this.displayItemsContainers[index]);

      index++;
    });
  }

  private createDisplayItem(item: Quest, container: Container) {
    this.createDisplayItemBackground(container);

    this.createDisplayItemText(item.text, container);

    if (item.building !== undefined) {
      this.createBuildingImage(item.building, container);
    } else if (item.resource !== undefined) {
      this.createResourceImage(item.resource, container);
    }
  }

  private createDisplayItemBackground(container: Container) {
    const background = new Graphics()
      .roundRect(
        0,
        0,
        this.columnWidth,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.borderRadius - QuestListDisplay.params.gap,
      )
      .fill("#aeadab");

    container.addChild(background);
  }

  private createDisplayItemText(label: string, container: Container) {
    const text = new Text({
      text: label,
      style: this.textStyle,
    });

    text.x = QuestListDisplay.params.buildingLabelX;
    text.y = QuestListDisplay.params.rowHeight / 2 - text.height / 2;

    text.eventMode = "none";
    container.addChild(text);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const background = new Graphics()
      .roundRect(
        this.columnWidth - QuestListDisplay.params.rowHeight,
        0,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.borderRadius - QuestListDisplay.params.gap,
      )
      .fill(buildingThemes.find((item) => item.label === buildingName)?.color);

    container.addChild(background);

    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      this.columnWidth - QuestListDisplay.params.rowHeight / 2,
      QuestListDisplay.params.rowHeight / 2,
      true,
    );

    building.scale = 0.5;
    building.eventMode = "none";
    building.contentContainer.filters = [];

    container.addChild(building);
  }

  private createResourceImage(resourceName: string, container: Container) {
    const background = new Graphics()
      .roundRect(
        this.columnWidth - QuestListDisplay.params.rowHeight,
        0,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.borderRadius - QuestListDisplay.params.gap,
      )
      .fill(resourceThemes.find((item) => item.label === resourceName)?.color);

    container.addChild(background);

    const resource = createResource(resourceName);

    resource.scale = 1.5;
    resource.position.set(
      this.columnWidth - QuestListDisplay.params.rowHeight / 2,
      QuestListDisplay.params.rowHeight / 2,
    );
    resource.eventMode = "none";

    container.addChild(resource);
  }

  public show() {
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  public isVisible() {
    return this.visible;
  }
}
