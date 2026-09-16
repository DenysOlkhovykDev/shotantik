export const gameScreen = {
  width: 720,
  height: 1280,
};

let isGameReady = false;

export function setIsGameReady(value: boolean) {
  isGameReady = value;
}

export function getIsGameReady() {
  return isGameReady;
}
