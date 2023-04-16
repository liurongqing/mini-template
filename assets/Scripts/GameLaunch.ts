import { _decorator, Component, Node } from "cc";
import { Game } from "./Game/Game";
import { ResourceManager, UIManager } from "./Framework/Manager";

const { ccclass, property } = _decorator;

// 代码入口
@ccclass("GameLaunch")
export class GameLaunch extends Component {
  onLoad(): void {
    // 初始化网络管理、日志管理、声音管理等等

    // 资源管理
    this.node.addComponent(ResourceManager);
    // UI 管理
    this.node.addComponent(UIManager);

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
