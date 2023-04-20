import {
  AssetManager,
  Component,
  assetManager,
  log,
  warn,
  error,
  SpriteAtlas,
  Prefab,
} from "cc";

import { IAssetType } from "../Data";
interface IParamProgress {
  (now: number, total: number): void;
}

interface IParamComplete {
  (): void;
}

export class ResourceManager extends Component {
  private total = 0; // 资源总数量
  private now = 0; // 当前下载完成的资源数量
  public static instance: ResourceManager = null;

  onLoad(): void {
    if (ResourceManager.instance === null) {
      ResourceManager.instance = this;
    } else {
      this.destroy();
      return;
    }
  }

  // 加载所有的 ab 包
  public async loadBundles(
    bundleMap,
    onProgress?: IParamProgress,
    onComplete?: IParamComplete
  ): Promise<any> {
    this.total = 0;
    this.now = 0;

    const queue = [];
    for (const [abName, asset] of bundleMap) {
      queue.push(
        new Promise((resolve) => {
          assetManager.loadBundle(abName, (err, bundle) => {
            if (err) {
              error(`加载ab包(${abName})失败`, err);
              resolve({ err, asset });
            } else {
              log(`加载ab包(${abName})成功`);
              resolve({
                err: null,
                bundle,
                asset,
              });
            }
          });
        })
      );
    }
    // 加载完所有的 ab 包
    const bundles = await Promise.all(queue);
    this.total = bundles.reduce((acc, cur) => {
      const num =
        cur?.asset?.reduce(
          (subAcc, subCur) => subAcc + (subCur.urls?.length ?? 0),
          0
        ) || 0;
      return acc + num;
    }, 0);

    for (const { err, bundle, asset } of bundles) {
      this.loadAsset(err, bundle, asset, onProgress, onComplete);
    }
  }

  // 加载单个 ab 包下的所有资源
  private async loadAsset(
    err: Error,
    bundle: AssetManager.Bundle,
    asset,
    onProgress,
    onComplete
  ) {
    if (err) {
      // const num = asset?.urls?.reduce((acc,cur)=> acc + cur?.,0)
      const num = asset?.reduce((acc, cur) => acc + cur?.urls?.length ?? 0, 0);
      this.now += num;
      return;
    }
    asset.forEach((item) => {
      item?.urls?.forEach((url) => {
        bundle.load(url, item.type, (err) => {
          this.now++;
          onProgress?.(this.now, this.total);
          if (err) {
            error(
              `加载ab包(${bundle.name})下类型为(${item.type?.name})的资源(${url})，失败`,
              err
            );
            return;
          }
          log(
            `加载ab包(${bundle.name})下类型为(${item.type?.name})的资源(${url})，成功`
          );
          if (this.now >= this.total) {
            // 全部加载完成
            log("全部加载完成");
            onComplete?.();
          }
        });
      });
    });
  }

  // 读取资源
  public getAsset(abName: string, url: string, type: any = Prefab): any {
    const bondule = assetManager.getBundle(abName);
    if (!bondule) {
      warn(`加载ab包(${abName})下类型为(${type?.name})的资源(${url})，失败`);
      return null;
    }
    log("getAsset url: %o, type: %o", url, type?.name);
    return bondule.get(url, type);
  }
}
