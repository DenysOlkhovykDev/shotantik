import { Container, Texture } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { Road } from "@roads/road";
import { BlueprintRoad } from "@roads/blueprint-road";
import { JobType, Task } from "@dashboard/task";
import { Resource } from "@resources/resource";

import { Platform } from "@aircraft/platform";
import { Collector } from "@aircraft/collector";
import { Farm } from "@aircraft/farm";
import { Extractor } from "@aircraft/extractor";
import { Assembler } from "@aircraft/assembler";
import { Junkuard } from "@aircraft/junkuard";
import { House } from "@aircraft/house";
import { Mixer } from "@aircraft/mixer";
import { Grinder } from "@aircraft/grinder";
import { Engine } from "@aircraft/engine";
import { Blueprint } from "@aircraft/blueprint";
import { GlassMaker } from "@aircraft/glassMaker";
import { Workers } from "@workers/_workers";
import { RecipeIngredient } from "./building-parts/recipe-sign";

export type BuildingClass = {
  new (x: number, y: number): Building;
  buildingConfig: BuildingConfig;
  baseTexture: Texture;
  constructionRecipe: RecipeIngredient[];
};

export const buildingMap: Record<string, BuildingClass> = {
  Platform,
  Collector,
  Farm,
  Extractor,
  Assembler,
  Junkuard,
  House,
  Mixer,
  Grinder,
  Engine,
  GlassMaker,
};

interface SelectedBuilding {
  array: "buildings" | "blueprints";
  index?: number;
}

class Aircraft {
  public buildings: Building[] = [];
  public blueprints: Blueprint[] = [];
  public workers: Workers = new Workers();
  public constructionSource?: number;
  public selectedBuilding: SelectedBuilding = {
    array: "buildings",
  };

  public airCraftLayer = new Container();
  public workersLayer = new Container();

  public initilaizeAircraft(stage: Container) {
    stage.addChild(this.airCraftLayer);
    stage.addChild(this.workersLayer);
  }

  public addBuilding(x: number, y: number, buildingType: string) {
    const BuildingClass = buildingMap[buildingType] || Platform;
    const building = new BuildingClass(x, y);

    const from =
      this.buildings.length > 0 && this.constructionSource !== undefined
        ? this.buildings[this.constructionSource]
        : undefined;

    if (from) {
      building.orientByBuildDirection(from);
    }

    this.buildings.push(building);
    this.airCraftLayer.addChild(building.root);

    if (from) {
      const line = new Road(from, building);

      from.addLinkedBuilding(line);
      building.addLinkedBuilding(line);

      this.airCraftLayer.addChildAt(line.graphic, 0);
    }

    return building;
  }

  public addBlueprint(x: number, y: number, buildingType: string) {
    const BuildingClass = buildingMap[buildingType] || Platform;

    const blueprint = new Blueprint(x, y, BuildingClass, buildingType);

    this.blueprints.push(blueprint);
    this.airCraftLayer.addChild(blueprint.root);

    if (this.buildings.length > 0 && this.constructionSource !== undefined) {
      const from = this.buildings[this.constructionSource];

      blueprint.orientByBuildDirection(from);

      const line = new BlueprintRoad(from, blueprint);

      blueprint.addLinkedBuilding(line);

      this.airCraftLayer.addChildAt(line.graphic, 0);
      const constructionRecipe = BuildingClass.constructionRecipe;

      for (let i = 0; i < constructionRecipe.length; i++) {
        for (let j = 0; j < constructionRecipe[i].amount; j++) {
          const availableResource = from.resourceStorage.recources.find(
            (resource) =>
              resource.resourceType === constructionRecipe[i].resourceName &&
              !resource.isReserved,
          );

          if (availableResource) {
            blueprint.reserveBuildResource(availableResource);
          } else {
            const [task] = from.taskManager.addTasks(
              JobType.building,
              5,
              constructionRecipe[i].resourceName,
            );
            if (task) {
              blueprint.tasks.push(task);
            }
          }

          blueprint.buildResources.push(constructionRecipe[i].resourceName);
        }
      }

      const source = blueprint.links[0].from;

      const unsubscribe = source.unsubscribeResourceListners(
        (task: Task, resource: Resource) => {
          blueprint.onBlueprintResourceAdded(
            task,
            resource,
            this.airCraftLayer,
          );
        },
      );

      blueprint.unsubscribe = unsubscribe;
      blueprint.blueprinToBuilding(this.airCraftLayer);
    }

    return blueprint;
  }

  public setConstuctionSource(node: Building) {
    this.constructionSource = this.buildings.indexOf(node);
  }

  public resetConstructionSource() {
    this.constructionSource = undefined;
  }

  public selectBuilding(node: Building | Blueprint) {
    const buildingIndex = this.buildings.indexOf(node as Building);

    if (buildingIndex >= 0) {
      this.selectedBuilding = {
        array: "buildings",
        index: buildingIndex,
      };
      return;
    }

    const blueprintIndex = this.blueprints.indexOf(node as Blueprint);

    if (blueprintIndex >= 0) {
      this.selectedBuilding = {
        array: "blueprints",
        index: blueprintIndex,
      };
    }
  }

  public deSelectAllBuildings() {
    for (const building of this.buildings) {
      building.backgroundDisplay.removeSelectShadow();
    }

    for (const blueprint of this.blueprints) {
      blueprint.backgroundDisplay.removeSelectShadow();
    }

    this.selectedBuilding.index = undefined;
  }

  public getSelectedNodeType() {
    if (
      this.selectedBuilding.index !== undefined &&
      this.selectedBuilding.index >= 0
    ) {
      if (this.selectedBuilding.array === "buildings") {
        return aircraft.buildings[this.selectedBuilding.index].buildingType;
      } else {
        return aircraft.blueprints[this.selectedBuilding.index]
          .targetBuildingType;
      }
    }
  }

  public showCraftSigns() {
    this.hideCraftSigns();
    for (const blueprint of this.blueprints) {
      blueprint.showRecipeState();
    }
  }

  public hideCraftSigns() {
    for (const building of this.buildings) {
      building.hideRecipeSign();
    }
    for (const blueprint of this.blueprints) {
      blueprint.hideRecipeSign();
    }
  }

  public buildingAnimations(delta: number, movingAngle?: number) {
    for (const building of this.buildings) {
      building.animation(delta, movingAngle);
    }
  }

  public movingBlueprints(delta: number) {
    for (const blueprint of this.blueprints) {
      for (const building of this.buildings) {
        blueprint.checkAndMove(building, delta);
      }
    }
    for (const blueprint of this.blueprints) {
      for (const blueprintForCheck of this.blueprints) {
        if (blueprint !== blueprintForCheck) {
          blueprint.checkAndMove(blueprintForCheck, delta);
        }
      }
    }

    for (let i = this.blueprints.length - 1; i >= 0; i--) {
      if (this.blueprints[i].redraws > 5000) {
        this.deleteBlueprint(this.blueprints[i]);
      }
    }
  }

  public deleteBlueprint(blueprint: Blueprint) {
    const index = this.blueprints.indexOf(blueprint);

    if (index === -1) return;

    blueprint.cleanup();

    for (const link of blueprint.links) {
      link.graphic.destroy();
    }
    blueprint.root.destroy();

    this.blueprints.splice(index, 1);

    if (
      this.selectedBuilding.array === "blueprints" &&
      this.selectedBuilding.index === index
    ) {
      this.selectedBuilding.index = undefined;
    } else if (
      this.selectedBuilding.array === "blueprints" &&
      this.selectedBuilding.index !== undefined &&
      this.selectedBuilding.index > index
    ) {
      this.selectedBuilding.index--;
    }
  }

  public deleteBuilding(building: Building) {
    const index = this.buildings.indexOf(building);

    if (index === -1) return;

    for (const blueprint of [...this.blueprints]) {
      if (blueprint.links.some((link) => link.from === building)) {
        this.deleteBlueprint(blueprint);
      }
    }

    for (const link of building.links) {
      link.graphic.destroy();

      const linkedBuilding = link.from === building ? link.to : link.from;
      linkedBuilding.links = linkedBuilding.links.filter(
        (linkedBuildingLink) => linkedBuildingLink !== link,
      );
    }
    building.root.destroy();
    this.buildings.splice(index, 1);

    if (this.constructionSource === index) {
      this.resetConstructionSource();
    } else if (
      this.constructionSource !== undefined &&
      this.constructionSource > index
    ) {
      this.constructionSource--;
    }

    if (
      this.selectedBuilding.array === "buildings" &&
      this.selectedBuilding.index === index
    ) {
      this.selectedBuilding.index = undefined;
    } else if (
      this.selectedBuilding.array === "buildings" &&
      this.selectedBuilding.index !== undefined &&
      this.selectedBuilding.index > index
    ) {
      this.selectedBuilding.index--;
    }
  }

  public deleteSelectedNode() {
    if (
      this.selectedBuilding.index !== undefined &&
      this.selectedBuilding.index >= 0
    ) {
      if (this.selectedBuilding.array === "buildings") {
        this.deleteBuilding(aircraft.buildings[this.selectedBuilding.index]);
      } else {
        this.deleteBlueprint(aircraft.blueprints[this.selectedBuilding.index]);
      }
    }
  }
}

export const aircraft: Aircraft = new Aircraft();
