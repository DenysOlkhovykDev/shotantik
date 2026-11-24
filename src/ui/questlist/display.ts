import { Container, Graphics, Text } from "pixi.js";

import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";

import { buildingThemes } from "@utils/building-themes";
import { resourceThemes } from "@utils/resource-themes";
import { createResource } from "@resources/create-resources";

interface Quest {
  name: string;
  text: string;
  building?: string;
  resource?: string;
}

export class QuestListDisplay extends Container {
  public quests: Quest[] = [
    { name: "build", text: "Build 1x ", building: "Collector" },
    { name: "craft", text: "Craft 5x ", resource: "Battery" },
    { name: "craft", text: "Craft 5x ", resource: "Gum" },
    { name: "craft", text: "Craft 5x ", resource: "Gear" },
    { name: "craft", text: "Craft 5x ", resource: "Metal" },
    { name: "craft", text: "Craft 5x ", resource: "Organic" },
    { name: "craft", text: "Craft 5x ", resource: "Truss" },
    { name: "craft", text: "Craft 5x ", resource: "Water" },
  ];

  private static params = {
    columnWidth: 170,
    rowHeight: 60,
    gap: 10,
    borderRadius: 26,

    backgroundColor: "#cfcbc8",

    buildingLabelX: 10,
    buildingLabelY: 15,
  };

  private displayBackground = new Graphics();
  private displayItemsContainers: Container[] = [];

  private rows!: number;
  private columns = 1;

  private displayWidth!: number;
  private displayHeight!: number;

  constructor(x: number, y: number) {
    super();

    this.createDisplay(x, y);
  }

  public createDisplay(x: number, y: number) {
    this.rows = Math.ceil(this.quests.length / this.columns);

    this.displayWidth =
      this.columns * QuestListDisplay.params.columnWidth +
      (this.columns - 1) * QuestListDisplay.params.gap +
      2 * QuestListDisplay.params.gap;

    this.displayHeight =
      this.rows * QuestListDisplay.params.rowHeight +
      (this.rows - 1) * QuestListDisplay.params.gap +
      2 * QuestListDisplay.params.gap;

    this.draw();

    this.x = x;
    this.y = y - this.displayHeight;
  }

  private draw() {
    this.makeDisplayBackground();

    this.makeDisplayItems();
  }

  private makeDisplayBackground() {
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
      style: {
        fill: "#000000",
        fontSize: 28,
      },
    });

    text.x = QuestListDisplay.params.columnWidth / 2 - text.width / 2;
    text.y = -QuestListDisplay.params.rowHeight / 2 - text.height / 2;

    text.eventMode = "none";
    this.addChild(text);
  }

  private makeDisplayItems() {
    this.quests.forEach((item, index) => {
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);

      const x =
        column *
        (QuestListDisplay.params.columnWidth + QuestListDisplay.params.gap);
      const y =
        row * (QuestListDisplay.params.rowHeight + QuestListDisplay.params.gap);

      this.displayItemsContainers[index] = new Container();

      this.displayItemsContainers[index].position.set(x, y);

      this.createDisplayItem(item, this.displayItemsContainers[index]);

      this.addChild(this.displayItemsContainers[index]);
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
        QuestListDisplay.params.columnWidth,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.borderRadius - QuestListDisplay.params.gap,
      )
      .fill("#aeadab");

    container.addChild(background);
  }

  private createDisplayItemText(label: string, container: Container) {
    const text = new Text({
      text: label,
      style: {
        fill: "#000000",
        fontSize: 25,
      },
    });

    text.x = QuestListDisplay.params.buildingLabelX;
    text.y = QuestListDisplay.params.rowHeight / 2 - text.height / 2;

    text.eventMode = "none";
    container.addChild(text);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const background = new Graphics()
      .roundRect(
        QuestListDisplay.params.columnWidth - QuestListDisplay.params.rowHeight,
        0,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.rowHeight,
        QuestListDisplay.params.borderRadius - QuestListDisplay.params.gap,
      )
      .fill(buildingThemes.find((item) => item.label === buildingName)?.color);

    container.addChild(background);

    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      QuestListDisplay.params.columnWidth -
        QuestListDisplay.params.rowHeight / 2,
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
        QuestListDisplay.params.columnWidth - QuestListDisplay.params.rowHeight,
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
      QuestListDisplay.params.columnWidth -
        QuestListDisplay.params.rowHeight / 2,
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
