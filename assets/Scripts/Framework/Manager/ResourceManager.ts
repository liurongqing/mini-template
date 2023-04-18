import {
  AssetManager,
  Component,
  Prefab,
  SpriteFrame,
  assetManager,
  log,
} from "cc";
import { IAsset, IAssetType } from "../../Data";

interface IParamUpdate {
  (now: number, total: number): void;
}

interface IParamComplete {
  (): void;
}

export class ResourceManager extends Component {
  private totalAb = 0; // ab 包数量
  private nowAb = 0; // 当前下载好的数量

  private total = 0; // 资源总数量
  private now = 0; // 当前下载完成的资源数量

  private abBunds: any = {};
  private progressFunc: any = null;
  private endFunc: any = null;

  public static Instance: ResourceManager = null;
  onLoad(): void {
    if (ResourceManager.Instance === null) {
      ResourceManager.Instance = this;
    } else {
      this.destroy();
      return;
    }
  }

  private loadAssetsBundle(abName: string, endFunc: any): void {
    assetManager.loadBundle(abName, (err, bundle) => {
      if (err !== null) {
        console.log("[ResMgr]:Load AssetsBundle Error: " + abName);
        this.abBunds[abName] = null;
      } else {
        console.log("[ResMgr]:Load AssetsBundle Success: " + abName);
        this.abBunds[abName] = bundle;
      }
      if (endFunc) {
        endFunc();
      }
    });
  }

  private loadRes(abBundle: any, url: any, typeClasss: any): void {
    abBundle.load(url, typeClasss, (error: any, asset: any) => {
      this.now++;
      if (error) {
        console.log("load Res " + url + " error: " + error);
      } else {
        console.log("load Res " + url + " success!");
      }

      this.progressFunc?.(this.now, this.total);

      // console.log(this.now, this.total);
      if (this.now >= this.total) {
        if (this.endFunc !== null) {
          this.endFunc();
        }
      }
    });
  }

  private loadAssetsInAssetsBundle(resPkg: any): void {
    for (const key in resPkg) {
      const urlSet = resPkg[key].urls;
      const typeClass = resPkg[key].assetType;

      for (let i = 0; i < urlSet.length; i++) {
        this.loadRes(this.abBunds[key], urlSet[i], typeClass);
      }
    }
  }

  // var pkg = {GUI: {assetType: cc.Prefab, urls: ["", "", ""] }};
  public preloadResPkg(resPkg: any, progressFunc: any, endFunc: any): void {
    this.totalAb = 0;
    this.nowAb = 0;

    this.total = 0;
    this.now = 0;

    this.progressFunc = progressFunc;
    this.endFunc = endFunc;

    for (const key in resPkg) {
      this.totalAb++;
      this.total += resPkg[key].urls.length;
    }

    for (const key in resPkg) {
      this.loadAssetsBundle(key, () => {
        this.nowAb++;
        if (this.nowAb === this.totalAb) {
          this.loadAssetsInAssetsBundle(resPkg);
        }
      });
    }
  }

  public unloadRes(resPkg: any): void {
    console.log("unload...");
  }

  // 加载所有的 ab 包
  public async loadBundles(
    bundleMap: Map<string, IAsset>,
    onProgress: IParamUpdate,
    onComplete: IParamComplete
  ): Promise<any> {
    this.totalAb = 0;
    this.nowAb = 0;

    this.total = 0;
    this.now = 0;

    // log(bundleMap.get("GUI"))
    const queue = [];
    for (const [abName, asset] of bundleMap) {
      queue.push(
        new Promise((resolve, reject) => {
          assetManager.loadBundle(abName, (err, bundle) => {
            if (err) {
              reject(null,err);
            } else {
              resolve({
                bundle,
                asset,
              });
            }
          });
        })
      );
      // 加载完所有的 ab 包
      const bundles = await Promise.all(queue);
      for (const { bundle, asset } of bundles) {
        this.loadAsset(bundle, asset);
      }
    }
  }

  // 加载单个 ab 包下的所有资源
  private async loadAsset(bundle: AssetManager.Bundle, asset: IAsset) {
    const urls = asset.urls;
    // log(asset.type)

    urls.forEach((url: string) => {
      bundle.load(url, asset.type, function (err, data) {
        console.log("2...", data);
      });
      // bundle.load(url, asset.type, (err, asset) => {
      //   console.log("2...");
      // });
    });
    log(bundle, asset);
  }

  // public prelaodRes(
  //   abName: string,
  //   url: string,
  //   progressFunc: Function,
  //   endFunc: Function
  // ): void {}

  public getAsset(abName: string, resUrl: string): any {
    const bondule = assetManager.getBundle(abName);
    if (bondule === null) {
      console.log("[error]: " + abName + " AssetsBundle not loaded !!!");
      return null;
    }
    return bondule.get(resUrl);
  }
}
