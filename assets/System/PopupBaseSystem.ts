/**
 * 确认提示框的逻辑
 */
import {
  BlockInputEvents,
  UIOpacity,
  Node,
  Vec3,
  _decorator,
  tween,
  v3,
  log,
} from "cc";
import { DEV } from "cc/env";
import { BaseSystem } from "./BaseSystem";
import { SceneManager, OpenOption, AnimType } from "../Manager";
import { AB_KEY } from "../Data";
import { throttle } from "../Utils";

const { ccclass, property } = _decorator;

export class PopupBaseSystem extends BaseSystem {
  private mask: Node = null;
  private main: Node = null;
  private animType: AnimType = AnimType.SCALE;
  private animDuration;
  protected onLoad(): void {
    super.onLoad();

    this.mask = this.entities.get("Mask");
    this.main = this.entities.get("Main");
  }

  // 打开弹窗
  public open(options: OpenOption) {
    return new Promise((resolve) => {
      const { animDuration, animType } = options;
      this.animType = animType;
      this.animDuration = animDuration;

      this.node.active = true;

      this.init(options);
      this.updateDisplay(options);

      // 不存在  block 时才添加
      const block = this.mask.getComponent(BlockInputEvents);
      if (!block) {
        this.mask.addComponent(BlockInputEvents);
      }

      if (animType === AnimType.FADE) {
        let mainOpacity = this.main.getComponent(UIOpacity);
        if (!mainOpacity) {
          mainOpacity = this.main.addComponent(UIOpacity);
        }
        tween(mainOpacity)
          .set({ opacity: 0.25 })
          .to(animDuration, { opacity: 255 })
          .call(() => {
            log("成功处理透明度")
            this.afterOpen();
            resolve(options);
          })
          .start();
      } else {
        tween(this.main)
          .set({ scale: v3(0.25, 0.25, 1) })
          .to(animDuration, { scale: v3(1, 1, 1) }, { easing: "backOut" })
          .call(() => {
            log("成功缩放")
            this.afterOpen();
            resolve(options);
          })
          .start();
      }
    });
  }

  // 关闭弹窗
  public close(suspended = false, cb) {
    return new Promise((resolve) => {
      if (this.animType === AnimType.FADE) {
        let mainOpacity = this.main.getComponent(UIOpacity);
        if (!mainOpacity) {
          mainOpacity = this.main.addComponent(UIOpacity);
        }
        tween(mainOpacity)
          .to(this.animDuration, { opacity: 0 })
          .call(() => {
            this.node.active = false;
            this.afterClose(suspended);
            // cb 函数 manager 需要回调处理数据
            cb?.(suspended);
            resolve(true);
          })
          .start();
      } else {
        tween(this.main)
          .to(
            this.animDuration,
            { scale: v3(0.2, 0.2, 1) },
            { easing: "backIn" }
          )
          .call(() => {
            this.node.active = false;
            this.afterClose(suspended);
            // cb 函数 manager 需要回调处理数据
            cb?.(suspended);
            resolve(true);
          })
          .start();
      }
    });
  }

  // 弹窗完成后回调
  protected afterOpen() {
    // 子类重写这个方法
    // console.log("弹出来了");
  }

  // 弹窗关闭后回调
  protected afterClose(suspended) {
    // 子类重写这个方法
    // console.log("是否被挂起 suspended");
  }

  protected init(options: OpenOption) {
    // 子类重写这个方法，获取参数做处理
  }

  protected updateDisplay(options: OpenOption) {
    // 子类重写这个方法，获取参数对里面具体内容做处理
  }
}
