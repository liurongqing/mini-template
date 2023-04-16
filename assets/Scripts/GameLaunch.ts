import { _decorator, Component, Node } from "cc";
import { Game } from "./Game/Game";

const { ccclass, property } = _decorator;

// 代码入口
@ccclass("GameLaunch")
export class GameLaunch extends Component {
  onLoad(): void {
    // 初始化资源管理、ui管理、网络管理、日志管理、声音管理等等

    // 初始化游戏逻辑代码
    this.node.addComponent(Game);
  }

  start() {
    // 检查资源更新

    // 进入游戏代码的逻辑
    Game.Instance.GameStart();
  }

  //   update(deltaTime: number) {}
}
