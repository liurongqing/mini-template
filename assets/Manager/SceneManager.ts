import { Component, find, Node, instantiate, error, warn, log } from "cc";
import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";
import { DataManager } from "./DataManager";

export class SceneManager extends Component {
  private canvas: Node = null;
  public static instance: SceneManager = null;
  private scenes = new Map();

  protected onLoad(): void {
    if (SceneManager.instance === null) {
      SceneManager.instance = this;
    } else {
      this.destroy();
      return;
    }

    this.canvas = find("Canvas");
  }

  // 进入场景, 可以带参数进入
  public sceneStart(sceneName: string, data?: any, parent = this.canvas) {
    // 没有传参则为空，不需要加判断
    DataManager.instance.sceneParams = data;
    
    this.sceneClear();
    const scene = this.scenes.get(sceneName);
    if (scene) {
      scene.active = true;
      return;
    }
    log("挂载新的场景", sceneName);
    const prefab = ResourceManager.instance.getAsset(AB_KEY.ENTITY, sceneName);
    if (!prefab) {
      error(
        `进入场景失败, 没有读取到 ${sceneName} 场景，可能资源名字错了，也有可能没有加载这个资源`
      );
      return;
    }
    const item = instantiate(prefab);
    parent.addChild(item);
    try {
      item.addComponent(sceneName + "System");
    } catch (err) {
      warn(`没有创建 ${sceneName + "System.ts"} 文件，在你意料之中，则忽略`);
    }
    this.scenes.set(sceneName, item);
  }

  // 关闭一个场景
  public sceneStop(sceneName, force = false) {
    const scene = this.scenes.get(sceneName);
    log("停止一个场景 ", sceneName, scene);
    if (scene) {
      if (force) {
        this.scenes.delete(sceneName);
        scene.removeFromParent();
      }
      scene.active = false;
      return;
    }
  }

  public sceneRestart(sceneName) {
    this.sceneStop(sceneName, true);
    this.sceneStart(sceneName);
  }

  // 清空场景
  private sceneClear() {
    this.scenes.forEach((scene) => {
      scene.active = false;
    });
  }

  public addEntity() {
    // console.log
  }
}
