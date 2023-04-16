import { Button, Component, isValid, Input, Node, instantiate } from "cc";
import { ResourceManager } from "./ResourceManager";

export class UIManager extends Component {
  private Canvas: Node = null;
  public static Instance: UIManager = null;
  private uiMap = {};

  protected onLoad(): void {
    if (UIManager.Instance === null) {
      UIManager.Instance = this;
    } else {
      this.destroy();
      return;
    }

    console.log("this.node", this.node);

    this.Canvas = this.node;
    // this.Canvas = this.node.parent;
  }

  public show_ui(ui_name, parent?: Node): Node {
    if (!parent) {
      parent = this.Canvas;
    }

    const prefab = ResourceManager.Instance.getAsset("GUI", "UIPrefabs/UIGame");
    console.log("prefab", prefab, parent);
    let item = null;
    if (prefab) {
      item = instantiate(prefab);
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
