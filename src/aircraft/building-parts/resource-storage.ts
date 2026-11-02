import { Container } from "pixi.js";

import { aircraft } from "@aircraft/aircraft";

import { type Resource } from "@resources/resource";
import { type Task } from "@dashboard/task";

import { getRandomPointInRadius } from "@utils/basic-geometry";

type ResourceListener = (task: Task, resource: Resource) => void;

export class ResourceStorage extends Container {
  resourceList: Map<string, number> = new Map<string, number>();
  resources: Resource[] = [];

  private resourceListeners: ResourceListener[] = [];

  constructor(
    private inventorySize: number,
    private placementRadius: number,
  ) {
    super();
  }

  getResourceCount(resourceName: string) {
    return this.resources.filter(
      (resource) => resource.resourceType === resourceName,
    ).length;
  }

  placeResource(resource: Resource) {
    const radius = this.placementRadius;
    const minDist = 15;

    let tries = 0;

    while (tries < 50) {
      const { x, y } = getRandomPointInRadius(radius);

      const isValid = this.resources.every((other) => {
        if (other === resource) return true;

        const dx = other.x - x;
        const dy = other.y - y;

        return Math.sqrt(dx * dx + dy * dy) > minDist;
      });

      if (isValid) {
        resource.x = x;
        resource.y = y;
        resource.rotation = Math.random() * Math.PI * 2;
        return;
      }

      tries++;
    }

    resource.x = 0;
    resource.y = 0;
    resource.rotation = Math.random() * Math.PI * 2;
  }

  unsubscribeResourceListeners(fn: ResourceListener) {
    this.resourceListeners.push(fn);

    return () => {
      const index = this.resourceListeners.indexOf(fn);
      if (index !== -1) {
        this.resourceListeners.splice(index, 1);
      }
    };
  }

  tryToAddResource(resource: Resource, task?: Task) {
    if (this.resources.length >= this.inventorySize) return false;

    this.resources.push(resource);
    this.addChild(resource);

    const resourceName = resource.resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    this.resourceList.set(resourceName, current + 1);
    this.placeResource(resource);

    for (const fn of this.resourceListeners) {
      if (!resource.isReserved) {
        aircraft.findWhereToReuseUselessResource(resource);
      }
      if (task) {
        fn(task, resource);
      }
    }

    return true;
  }

  takeResourceByIndex(resourceIndex: number) {
    if (resourceIndex < 0 || resourceIndex >= this.resources.length) {
      return undefined;
    }

    const resourceName = this.resources[resourceIndex].resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    if (current > 1) {
      this.resourceList.set(resourceName, current - 1);
    } else {
      this.resourceList.delete(resourceName);
    }

    const [resource] = this.resources.splice(resourceIndex, 1);

    this.removeChild(resource);

    return resource;
  }

  takeResourceByType(resource: Resource) {
    const index = this.resources.indexOf(resource);

    return this.takeResourceByIndex(index);
  }

  takeReservedResourceByName(resourceName: string) {
    const index = this.resources.findIndex(
      (resource) =>
        resource.resourceType === resourceName && resource.isReserved,
    );

    return this.takeResourceByIndex(index);
  }

  takeResourceByName(resourceName: string) {
    const index = this.resources.findIndex(
      (resource) =>
        resource.resourceType === resourceName && !resource.isReserved,
    );

    return this.takeResourceByIndex(index);
  }
}
