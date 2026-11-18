import { Container, Graphics } from "pixi.js";

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
    padding: 12,

    borderRadius: 8,
  };

  private static horizontalMode = {
    height: 20,
    recipeResultBackgroundWidth: 24,
    recipeResultBackgroundColor: "#f7f3d6",
  };

  private static verticalMode = {
    width: 20,
    textPositionX: 3,
    textPositionY: 4,
    resourcePositionX: 10,
    resourcePositionY: 10,
  };

  private static arrowParams = {
    x: -3,
    y: 0,
    width: 6,
    height: 8,

    strokeWidth: 2,
    strokeColor: "#000000",
  };

  private static plusParams = {
    x: 10,
    y: -7,
    width: 7,
    height: 7,

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
      this.drawVertical(recipe.ingredients, options);
    } else {
      this.drawHorizontal(recipe, options);
    }
  }

  hide() {
    this.removeChildren();
  }

  private drawHorizontal(recipe: Recipe, options: RecipeSignOptions) {
    const elements = this.getResourcesWithAlpha(recipe.ingredients, options);

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
      .roundRect(
        -width / 2,
        -RecipeSign.horizontalMode.height / 2,
        width,
        RecipeSign.horizontalMode.height,
        RecipeSign.signParams.borderRadius,
      )
      .fill(RecipeSign.signParams.backgroundColor)
      .stroke({
        width: RecipeSign.signParams.strokeWidth,
        color: RecipeSign.signParams.strokeColor,
      });

    if (recipe.result) {
      background
        .roundRect(
          width / 2 - RecipeSign.horizontalMode.recipeResultBackgroundWidth,
          -RecipeSign.horizontalMode.height / 2,
          RecipeSign.horizontalMode.recipeResultBackgroundWidth,
          RecipeSign.horizontalMode.height,
          RecipeSign.signParams.borderRadius,
        )
        .fill(RecipeSign.horizontalMode.recipeResultBackgroundColor)
        .stroke({
          width: RecipeSign.signParams.strokeWidth,
          color: RecipeSign.signParams.strokeColor,
        });
    }

    this.addChild(background);

    elements.forEach((element, index) => {
      element.position.set((index - center) * RecipeSign.signParams.spacing, 0);
      this.addChild(element);
    });
  }

  private drawVertical(
    ingredients: RecipeIngredient[],
    options: RecipeSignOptions,
  ) {
    if (ingredients.length === 0) return;

    const elements = this.getResourcesWithAlpha(ingredients, options);

    const paddingForRecipeSymbol = 15;
    const height = elements.length * RecipeSign.signParams.spacing + 5;
    const background = new Graphics()
      .roundRect(
        0,
        -paddingForRecipeSymbol,
        RecipeSign.verticalMode.width,
        height + paddingForRecipeSymbol,
        RecipeSign.signParams.borderRadius,
      )
      .fill(RecipeSign.signParams.backgroundColor)
      .stroke({
        width: RecipeSign.signParams.strokeWidth,
        color: RecipeSign.signParams.strokeColor,
      });

    const recipeSymbolBackgroundHeight = 15;

    background
      .roundRect(
        0,
        -recipeSymbolBackgroundHeight,
        RecipeSign.verticalMode.width,
        recipeSymbolBackgroundHeight,
        RecipeSign.signParams.borderRadius,
      )
      .fill(RecipeSign.signParams.backgroundColor)
      .stroke({
        width: RecipeSign.signParams.strokeWidth,
        color: RecipeSign.signParams.strokeColor,
      });

    this.addChild(background);

    this.addChild(
      this.createPlus(
        RecipeSign.plusParams.x,
        RecipeSign.plusParams.y,
        RecipeSign.plusParams.width,
        RecipeSign.plusParams.height,
      ),
    );

    elements.forEach((ingredient, index) => {
      ingredient.position.set(
        RecipeSign.verticalMode.resourcePositionX,
        RecipeSign.verticalMode.resourcePositionY +
          index * RecipeSign.signParams.spacing,
      );

      this.addChild(ingredient);
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

  private createPlus(x: number, y: number, width: number, height: number) {
    return new Graphics()
      .moveTo(x - width / 2, y)
      .lineTo(x + width / 2, y)
      .moveTo(x, y - height / 2)
      .lineTo(x, y + height / 2)
      .stroke({
        width: RecipeSign.plusParams.strokeWidth,
        color: RecipeSign.plusParams.strokeColor,
      });
  }

  private getResourcesWithAlpha(
    ingredients: RecipeIngredient[],
    options: RecipeSignOptions,
  ) {
    const elements: Container[] = [];
    const availableCounts = options.availableResources
      ? this.countResources(options.availableResources)
      : undefined;

    for (const ingredient of ingredients) {
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

    return elements;
  }
}
