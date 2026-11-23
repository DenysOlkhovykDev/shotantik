import { Container, FederatedPointerEvent } from "pixi.js";

import { resetButton } from "./reset-button";

import { getCameraResetButtonPosition } from "@utils/ui-config";

class CameraSettings extends Container {
  private zoom = 1;
  private minZoom = 0.5;
  private maxZoom = 5;
  private zoomSpeed = 0.001;

  private buttonPosition = {
    x: getCameraResetButtonPosition().x,
    y: getCameraResetButtonPosition().y,
  };

  private pointers = new Map();
  private lastPinchDistance = 0;
  private hadMultiTouchGesture = false;
  private hadPanGesture = false;

  private isZoomAllowed = true;

  private resetButton = new resetButton();

  public offsetX = 0;
  public offsetY = 0;

  private panPointerId: number | undefined = undefined;
  private panPointerType: string | undefined = undefined;
  private lastPanX = 0;
  private lastPanY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private isPanning = false;
  private dragThreshold = 5;

  private sensitivity = 1;

  constructor() {
    super();

    this.resetButton.eventMode = "static";

    this.resetButton.on("pointerdown", (e) => {
      this.resetCamera();
      e.stopPropagation();
    });

    this.resetButton.position.set(this.buttonPosition.x, this.buttonPosition.y);

    this.addChild(this.resetButton);

    this.hideResetButton();
  }

  public resetCamera() {
    this.setZoom(1);
    this.offsetX = 0;
    this.offsetY = 0;
    this.resetPointerState();
  }

  public getZoom() {
    return this.zoom;
  }

  public changeZoomByScrolling(delta: number) {
    this.setZoom(this.zoom * Math.exp(delta * this.zoomSpeed));
  }

  public getPointersAmount() {
    return this.pointers.size;
  }

  public setSensitivity(value: number) {
    this.sensitivity = value;
  }

  public onPointerDown(event: FederatedPointerEvent) {
    if (event.pointerType === "touch") {
      if (this.pointers.size >= 2) {
        this.resetPointerState();
        return;
      }

      this.startChangingZoomByTouch(
        event.pointerId,
        event.clientX,
        event.clientY,
      );
    }

    this.startPanning(
      event.pointerId,
      event.clientX,
      event.clientY,
      event.pointerType,
    );
  }

  public startChangingZoomByTouch(
    pointerId: number,
    clientX: number,
    clientY: number,
  ) {
    if (this.pointers.size === 0) {
      this.hadMultiTouchGesture = false;
      this.hadPanGesture = false;
    }

    this.pointers.set(pointerId, {
      x: clientX,
      y: clientY,
    });

    if (this.pointers.size === 2) {
      this.hadMultiTouchGesture = true;
      this.lastPinchDistance = this.getPinchDistance();
    }
  }

  public continueChangingZoomByTouch(
    pointerId: number,
    clientX: number,
    clientY: number,
  ) {
    if (!this.pointers.has(pointerId)) return;

    this.pointers.set(pointerId, {
      x: clientX,
      y: clientY,
    });

    if (this.pointers.size !== 2) return;

    const distance = this.getPinchDistance();

    if (this.lastPinchDistance > 0) {
      this.setZoom(this.zoom * (distance / this.lastPinchDistance));
    }

    this.lastPinchDistance = distance;
  }

  public stopChangingZoomByTouch(pointerId: number) {
    this.pointers.delete(pointerId);

    this.lastPinchDistance =
      this.pointers.size === 2 ? this.getPinchDistance() : 0;
  }

  public disallowZoom() {
    this.resetCamera();
    this.isZoomAllowed = false;
  }

  public allowZoom() {
    this.isZoomAllowed = true;
  }

  public startPanning(
    pointerId: number,
    clientX: number,
    clientY: number,
    pointerType: string,
  ) {
    if (this.pointers.size >= 2) return;

    if (this.pointers.size === 0) {
      this.hadMultiTouchGesture = false;
      this.hadPanGesture = false;
    }

    this.panPointerId = pointerId;
    this.panPointerType = pointerType;
    this.lastPanX = clientX;
    this.lastPanY = clientY;
    this.panStartX = clientX;
    this.panStartY = clientY;
    this.isPanning = false;
  }

  public continuePanning(pointerId: number, clientX: number, clientY: number) {
    if (this.panPointerId !== pointerId) return;

    const deltaX = clientX - this.lastPanX;
    const deltaY = clientY - this.lastPanY;

    if (
      !this.isPanning &&
      Math.hypot(clientX - this.panStartX, clientY - this.panStartY) >=
        this.dragThreshold
    ) {
      this.isPanning = true;
      this.hadPanGesture = true;
    }

    if (this.isPanning && this.pointers.size < 2) {
      this.offsetX -= (deltaX * this.sensitivity) / this.zoom;
      this.offsetY -= (deltaY * this.sensitivity) / this.zoom;

      if (this.offsetX === 0 && this.offsetY === 0) {
        this.hideResetButton();
      } else {
        this.showResetButton();
      }
    }

    this.lastPanX = clientX;
    this.lastPanY = clientY;
  }

  public stopPanning(pointerId: number) {
    if (this.panPointerId !== pointerId) return;

    this.panPointerId = undefined;
    this.panPointerType = undefined;
    this.isPanning = false;
  }

  private resetPointerState() {
    this.pointers.clear();
    this.lastPinchDistance = 0;
    this.panPointerId = undefined;
    this.panPointerType = undefined;
    this.lastPanX = 0;
    this.lastPanY = 0;
    this.panStartX = 0;
    this.panStartY = 0;
    this.isPanning = false;
    this.hadMultiTouchGesture = false;
    this.hadPanGesture = false;
  }

  public getIsPanning() {
    return this.isPanning;
  }

  public isPointerGesture() {
    return (
      this.isPanning ||
      this.hadPanGesture ||
      this.pointers.size > 1 ||
      this.hadMultiTouchGesture
    );
  }

  private setZoom(value: number) {
    if (this.isZoomAllowed) {
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value));

      if (this.zoom === 1) {
        this.hideResetButton();
      } else {
        this.showResetButton();
      }
    }
  }

  private getPinchDistance() {
    const [a, b] = this.pointers.values();

    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  private showResetButton() {
    this.resetButton.visible = true;
  }

  private hideResetButton() {
    this.resetButton.visible = false;
  }
}

export const cameraSettings = new CameraSettings();
