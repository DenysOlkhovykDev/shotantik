import { type Task, JobType } from "@dashboard/task";
import type { Building } from "@aircraft/building";
import { dijkstra } from "@utils/algorithms";

export const dashboard: Task[] = [];

export function getAvailableTaskWithHighestPriority(
  currentBuilding: Building,
  jobType: JobType,
) {
  const { distances } = dijkstra(currentBuilding);

  let bestTask: Task | undefined;
  let bestPriority = -Infinity;
  let bestDistance = Infinity;

  for (const task of dashboard) {
    if (task.jobType !== jobType || task.status !== "available") continue;

    let totalDistance: number;

    if (jobType === JobType.building || jobType === JobType.delivering) {
      const [path, resource, distance] = task.getRouteForResource(
        currentBuilding,
        false,
      );

      const freeSpace =
        task.target.buildingConfig.inventorySize -
        task.target.resourceStorage.recources.length;
      const notCompletedTasks = task.blueprint?.tasks.length ?? 0;

      if (
        path.length === 0 ||
        resource === undefined ||
        distance === undefined ||
        freeSpace < notCompletedTasks
      ) {
        continue;
      }

      totalDistance = distance;
    } else {
      const distanceToTask = distances.get(task.target);
      if (distanceToTask === undefined || !Number.isFinite(distanceToTask)) {
        continue;
      }

      totalDistance = distanceToTask;
    }

    const effectivePriority = task.getEffectivePriority();

    if (
      effectivePriority > bestPriority ||
      (effectivePriority === bestPriority && totalDistance < bestDistance)
    ) {
      bestPriority = effectivePriority;
      bestDistance = totalDistance;
      bestTask = task;
    }
  }

  return bestTask;
}
