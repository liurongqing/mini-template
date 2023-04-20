import { _decorator, Component } from "cc";
import { Game } from "./Game";
import {
  ResourceManager,
  SceneManager,
  PopupManager,
  DataManager,
  AudioManager,
  MiniManager,
} from "../Manager";

const { ccclass } = _decorator;

// 代码入口
@ccclass("GameLaunch")
export class GameLaunch extends Component {
  onLoad(): void {
    console.log("launch");
    // 数据管理
    this.node.addComponent(DataManager);

    // 资源管理
    this.node.addComponent(ResourceManager);

    // 场景管理
    this.node.addComponent(SceneManager);

    // 音频管理
    this.node.addComponent(AudioManager);

    // 弹窗管理
    this.node.addComponent(PopupManager);

    // 小游戏 SDK管理
    this.node.addComponent(MiniManager);

    // 初始化游戏逻辑代码
    this.node.addComponent(Game);
  }

  start() {
    // 检查资源更新

    // 进入游戏代码的逻辑
    Game.instance.GameStart();
  }
}
