import { _decorator } from "cc";
import { BaseSystem } from "./BaseSystem";
import {
  AudioManager,
  DataManager,
  MiniManager,
  SceneManager,
} from "../Manager";
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

    MiniManager.instance.createBannerAd();
  }

  private onGameStartClick = throttle(() => {
    // AudioManager.instance.play(AB_KEY.AUDIO_BACKGROUND, {});
    // AudioManager.instance.playOneShot(AB_KEY.AUDIO_CLICK);
    // console.log("AudioManager.instance", AudioManager);
    // console.log("点击开始游戏", event);
    // SceneManager.instance.sceneStop(AB_KEY.ENTITY_SCENE_HOME);
    // SceneManager.instance.sceneStart(AB_KEY.ENTITY_SCENE_MAIN);
    // SceneManager.instance.sceneStart(AB_KEY.ENTITY_SCENE_MAIN);
  });
}
