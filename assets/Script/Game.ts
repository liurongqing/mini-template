import {
  Component,
  Prefab,
  instantiate,
  find,
  Node,
  ProgressBar,
  log,
} from "cc";
import { ResourceManager, SceneManager } from "../Manager";
import { Bundles, AB_KEY } from "../Data";

export class Game extends Component {
  public static Instance: Game = null;
  private canvas: Node = null;
  private progressBar: ProgressBar = null;

  onLoad(): void {
    if (Game.Instance === null) {
      Game.Instance = this;
    } else {
      this.destroy();
      return;
    }

    this.canvas = find("Canvas");
    this.progressBar = this.canvas
      .getChildByName("Preloading")
      .getComponent(ProgressBar);
    console.log("this.progressBar", this.progressBar);
  }

  // 游戏开始入口
  public GameStart(): void {
    console.log("Game Start...", Bundles);
    ResourceManager.Instance.loadBundles(
      Bundles,
      this.onProgress,
      this.onComplete
    );
  }

  // 进度条
  private onProgress = (now, total) => {
    console.log(now, total);
    // console.log("this.progressBar", this?.progressBar);
    // this.progressBar.progress = now / total;
  };

  // 加载完成
  private onComplete() {
    console.log("加载成功");
    // this.canvas?.destroyAllChildren();
    // this.EnterGakmeScene();
  }

  public EnterGameScene(): void {
    // 检查更新
    // 进入场景
    // SceneManager.Instance.sceneStart(AB_KEY.ENTITY_SCENE_HOME);
  }
}
