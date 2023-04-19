/**
 * 确认提示框的逻辑
 */
import { _decorator, Node } from "cc";
import { SceneManager, PopupManager, OpenOption } from "../Manager";
import { AB_KEY } from "../Data";
import { throttle } from "../Utils";
import { PopupBaseSystem } from "./PopupBaseSystem";

const { ccclass } = _decorator;

@ccclass("PopupConfirmSystem")
export class PopupConfirmSystem extends PopupBaseSystem {
  protected onLoad(): void {
    super.onLoad();
    // console.log("confirm", this.entities);
    const mainNode: Node = this.entities.get("Main");
    const closeNode = mainNode.getChildByName("Close");
    this.addButtonListen(closeNode, this.onClose, this);
  }

  private onClose = () => {
    PopupManager.instance.close();
    console.log("click close...");
  };

  protected afterOpen(): void {
    console.log("confirm after open");
  }

  protected afterClose(suspended: any): void {
    console.log("confirm after close");
  }

  protected init(options: OpenOption) {
    console.log("初始化...init popup confirm system", options);
  }

  protected updateDisplay(options: OpenOption): void {
    console.log("初始化...updateDisplay popup confirm system ", options);
  }
}
