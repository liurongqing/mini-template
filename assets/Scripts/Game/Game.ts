import { Component, Prefab, instantiate } from "cc";
import { ResourceManager, UIManager } from "../Framework/Manager";

export class Game extends Component {
  public static Instance: Game = null;

  onLoad(): void {
    if (Game.Instance === null) {
      Game.Instance = this;
    } else {
      this.destroy();
      return;
    }
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
    ResourceManager.Instance.preload(
      pkg,
      (row, total) => {
        console.log("row", row, total);
      },
      () => {
        // 资源全部加载完成回调
        this.EnterGameScene();
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
  //   start() {}

  //   update(deltaTime: number) {}
}
