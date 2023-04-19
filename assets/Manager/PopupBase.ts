import {
  _decorator,
  Component,
  Node,
  Vec3,
  Vec2,
  tween,
  TweenEasing,
  BlockInputEvents,
  UIOpacity,
  log,
} from "cc";
import { DEV } from "cc/env";

const { ccclass, property } = _decorator;

export abstract class PopupBase extends Component {
  @property({ type: Node, tooltip: DEV && "背景层" })
  background: Node = null;

  @property({ type: Node, tooltip: DEV && "主体层" })
  main: Node = null;

  private animDuration = 0.4; // 动画时长

  protected blocker: Node = null; // 拦截点击的节点
  protected options: any = null; // 弹窗选项

  show(options: any, duration = this.animDuration) {
    console.log("base show...");
    return new Promise((resolve) => {
      this.options = options;
      const background = this.background,
        main = this.main;

      background.addComponent(BlockInputEvents);

      this.init(options);
      this.updateDisplay(options);

      const backgroundUI = background.getComponent(UIOpacity);
      backgroundUI.opacity = 200;
      tween(backgroundUI)
        .to(duration * 0.5, { opacity: 200 })
        .start();

      const mainUI = main.getComponent(UIOpacity);
      tween(main)
        .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" })
        .start();

      tween(mainUI)
        .to(duration, { opacity: 255 }, { easing: "backOut" })
        .call(() => {
          // 弹窗已完全展示
          this.onShow?.();
          resolve(true);
        })
        .start();
    });
  }

  /**
   *  隐藏弹窗
   * @param suspended 是否挂起
   * @param duration 动画时长
   */
  hide(suspended = false, duration = this.animDuration) {
    return new Promise((resolve) => {
      const backgroundUI = this.background.getComponent(UIOpacity);
      tween(backgroundUI)
        .delay(duration * 0.2)
        .to(duration * 0.8, { opacity: 0 })
        .start();

      const mainUI = this.main.getComponent(UIOpacity);

      tween(this.main)
        .to(duration, { scale: new Vec3(0.5, 0.5, 1) }, { easing: "backIn" })
        .start();

      tween(mainUI)
        .to(duration, { opacity: 0 }, { easing: "backIn" })
        .call(() => {
          this.onHide?.();
          resolve(true);
          this.finishCallback?.(suspended);
        })
        .start();
    });
  }

  // 弹窗已完全显示
  onShow() {
    console.log("已经全部展示了");
  }

  // 弹窗已完全隐藏
  onHide(suspended?: boolean) {
    console.log("已经全部隐藏了");
    // 销毁拦截事件节点
    const background = this.background;
    const blocker = background.getComponent(BlockInputEvents);
    blocker?.destroy();
  }

  // 初始化
  protected abstract init(options: any): void;

  // 更新样式
  protected abstract updateDisplay(options: any): void;

  // 结束回调
  protected finishCallback(suspended: boolean) {
    console.log("结束回调 popupbase");
  }

  // 设置结束回调
  protected setFinishCallback(callback: (suspended) => void) {
    this.finishCallback = callback;
  }
}
