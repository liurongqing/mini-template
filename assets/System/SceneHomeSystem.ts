import { _decorator } from "cc";
import { BaseSystem } from "./BaseSystem";

const { ccclass } = _decorator;

@ccclass("SceneHomeSystem")
export class SceneHomeSystem extends BaseSystem {
  protected onLoad(): void {
    super.onLoad();

    this.addButtonListen(
      this.entities.get("GameStart"),
      this.onGameStartClick,
      this
    );
  }

  private onGameStartClick() {
    console.log("点击了");
  }

  //   start() {
  //     console.log("2...");
  //   }
}
