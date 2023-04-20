/**
 * 不同平台小游戏 sdk 统一管理
 */
import {
  Component,
  log,
  TweenEasing,
  Node,
  AudioSource,
  director,
  AudioClip,
  tween,
} from "cc";
import { HTML5, BYTEDANCE, WECHAT } from "cc/env";

import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";
import { ioc } from "../Utils";
import { WechatService, BytedanceService } from "./MiniSdk";

export class MiniManager extends Component {
  public static instance: MiniManager = null;
  private miniService = null;

  onLoad(): void {
    if (MiniManager.instance === null) {
      MiniManager.instance = this;
    } else {
      this.destroy();
      return;
    }

    this.register();

    this.miniService = ioc.use("miniService");
  }

  register() {
    // 根据当前平台，new 不同的数据
    if (WECHAT) {
      ioc.singleton("miniService", () => new WechatService());
    } else if (BYTEDANCE) {
      ioc.singleton("miniService", () => new WechatService());
    }
  }

  createBannerAd() {
    this.miniService.createBannerAd();
  }

  createRewardedVideoAd() {
    //
    this.miniService.createRewardedVideoAd();
  }

  createInterstitialAd() {
    //
    this.miniService.createInterstitialAd();
  }

  createGridAd() {
    //
    this.miniService.createGridAd();
  }
}
