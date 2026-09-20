import { Container } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

export class shadowFilter extends Container {
  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  private basicShadowFilter = new DropShadowFilter({
    color: "#000000",
    alpha: 0.5,
    offset: { x: 0, y: 0 },
  });

  private selectShadowFilter = new DropShadowFilter({
    color: "#00ff00",
    alpha: 0.8,
    offset: { x: 0, y: 0 },
  });

  public createSelectShadow(source: Container) {
    source.filters = [this.basicShadowFilter, this.selectShadowFilter];
  }

  public removeSelectShadow(source: Container) {
    source.filters = [this.basicShadowFilter];
  }

  public addBasicShadowFilter(source: Container) {
    source.filters = [this.basicShadowFilter];
  }
}
