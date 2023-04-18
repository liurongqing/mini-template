import { _decorator, Button, Component, Input, Node, warn } from "cc";
const { ccclass, property } = _decorator;

export class BaseSystem extends Component {
  protected entities; // 实体集体

  protected onLoad(): void {
    this.entities = new Map();
    this.loadEntities();
  }

  // 挂载即加载当前节点下所有子实体
  private loadEntities(root = this.node) {
    const children = root.children;
    children.forEach((node) => {
      this.entities.set(node.name, node);
    });
  }

  // 添加按钮事件
  protected addButtonListen(node: Node | string, callback, context) {
    console.log(node);
    if (typeof node === "string") {
      node = this.entities.get(node);
    }

    if (!node) {
      warn("事件添加失败", node);
      return;
    }
    const button = (node as Node).getComponent(Button);
    if (!button) {
      warn("没有添加 button 组件", Button);
      //   button = (node as Node).addComponent(Button);
      //   button.transition = Button.Transition.SCALE;
      return;
    }
    (node as Node).on(Input.EventType.TOUCH_START, callback, context);
  }
}

//
//   public add_button_listen(view_name, caller, func) {
//     const view_node = this.view[view_name];
//     if (!view_node) return;
//     const button = view_node.getComponent(Button);
//     if (!button) return;
//     view_node.on(Input.EventType.TOUCH_START, func, caller);
//   }
// }
