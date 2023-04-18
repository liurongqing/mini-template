import { AssetManager, Component, assetManager, log, warn, error } from "cc";

interface IParamProgress {
  (now: number, total: number): void;
}

interface IParamComplete {
  (): void;
}

export class ResourceManager extends Component {
  private total = 0; // 资源总数量
  private now = 0; // 当前下载完成的资源数量
  public static Instance: ResourceManager = null;

  onLoad(): void {
    if (ResourceManager.Instance === null) {
      ResourceManager.Instance = this;
    } else {
      this.destroy();
      return;
    }
  }

  // 加载所有的 ab 包
  public async loadBundles(
    bundleMap: Map<string, string[]>,
    onProgress?: IParamProgress,
    onComplete?: IParamComplete
  ): Promise<any> {
    this.total = 0;
    this.now = 0;

    const queue = [];
    for (const [abName, urls] of bundleMap) {
      queue.push(
        new Promise((resolve) => {
          assetManager.loadBundle(abName, (err, bundle) => {
            if (err) {
              error(`加载ab包(${abName})失败1`, err);
              resolve({ err, urls });
            } else {
              log(`加载ab包(${abName})成功`);
              resolve({
                err: null,
                bundle,
                urls,
              });
            }
          });
        })
      );
      // 加载完所有的 ab 包
      const bundles = await Promise.all(queue);
      this.total = bundles.reduce((acc, cur) => acc + cur?.urls?.length, 0);

      for (const { err, bundle, urls } of bundles) {
        this.loadAsset(err, bundle, urls, onProgress, onComplete);
      }
    }
  }

  // 加载单个 ab 包下的所有资源
  private async loadAsset(
    err: Error,
    bundle: AssetManager.Bundle,
    urls: string[],
    onProgress,
    onComplete
  ) {
    if (err) {
      this.now += urls.length;
      return;
    }
    urls.forEach((url: string) => {
      bundle.load(url, (err, data) => {
        this.now++;
        onProgress?.(this.now, this.total);
        if (err) {
          error(`加载ab包(${bundle.name})下的资源(${url})，失败`, err);
          return;
        }
        log(`加载ab包(${bundle.name})下的资源(${url})，成功`);
        if (this.now >= this.total) {
          onComplete?.();
        }
      });
    });
    // log(bundle, asset);
  }

  // 读取资源
  public getAsset(abName: string, url: string): any {
    const bondule = assetManager.getBundle(abName);
    if (!bondule) {
      warn(`加载ab包(${abName})下的资源(${url})，失败`);
      return null;
    }
    return bondule.get(url);
  }
}
