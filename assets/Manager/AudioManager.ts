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
import { ResourceManager } from "./ResourceManager";
import { AB_KEY } from "../Data";

export class AudioManager extends Component {
  public static instance: AudioManager = null;
  private _audioSource: AudioSource; // 音频组件
  private audioCache = new Map(); // 缓存音频

  onLoad(): void {
    if (AudioManager.instance === null) {
      AudioManager.instance = this;
    } else {
      this.destroy();
      return;
    }

    // 创建一个节点
    const audioNode = new Node("__audioNode__");

    // 添加节点到场景
    director.getScene().addChild(audioNode);

    // 标记为常驻节点
    director.addPersistRootNode(audioNode);

    // 添加 AudioSource 组件，用来播放音频
    this._audioSource = audioNode.addComponent(AudioSource);
  }

  // 获取当前音频组件
  get audioSource() {
    return this._audioSource;
  }

  // 播放背景音乐
  play(
    sound: AudioClip | string,
    {
      volume = 1.0,
      loop = false,
      fadeIn = false,
      fadeInTime = 2,
      fadeInEasing = "quadIn" as TweenEasing,
    }
  ) {
    console.log("play before");
    // console.log("play after", sound);
    if (sound instanceof AudioClip) {
      log("sound instanceof AudioClip");
      this._audioSource.clip = sound;
      this._audioSource.play();
      this._audioSource.loop = loop;
      this._audioSource.volume = volume;
    } else {
      let clip = this.audioCache.get(sound);
      log("缓存中的clip", clip);
      if (!clip) {
        clip = ResourceManager.instance.getAsset(
          AB_KEY.AUDIO,
          sound,
          AudioClip
        );
        this.audioCache.set(sound, clip);
        log("资源读取中的clip", clip);
      }

      this._audioSource.clip = clip;
      this._audioSource.play();
      // 淡入
      if (fadeIn || fadeInTime || fadeInEasing) {
        tween(this._audioSource)
          .set({ volume: 0 })
          .to(fadeInTime, { volume }, { easing: fadeInEasing })
          .start();
      } else {
        this._audioSource.volume = volume;
      }
    }
  }

  // 播放音效
  playOneShot(sound: AudioClip | string, volume = 1.0) {
    if (sound instanceof AudioClip) {
      this._audioSource.playOneShot(sound, volume);
    } else {
      let clip = this.audioCache.get(sound);
      log("缓存中的clip", clip);
      if (!clip) {
        clip = ResourceManager.instance.getAsset(
          AB_KEY.AUDIO,
          sound,
          AudioClip
        );
        this.audioCache.set(sound, clip);
        log("资源读取中的clip", clip);
      }
      this._audioSource.playOneShot(clip, volume);
    }
  }

  // 停止播放
  stop({
    fadeOut = false,
    fadeOutTime = 2,
    fadeOutEasing = "quadIn" as TweenEasing,
  }) {
    if (fadeOut || fadeOutTime || fadeOutEasing) {
      // 淡出
      tween(this._audioSource)
        .to(fadeOutTime, { volume: 0 }, { easing: fadeOutEasing })
        .call(() => {
          this._audioSource.stop();
        })
        .start();
    }
  }

  // 暂停播放
  pause() {
    this._audioSource.pause();
  }

  // 恢复播放
  resume() {
    this._audioSource.play();
  }
}
