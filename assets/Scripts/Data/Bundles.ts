import { Prefab, SpriteFrame } from "cc";

export type IAssetType = typeof Prefab | typeof SpriteFrame;

export interface IAsset {
  type: IAssetType;
  urls: string[];
}

export const Bundles = new Map<string, IAsset>([
  [
    "GUI",
    {
      type: Prefab,
      urls: ["UIPrefabs/UIGame"],
    },
  ],
]);
