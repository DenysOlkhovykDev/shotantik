import { Container, Graphics } from "pixi.js";
import { getPauseButtonPosition } from "@utils/ui-config";

class PauseButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();
  private paused = false;

  static backgroundParams = {
    width: 40,
    height: 40,
  };

  static play = {
    width: 30,
    height: 40,
    color: "#000000",
  };

  static stop = {
    width: 40,
    height: 40,
    color: "#000000",
  };

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.position.set(getPauseButtonPosition().x, getPauseButtonPosition().y);

    this.updateSymbol();
  }

  private createBackground() {
    this.background
      .rect(
        0,
        0,
        PauseButton.backgroundParams.width,
        PauseButton.backgroundParams.height,
      )
      .fill({ alpha: 0 });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "static";

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    this.addChild(this.symbol);
  }

  private togglePause() {
    this.toggle();
    this.updateSymbol();
  }

  private updateSymbol() {
    if (this.isPaused()) {
      this.drawStopSymbol();
    } else {
      this.drawPlaySymbol();
    }
  }

  private drawPlaySymbol() {
    this.symbol.clear();

    this.symbol
      .moveTo(0, 0)
      .lineTo(PauseButton.play.width, PauseButton.play.height / 2)
      .lineTo(0, PauseButton.play.height)
      .closePath()
      .fill({ color: PauseButton.play.color });
  }

  private drawStopSymbol() {
    this.symbol.clear();

    this.symbol
      .rect(0, 0, PauseButton.stop.width / 4, PauseButton.stop.height)
      .rect(
        (PauseButton.stop.width / 4) * 3,
        0,
        PauseButton.stop.width / 4,
        PauseButton.stop.height,
      )
      .fill({ color: PauseButton.stop.color });
  }

  public isPaused() {
    return this.paused;
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
  }

  public toggle() {
    this.paused = !this.paused;
  }
}

export const pauseButton = new PauseButton();
