import { Container, Graphics, Text } from "pixi.js";

import { createResource } from "@resources/create-resources";

export interface RecipeIngredient {
  resourceName: string;
  amount: number;
}

export interface Recipe {
  ingredients: RecipeIngredient[];
  result?: string;
  duration?: number;
}

export interface RecipeSignOptions {
  layout?: "horizontal" | "vertical";
  availableResources?: string[];
  isAvailableResult?: boolean;
}

export class RecipeSign extends Container {
  private static signParams = {
    backgroundColor: "#c9c6bb",
    strokeWidth: 2,
    strokeColor: "#000000",

    unavailableResource: 0.45,
    spacing: 15,
    padding: 10,
  };

  private static horizontalMode = {
    height: 20,
  };

  private static verticalMode = {
    width: 30,
    textPositionX: 4,
    textPositionY: 2,
    resourcePositionX: 21,
    resourcePositionY: 10,
  };

  private static arrowParams = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,

    strokeWidth: 2,
    strokeColor: "#000000",
  };

  constructor() {
    super();
    this.eventMode = "none";
  }

  isShown() {
    return this.children.length > 0;
  }

  show(recipe: Recipe, options: RecipeSignOptions = {}) {
    this.hide();

    if (options.layout === "vertical") {
      this.drawVertical(recipe.ingredients);
    } else {
      this.drawHorizontal(recipe, options);
    }
  }

  hide() {
    this.removeChildren();
  }

  private drawHorizontal(recipe: Recipe, options: RecipeSignOptions) {
    const elements: Container[] = [];
    const availableCounts = options.availableResources
      ? this.countResources(options.availableResources)
      : undefined;

    for (const ingredient of recipe.ingredients) {
      for (let i = 0; i < ingredient.amount; i++) {
        const resource = createResource(ingredient.resourceName);
        const availableCount = availableCounts
          ? (availableCounts.get(ingredient.resourceName) ?? 0)
          : ingredient.amount;

        if (availableCounts && availableCount > 0) {
          availableCounts.set(ingredient.resourceName, availableCount - 1);
        } else if (availableCounts) {
          resource.alpha = RecipeSign.signParams.unavailableResource;
        }

        elements.push(resource);
      }
    }

    if (recipe.result) {
      elements.push(
        this.createArrow(
          RecipeSign.arrowParams.x,
          RecipeSign.arrowParams.y,
          RecipeSign.arrowParams.width,
          RecipeSign.arrowParams.height,
        ),
      );

      const result = createResource(recipe.result);
      if (options.isAvailableResult === false) {
        result.alpha = RecipeSign.signParams.unavailableResource;
      }
      elements.push(result);
    }

    if (elements.length === 0) return;

    const center = (elements.length - 1) / 2;
    const width =
      (elements.length - 1) * RecipeSign.signParams.spacing +
      RecipeSign.signParams.padding * 2;

    const background = new Graphics()
      .rect(
        -width / 2,
        -RecipeSign.horizontalMode.height / 2,
        width,
        RecipeSign.horizontalMode.height,
      )
      .fill(RecipeSign.signParams.backgroundColor)
      .stroke({
        width: RecipeSign.signParams.strokeWidth,
        color: RecipeSign.signParams.strokeColor,
      });

    this.addChild(background);

    elements.forEach((element, index) => {
      element.position.set((index - center) * RecipeSign.signParams.spacing, 0);
      this.addChild(element);
    });
  }

  private drawVertical(ingredients: RecipeIngredient[]) {
    if (ingredients.length === 0) return;

    const height = ingredients.length * RecipeSign.signParams.spacing + 5;
    const background = new Graphics()
      .rect(0, 0, RecipeSign.verticalMode.width, height)
      .fill(RecipeSign.signParams.backgroundColor)
      .stroke({
        width: RecipeSign.signParams.strokeWidth,
        color: RecipeSign.signParams.strokeColor,
      });

    this.addChild(background);

    ingredients.forEach((ingredient, index) => {
      const resource = createResource(ingredient.resourceName);
      resource.position.set(
        RecipeSign.verticalMode.resourcePositionX,
        RecipeSign.verticalMode.resourcePositionY +
          index * RecipeSign.signParams.spacing,
      );

      const amount = new Text({
        text: ingredient.amount,
        style: {
          fill: "#000000",
          fontSize: 14,
        },
        x: RecipeSign.verticalMode.textPositionX,
        y:
          RecipeSign.verticalMode.textPositionY +
          index * RecipeSign.signParams.spacing,
      });

      this.addChild(resource, amount);
    });
  }

  private countResources(resources: string[]) {
    const counts = new Map<string, number>();

    for (const resource of resources) {
      counts.set(resource, (counts.get(resource) ?? 0) + 1);
    }

    return counts;
  }

  private createArrow(x: number, y: number, width: number, height: number) {
    return new Graphics()
      .moveTo(x - width / 2, y)
      .lineTo(x + width / 2, y)
      .moveTo(x + width / 2, y)
      .lineTo(x, y - height / 2)
      .moveTo(x + width / 2, y)
      .lineTo(x, y + height / 2)
      .stroke({
        width: RecipeSign.arrowParams.strokeWidth,
        color: RecipeSign.arrowParams.strokeColor,
        cap: "round",
      });
  }
}
