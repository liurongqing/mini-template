import { Component } from "cc";

export class DataManager extends Component {
  public static instance: DataManager = null;
  private _sceneParams = {};

  // 场景参数
  get sceneParams() {
    return this._sceneParams;
  }

  set sceneParams(data) {
    this._sceneParams = data;
  }

  onLoad(): void {
    if (DataManager.instance === null) {
      DataManager.instance = this;
    } else {
      this.destroy();
      return;
    }
  }
}
