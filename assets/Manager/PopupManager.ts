/**
 * 弹窗管理
 * 1. 正常弹一个，关一个
 * 2. 弹一个， 再弹一个，同时存在2个   设置： enterQueue 为false,不进入队列，2个同时存在
 * 3. 弹一个，再弹一个进入队列
 * 4. 弹一个，再弹一个，第一个先挂起 设置：immediately为true，则挂起第一个
 */
import {
  Component,
  find,
  Node,
  instantiate,
  warn,
  Prefab,
  isValid,
  log,
} from "cc";
import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";
import { PopupBaseSystem } from "../System";
import { sleep } from "../Utils";

enum CacheMode {
  Normal, // 默认，释放节点，保存预制
  Frequent, // 保留节点，保留预制
}

export enum AnimType {
  SCALE,
  FADE,
}

enum ShowResult {
  Done = 1, // 展示成功（已关闭）
  Failed, // 展示失败（加载失败）
  Waiting, // 等待中（已加入等待队列）
}

export interface OpenOption {
  priority?: number; // 弹窗优先级
  mask?: boolean; // 是否显示遮罩层
  maskClosable?: boolean; // 遮罩层点击是否可关闭
  closable?: boolean; // 是否显示关闭按钮
  animDuration?: number; //动画播放时间
  immediately?: boolean; // 是否强行打入第一个
  interval?: number; // 弹窗间隔
  animType?: AnimType;
  container?: Node; // 挂载的节点
  mode?: CacheMode; // 缓存模式
  enterQueue?: boolean; // 是否进入队列
  params?: any; // 窗口参数
}

export class PopupManager extends Component {
  public static instance: PopupManager = null;
  private canvas: Node = null;
  private interval = 50; // 弹窗之前的间隔， 单位毫秒
  private mask = true; // 是否显示遮罩
  private maskClosable = true; // 点击蒙层是否允许关闭
  private closable = false; // 是否显示右上角的关闭按钮
  private animDuration = 0.4; // 动画播放时间
  private immediately = false; // 默认进入队列即可
  private container: Node = null;
  private mode = CacheMode.Normal; // 缓存模式
  private current = []; // 当前弹窗
  private params = null; // 传参
  private enterQueue = true; // 是否进入队列
  private queueArr = []; // 弹窗的队列
  private suspendedArr = []; // 弹窗的挂起
  private nodeCache = new Map(); // 获取缓存节点
  private animType = AnimType.SCALE;
  // 是否关闭当前弹窗

  protected onLoad(): void {
    if (PopupManager.instance === null) {
      PopupManager.instance = this;
    } else {
      this.destroy();
      return;
    }

    this.canvas = find("Canvas");
  }

  // 弹窗
  public async open(prefab, options: OpenOption = {}) {
    const {
      priority = 0,
      mask,
      maskClosable,
      closable,
      mode = this.mode,
      params,
      interval = this.interval,
      immediately = this.immediately,
      animType = this.animType,
      animDuration = this.animDuration,
      enterQueue = true,
      container = this.canvas,
    } = options;

    this.container = container;
    this.interval = interval;
    this.animType = animType;
    this.animDuration = animDuration;
    // log("this.current", this.current);

    // 有弹窗
    if (this.current.length > 0) {
      if (immediately) {
        // 挂起
        log("挂起");
        await this.suspend();
      } else if (enterQueue) {
        // 进入队列
        log("进队列");
        this.push(prefab);
        return ShowResult.Waiting;
      } else {
        // 弹出来
        log("弹出来");
      }
    }

    // 当前没有窗口展示
    // 获取窗口节点
    const node: Node = this.getNodeFromCache(prefab);

    // 挂载他的逻辑节点
    try {
      node.addComponent(prefab + "System");
    } catch (err) {
      warn(`请创建 ${prefab + "System.ts"} 文件`);
      return ShowResult.Failed;
    }
    // 挂载了这个弹窗节点
    this.container.addChild(node);

    // 上面 node.addComponent(prefab + "System"), 这里才能获取到组件
    const popupBaseSystem = node.getComponent(PopupBaseSystem);

    // 把当前弹窗放在最后一个
    this.current.push({ prefab, priority, popupBaseSystem, mode });

    await popupBaseSystem.open({ animType, animDuration });
    return ShowResult.Done;
  }

  // 读取节点
  private getNodeFromCache(prefab) {
    if (this.nodeCache.has(prefab)) {
      const node = this.nodeCache.get(prefab);
      // 如果有，且节点是有效的则返回
      if (isValid(node)) {
        log("缓存中读到了" + prefab);
        return node;
      }
      this.nodeCache.delete(prefab);
    }

    // 读取预制节点，并实例化
    // const [abName, url] = prefab.split("/");
    const entityPrefab = ResourceManager.instance.getAsset(
      AB_KEY.ENTITY,
      prefab,
      Prefab
    );
    log("entityPrefab 预制体新创建的", entityPrefab);
    const newNode = instantiate(entityPrefab);
    this.nodeCache.set(prefab, newNode);
    return newNode;
  }

  // 关闭
  public close() {
    if (this.current.length > 0) {
      const cur = this.current[this.current.length - 1];
      cur.popupBaseSystem.close(undefined, this.afterClose);
    }
    // this.popupSystem.open({ animType, animDuration, afterOpen, afterClose });
  }

  // 隐藏弹窗后做的一些处理
  protected afterClose = async (suspended: boolean) => {
    console.log("aftef close", suspended);
    if (suspended) return;

    // 当前弹窗是最后一个，弹出去
    const popup = this.current.pop();
    // 回收
    this.recycle(popup.prefab, popup.popupBaseSystem.node, popup.mode);
    await sleep(this.interval);
    this.next();
  };

  // 挂起
  private async suspend() {
    const popup = this.current.pop();
    this.suspendedArr.push(popup);
    await popup.popupBaseSystem.close(true);
  }
  // 进队列
  private push(prefab) {
    // 如果是一样的不添加，  以后要考虑这个prefab要跟参数之类的合并起来不一样，才做处理
    this.queueArr.push({ prefab });
    this.queueArr.sort((a, b) => a.options.priority - b.options.priority);
  }

  // 释放资源
  private recycle(prefab, node: Node, mode: CacheMode) {
    switch (mode) {
      // 正常
      case CacheMode.Normal: {
        this.nodeCache.delete(prefab);
        node.destroy();
        break;
      }
      // 频繁
      case CacheMode.Frequent: {
        break;
      }
    }
  }
  // 弹下一个窗
  private next = () => {
    log("next...");
    if (
      this.current.length > 0 ||
      (this.suspendedArr.length === 0 && this.queueArr.length === 0)
    ) {
      // 如果还有窗口 或者 (挂起没有了且队列没有了)，则不处理
      log(
        "next 时，还有窗口或者没有挂起与队列可弹了 ",
        this.current,
        this.suspendedArr,
        this.queueArr
      );
      return;
    }
    let popup;
    if (this.suspendedArr.length > 0) {
      popup = this.suspendedArr.shift();
    } else {
      popup = this.queueArr.shift();
    }

    if (isValid(popup.popupBaseSystem)) {
      // 挂起的才会进到这里来
      this.current.push(popup);
      this.container.addChild(popup.popupBaseSystem.node);
      // 参数
      popup.popupBaseSystem.open({
        animType: this.animType,
        animDuration: this.animDuration,
      });
      return;
    }

    this.open(popup.prefab);
  };
}
