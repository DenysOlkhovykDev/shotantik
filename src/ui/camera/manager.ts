import { Container, type FederatedPointerEvent } from "pixi.js";

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

  private panPointerId: number | null = null;
  private lastPanX = 0;
  private lastPanY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private isPanning = false;
  private dragThreshold = 5;

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
  }

  public getZoom() {
    return this.zoom;
  }

  public changeZoomByScrolling(delta: number) {
    this.setZoom(this.zoom * Math.exp(delta * this.zoomSpeed));
  }

  public onPointerDown(event: FederatedPointerEvent) {
    if (event.pointerType === "touch") {
      this.startChangingZoomByTouch(
        event.pointerId,
        event.clientX,
        event.clientY,
      );
    }

    this.startPanning(event.pointerId, event.clientX, event.clientY);
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

  public startPanning(pointerId: number, clientX: number, clientY: number) {
    if (this.pointers.size >= 2) return;

    if (this.pointers.size === 0) {
      this.hadMultiTouchGesture = false;
      this.hadPanGesture = false;
    }

    this.panPointerId = pointerId;
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

    const sensitivity = navigator.maxTouchPoints > 0 ? 1.8 : 1;

    if (this.isPanning && this.pointers.size < 2) {
      this.offsetX -= (deltaX * sensitivity) / this.zoom;
      this.offsetY -= (deltaY * sensitivity) / this.zoom;
    }

    this.lastPanX = clientX;
    this.lastPanY = clientY;
  }

  public stopPanning(pointerId: number) {
    if (this.panPointerId !== pointerId) return;

    this.panPointerId = null;
    this.isPanning = false;
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
