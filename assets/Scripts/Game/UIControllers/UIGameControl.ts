import { _decorator, Label } from "cc";
import { UIControl } from "./UIControl";

const { ccclass } = _decorator;

@ccclass("UIGameControl")
export class UIGameControl extends UIControl {
  private versionLabel: Label = null;
  onLoad() {
    super.onLoad();

    this.versionLabel = this.view["Version"].getComponent(Label);
    this.versionLabel.string = "2.0.0";

    this.add_button_listen("GameStart", this, this.onGameStartClick);
  }

  private onGameStartClick() {
    console.log("click start");
  }
}
