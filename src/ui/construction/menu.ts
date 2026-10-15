import { Container, Graphics, Text } from "pixi.js";

import { buildingMap } from "@aircraft/aircraft";
import { Platform } from "@aircraft/modules/platform";
import { type Building } from "@aircraft/building";
import {
  type RecipeIngredient,
  RecipeSign,
} from "@aircraft/building-parts/recipe-sign";

import { Road } from "@roads/road";

import { getConstructionMenuPosition } from "@utils/ui-config";
import { menuItems, type MenuItem } from "@utils/menu-items";

export class ConstructionMenu extends Container {
  public menuItems: MenuItem[] = menuItems.filter((item) =>
    [
      "Collector",
      "Farm",
      "Extractor",
      "Assembler",
      "Mixer",
      "Grinder",
      "Platform",
      "Engine",
      "Road",
    ].includes(item.label),
  );

  private menuBackground = new Graphics();
  private menuItemsContainers: Container[] = [];

  private static params = {
    columnWidth: 120,
    rowHeight: 120,
    gap: 10,
    borderRadius: 26,

    backgroundColor: "#cfcbc8",

    buildingLabelY: 18,
  };

  private centerBottom = {
    x: getConstructionMenuPosition().x,
    y: getConstructionMenuPosition().y,
  };

  private rows!: number;
  private columns = 3;

  private menuWidth!: number;
  private menuHeight!: number;

  constructor(private setBuildingType: (type: string | undefined) => void) {
    super();

    this.createMenu();
  }

  public createMenu() {
    this.rows = Math.ceil(this.menuItems.length / this.columns);

    this.menuWidth =
      this.columns * ConstructionMenu.params.columnWidth +
      (this.columns - 1) * ConstructionMenu.params.gap +
      2 * ConstructionMenu.params.gap;

    this.menuHeight =
      this.rows * ConstructionMenu.params.rowHeight +
      (this.rows - 1) * ConstructionMenu.params.gap +
      2 * ConstructionMenu.params.gap;

    this.draw();

    this.x =
      this.centerBottom.x - this.menuWidth / 2 + ConstructionMenu.params.gap;
    this.y = this.centerBottom.y - this.menuHeight;
  }

  private draw() {
    this.makeMenuBackground();

    this.makeMenuItems();
  }

  private makeMenuBackground() {
    this.menuBackground
      .roundRect(
        -ConstructionMenu.params.gap,
        -ConstructionMenu.params.gap,
        this.menuWidth,
        this.menuHeight,
        ConstructionMenu.params.borderRadius,
      )
      .fill(ConstructionMenu.params.backgroundColor);

    this.addChild(this.menuBackground);
  }

  private makeMenuItems() {
    this.menuItems.forEach((item, index) => {
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);

      const x =
        column *
        (ConstructionMenu.params.columnWidth + ConstructionMenu.params.gap);
      const y =
        row * (ConstructionMenu.params.rowHeight + ConstructionMenu.params.gap);

      this.menuItemsContainers[index] = new Container();

      this.menuItemsContainers[index].position.set(x, y);

      this.createMenuItem(item, this.menuItemsContainers[index]);

      this.addChild(this.menuItemsContainers[index]);
    });
  }

  private createMenuItem(item: MenuItem, container: Container) {
    this.createMenuItemBackground(item.color, container, item.label);

    this.createBuildingLabel(item.label, container);

    if (item.label === "Road") {
      this.createRoadImage(container);
    } else {
      this.createBuildingImage(item.label, container);
    }
  }

  private createMenuItemBackground(
    backgroundColor: string,
    container: Container,
    buildingType: string,
  ) {
    const background = new Graphics()
      .roundRect(
        0,
        0,
        ConstructionMenu.params.columnWidth,
        ConstructionMenu.params.rowHeight,
        ConstructionMenu.params.borderRadius - ConstructionMenu.params.gap,
      )
      .fill(backgroundColor);

    background.eventMode = "static";
    background.cursor = "pointer";

    background.on("pointerdown", () => {
      this.setBuildingType(buildingType);
    });
    container.addChild(background);
  }

  private createBuildingLabel(label: string, container: Container) {
    const text = new Text({
      text: label,
      style: {
        fill: "#000000",
        fontSize: 20,
      },
    });

    text.anchor.set(0.5);

    text.x = ConstructionMenu.params.columnWidth / 2;
    text.y = ConstructionMenu.params.buildingLabelY;

    text.eventMode = "none";
    container.addChild(text);
  }

  private createRoadImage(container: Container) {
    const road = Road.crateRoadImage(
      ConstructionMenu.params.columnWidth,
      ConstructionMenu.params.rowHeight,
    );

    road.scale = 0.5;
    road.eventMode = "none";

    container.addChild(road);

    const constructionRecipe = [{ resourceName: "Metal", amount: 1 }];

    this.createBuildingRecipe(constructionRecipe, container);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      ConstructionMenu.params.columnWidth / 2,
      ConstructionMenu.params.rowHeight / 2,
      true,
    );

    building.scale = 0.5;
    building.eventMode = "none";
    building.contentContainer.filters = [];

    container.addChild(building);

    this.createBuildingRecipe(building.constructionRecipe, container);
    this.createCraftRecipe(building, container);
  }

  private createCraftRecipe(building: Building, container: Container) {
    if (building.craftRecipe) {
      building.showRecipeInfo();

      building.recipeSign.position.set(
        ConstructionMenu.params.columnWidth / 2,
        ConstructionMenu.params.rowHeight - 18,
      );

      container.addChild(building.recipeSign);
    }
  }

  private createBuildingRecipe(
    buildingRecipe: RecipeIngredient[],
    container: Container,
  ) {
    const recipeSign = new RecipeSign();
    recipeSign.show(
      {
        ingredients: buildingRecipe.map((ingredient) => ({
          resourceName: ingredient.resourceName,
          amount: ingredient.amount,
        })),
      },
      { layout: "vertical" },
    );
    recipeSign.position.set(
      ConstructionMenu.params.columnWidth - 31,
      ConstructionMenu.params.rowHeight - 90,
    );

    container.addChild(recipeSign);
  }
}
