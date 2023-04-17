import { Component, Prefab, instantiate, find, Node, ProgressBar } from "cc";
import { ResourceManager, UIManager } from "../Framework/Manager";

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
    console.log("game start...");

    const pkg = {
      GUI: {
        type: Prefab,
        urls: ["UIPrefabs/UIGame"],
      },
    };

    // 做一个进度条的界面
    ResourceManager.Instance.preloadResPkg(
      pkg,
      (row: number, total: number) => {
        console.log("进度 ", row + "/" + total);
        const per = row / total;
        this.progressBar.progress = per;
      },
      () => {
        // 资源全部加载完成回调
        // 无效
        this.canvas?.removeAllChildren();
        // this.EnterGameScene();
        // console.log("全部加载完成了");
      }
    );
  }

  public EnterGameScene(): void {
    // 置放游戏地图

    // 置放角色

    // 置放UI
    UIManager.Instance.show_ui("UIGame");

    // UIManager.Instance.show_ui("UIGame");
    // const uiGamePrefab = ResourceManager.Instance.getAsset(
    //   "GUI",
    //   "UIPrefabs/UIGame"
    // );
    // const uigame = instantiate(uiGamePrefab);
    // this.node.addChild(uigame);
    // 通过代码置放我们的资源
  }
}
