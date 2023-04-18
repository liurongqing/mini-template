import { _decorator } from "cc";
import { BaseSystem } from "./BaseSystem";
import { SceneManager } from "../Manager";
import { AB_KEY } from "../Data";
import { throttle } from "../Utils";

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

  private onGameStartClick = throttle((event) => {
    // console.log("点击开始游戏", event);
    // SceneManager.Instance.sceneStop(AB_KEY.ENTITY_SCENE_HOME);
    // SceneManager.Instance.sceneStart(AB_KEY.ENTITY_SCENE_MAIN);
    // SceneManager.Instance.sceneStart(AB_KEY.ENTITY_SCENE_MAIN);
  });
}
