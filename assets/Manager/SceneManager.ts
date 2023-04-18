import { Component, find, Node, instantiate } from "cc";
import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";

export class SceneManager extends Component {
  private canvas: Node = null;
  public static Instance: SceneManager = null;
  private uiMap = {};

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
    const prefab = ResourceManager.Instance.getAsset(
      AB_KEY.ENTITY,
      AB_KEY.ENTITY_SCENE_HOME
    );
    if (prefab) {
      const item = instantiate(prefab);
      parent.addChild(item);
      item.addComponent(sceneName + "System");
    }
  }

  //
  public stop() {
    // 停止并销毁场景
  }

  public show_ui(ui_name, parent = this.canvas): Node {
    const prefab = ResourceManager.Instance.getAsset("GUI", "UIPrefabs/UIGame");
    console.log("prefab", prefab, parent);
    let item = null;
    if (prefab) {
      item = instantiate(prefab);
      console.log("parent", parent);
      parent.addChild(item);
      item.addComponent(ui_name + "Control");
    }

    this.uiMap[ui_name] = item;
    return item;
  }

  public remove_ui(ui_name) {
    if (this.uiMap[ui_name]) {
      this.uiMap[ui_name].removeFromParent();
      this.uiMap[ui_name] = null;
    }
  }

  public clearAll() {
    for (const key in this.uiMap) {
      if (this.uiMap[key]) {
        this.uiMap[key].removeFromParent();
        this.uiMap[key] = null;
      }
    }
  }
}
