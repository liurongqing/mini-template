import { Component, Button, Input } from "cc";

export class UIControl extends Component {
  protected view = {};

  protected onLoad(): void {
    this.view = {};
    this.load_all_object(this.node, "");
  }

  load_all_object(root, path) {
    for (let i = 0; i < root.children.length; i++) {
      this.view[path + root.children[i].name] = root.children[i];
    }
  }

  public add_button_listen(view_name, caller, func) {
    const view_node = this.view[view_name];
    if (!view_node) return;
    const button = view_node.getComponent(Button);
    if (!button) return;
    view_node.on(Input.EventType.TOUCH_START, func, caller);
  }
}
