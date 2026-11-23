export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getMiddlePoint(x1: number, y1: number, x2: number, y2: number) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

export function rotatePoint(px: number, py: number, cos: number, sin: number) {
  return {
    x: px * cos - py * sin,
    y: px * sin + py * cos,
  };
}

export function getRandomCoordinate(size: number, modifier: number) {
  return -size + modifier + Math.random() * (size - modifier);
}

export function getRadialPoint(index: number, amount: number, radius: number) {
  const angle = (Math.PI * 2 * index) / amount;

  return {
    angle,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function getRadialLine(
  index: number,
  amount: number,
  startRadius: number,
  endRadius: number,
) {
  const angle = (Math.PI * 2 * index) / amount;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    angle,
    startX: cos * startRadius,
    startY: sin * startRadius,
    endX: cos * endRadius,
    endY: sin * endRadius,
  };
}

export function getRandomPointInRadius(radius: number) {
  const angle = Math.random() * Math.PI * 2;
  const distanceFromCenter = Math.sqrt(Math.random()) * radius;

  const x = Math.cos(angle) * distanceFromCenter;
  const y = Math.sin(angle) * distanceFromCenter;

  return { x, y };
}

export function getAngleDifference(current: number, target: number) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

export function rotatePointByCenter(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  angle: number,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const dx = x - centerX;
  const dy = y - centerY;

  return {
    x: centerX + dx * cos - dy * sin,
    y: centerY + dx * sin + dy * cos,
  };
}

export function transformCoordinatesByHexOddRows(
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
) {
  return {
    y: y * offsetY,
    x: x * offsetX + (y % 2 === 0 ? 0 : offsetX / 2),
  };
}

export function getValueFromCoordinates(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;

  return value - Math.floor(value);
}
