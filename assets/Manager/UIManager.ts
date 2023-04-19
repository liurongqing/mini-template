import { Button, Component, isValid, Input, find, Node, instantiate } from "cc";
import { ResourceManager } from "./ResourceManager";

export class UIManager extends Component {
  private canvas: Node = null;
  public static instance: UIManager = null;
  private uiMap = {};

  protected onLoad(): void {
    if (UIManager.instance === null) {
      UIManager.instance = this;
    } else {
      this.destroy();
      return;
    }

    this.canvas = find("Canvas");
  }

  public show_ui(ui_name, parent = this.canvas): Node {
    const prefab = ResourceManager.instance.getAsset("GUI", "UIPrefabs/UIGame");
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
