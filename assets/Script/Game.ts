import {
  Component,
  Prefab,
  instantiate,
  find,
  Node,
  ProgressBar,
  log,
} from "cc";
import { ResourceManager, UIManager } from "../Manager";
import { Bundles } from "../Data";

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
  }

  // 游戏开始入口
  public GameStart(): void {
    console.log("Game Start...");
    ResourceManager.Instance.loadBundles(
      Bundles,
      this.onProgress,
      this.onComplete
    );
  }

  // 进度条
  private onProgress(now, total) {
    this.progressBar.progress = now / total;
  }

  // 加载完成
  private onComplete() {
    this.canvas?.destroyAllChildren();
    this.EnterGameScene();
  }

  public EnterGameScene(): void {
    // 置放游戏地图

    // 置放UI
    UIManager.Instance.show_ui("UIGame");
  }
}
