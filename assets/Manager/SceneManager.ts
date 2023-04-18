import { Component, find, Node, instantiate, error, warn } from "cc";
import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";

export class SceneManager extends Component {
  private canvas: Node = null;
  public static Instance: SceneManager = null;
  private scenes = new Map();

  protected onLoad(): void {
    if (SceneManager.Instance === null) {
      SceneManager.Instance = this;
    } else {
      this.destroy();
      return;
    }

    this.canvas = find("Canvas");
  }

  // 进入场景, 可以带参数进入
  public sceneStart(sceneName: string, data?: any, parent = this.canvas) {
    console.log("start", sceneName);
    this.sceneClear();
    const scene = this.scenes.get(sceneName);
    if (scene) {
      scene.active = true;
      return;
    }
    console.log("挂载新的", sceneName);
    const prefab = ResourceManager.Instance.getAsset(AB_KEY.ENTITY, sceneName);
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
    console.log(this.scenes);
  }

  // 关闭一个场景
  public sceneStop(sceneName, force = false) {
    const scene = this.scenes.get(sceneName);
    console.log("停止一个场景 ", sceneName, scene);
    if (scene) {
      if (force) {
        this.scenes.delete(sceneName);
        // scene.destroy();
        scene.removeFromParent()
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
