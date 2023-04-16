import { _decorator, Component, Node } from "cc";

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
  }

  //   start() {}

  //   update(deltaTime: number) {}
}
