import { BlurFilter, Container, Graphics, Sprite } from "pixi.js";

export class BackgroundDisplay extends Container {
  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  constructor() {
    super();

    this.addChild(this.shadowContainer);
    this.addChild(this.selectShadowContainer);
  }

  public createSelectShadow(radius: number) {
    this.createRoundShadow(radius, "#00ff00", this.selectShadowContainer);
  }

  public removeSelectShadow() {
    this.selectShadowContainer.removeChildren();
  }

  public createShadow(source: Container) {
    this.shadowContainer.removeChildren();

    const shadow1 = this.cloneContainer(source);
    const shadow2 = this.cloneContainer(source);
    const shadow3 = this.cloneContainer(source);

    shadow1.tint = "#000000";
    shadow1.alpha = 0.4;
    shadow1.scale = 1.03;

    shadow2.tint = "#000000";
    shadow2.alpha = 0.2;
    shadow2.scale = 1.05;

    shadow3.tint = "#000000";
    shadow3.alpha = 0.1;
    shadow3.scale = 1.07;

    this.shadowContainer.addChild(shadow1);
    this.shadowContainer.addChild(shadow2);
    this.shadowContainer.addChild(shadow3);
  }

  private cloneContainer(source: Container) {
    let clone;

    if (source instanceof Sprite) {
      clone = new Sprite(source.texture);
    } else if (source instanceof Graphics) {
      clone = source.clone();
    } else {
      clone = new Container();
    }

    clone.position.copyFrom(source.position);
    clone.scale.copyFrom(source.scale);
    clone.pivot.copyFrom(source.pivot);
    clone.rotation = source.rotation;
    clone.alpha = source.alpha;
    clone.visible = source.visible;

    if (source.children && source.children.length > 0) {
      source.children.forEach((child) => {
        clone.addChild(this.cloneContainer(child));
      });
    }

    return clone;
  }

  public createBasicShadow(radius: number) {
    this.createRoundShadow(radius, "#000000", this.shadowContainer);
  }

  private createRoundShadow(
    radius: number,
    color: string,
    shadowContainer: Container,
  ) {
    const shadow = new Graphics();

    shadow.circle(0, 0, radius + 2).stroke({ width: 1, color: color });

    shadow.alpha = 0.6;

    const shadow2 = new Graphics();

    shadow2.circle(0, 0, radius + 3).stroke({ width: 1, color: color });

    shadow2.alpha = 0.3;

    const shadow3 = new Graphics();

    shadow3.circle(0, 0, radius + 4).stroke({ width: 1, color: color });

    shadow3.alpha = 0.1;

    shadowContainer.addChildAt(shadow, 0);
    shadowContainer.addChildAt(shadow2, 0);
    shadowContainer.addChildAt(shadow3, 0);
  }
}
