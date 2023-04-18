import { _decorator, Component } from "cc";
import { Game } from "./Game";
import { ResourceManager, UIManager } from "../Manager";

const { ccclass } = _decorator;

// 代码入口
@ccclass("GameLaunch")
export class GameLaunch extends Component {
  onLoad(): void {
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
}
