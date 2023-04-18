import { _decorator } from "cc";
import { BaseSystem } from "./BaseSystem";
import { SceneManager } from "../Manager";
import { AB_KEY } from "../Data";

const { ccclass } = _decorator;

@ccclass("SceneMainSystem")
export class SceneMainSystem extends BaseSystem {
  private layers = new Map();

  protected onLoad(): void {
    super.onLoad();
    const world = this.entities.get("World");
    const city = this.entities.get("City");
    const floor = this.entities.get("Floor");
    const worldLayer = this.entities.get("WorldLayer");
    const cityLayer = this.entities.get("CityLayer");
    const floorLayer = this.entities.get("FloorLayer");

    this.layers.set("WorldLayer", worldLayer);
    this.layers.set("CityLayer", cityLayer);
    this.layers.set("FloorLayer", floorLayer);

    this.addButtonListen(world, this.hanldeTabChange, this);
    this.addButtonListen(city, this.hanldeTabChange, this);
    this.addButtonListen(floor, this.hanldeTabChange, this);
  }

  private hanldeTabChange(event) {
    this.closeAll();
    const name = event?.currentTarget?.name;
    const layer = this.layers.get(name + "Layer");
    if (!layer) return;
    layer.active = true;
  }

  // 关闭所有
  private closeAll() {
    this.layers.forEach((layer) => {
      layer.active = false;
    });
  }
}
