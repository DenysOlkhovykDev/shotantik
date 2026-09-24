import { type Graphics, type Container, Rectangle } from "pixi.js";
import { app } from "../main";

export function generateTextureFromOrigin(target: Container) {
  const bounds = target.getLocalBounds();

  const left = Math.floor(bounds.minX);
  const top = Math.floor(bounds.minY);
  const right = Math.ceil(bounds.maxX);
  const bottom = Math.ceil(bounds.maxY);
  const width = Math.max(right - left, 1);
  const height = Math.max(bottom - top, 1);

  return app.renderer.generateTexture({
    target,
    frame: new Rectangle(left, top, width, height),
    defaultAnchor: {
      x: -left / width,
      y: -top / height,
    },
  });
}

export function makeBasicCircle(
  graphic: Graphics,
  size: number,
  color: string,
  isStroke: boolean,
) {
  makeCircle(0, 0, graphic, size, color, isStroke);
}

export function makeCircle(
  x: number,
  y: number,
  graphic: Graphics,
  size: number,
  color: string,
  isStroke: boolean,
) {
  graphic.circle(x, y, size);
  if (isStroke) {
    graphic.stroke({ width: 3, color: "#000000" });
  }
  graphic.fill(color);
}

export function makeGear(
  graphics: Graphics,
  teeth: number,
  innerRadius: number,
  outerRadius: number,
  baseColor: string,
  strokeWidth: number,
  centerRadius: number,
  centerColor: string,
) {
  const angleOffset = Math.PI / 10.5;

  const points: number[] = [];

  for (let i = 0; i < teeth; i++) {
    const baseAngle = (i / teeth) * Math.PI * 2;

    const step = (Math.PI * 2) / teeth;

    let angle = baseAngle;
    points.push(
      Math.cos(angle + angleOffset) * outerRadius,
      Math.sin(angle + angleOffset) * outerRadius,
    );

    angle = baseAngle + step * 0.3;
    points.push(
      Math.cos(angle + angleOffset) * outerRadius,
      Math.sin(angle + angleOffset) * outerRadius,
    );

    angle = baseAngle + step * 0.65;
    points.push(
      Math.cos(angle + angleOffset) * innerRadius,
      Math.sin(angle + angleOffset) * innerRadius,
    );
  }

  graphics
    .poly(points)
    .fill(baseColor)
    .stroke({ width: strokeWidth, color: "#000000" });

  graphics.circle(0, 0, centerRadius).fill(centerColor);
}

export function makeBrighterColor(color: string, variation: number): string {
  const value = parseInt(color.slice(1), 16);

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  const newR = Math.max(0, Math.min(255, r + variation));
  const newG = Math.max(0, Math.min(255, g + variation));
  const newB = Math.max(0, Math.min(255, b + variation));

  return `#${((newR << 16) | (newG << 8) | newB)
    .toString(16)
    .padStart(6, "0")}`;
}

export function drawHex(
  graphic: Graphics,
  x: number,
  y: number,
  radius: number,
) {
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;

    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;

    if (i === 0) {
      graphic.moveTo(px, py);
    } else {
      graphic.lineTo(px, py);
    }
  }

  graphic.closePath();
}
