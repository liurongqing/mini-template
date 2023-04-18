import { Button, Component, Input, Node, warn } from "cc";

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
