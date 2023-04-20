import { AudioClip, Prefab, SpriteAtlas, SpriteFrame } from "cc";

// 常量 key
export const AB_KEY = {
  ENTITY: "Entity",
  ENTITY_SCENE_HOME: "SceneHome",
  ENTITY_SCENE_MAIN: "SceneMain",
  ENTITY_SCENE_ROCK_CANDY: "SceneRockCandy",
  ENTITY_POPUP_CONFIRM: "PopupConfirm",
  ENTITY_POPUP_MODAL: "PopupModal",
  GUI: "GUI",
  GUI_STICKS_ATLAS: "sticks",
  AUDIO: "Audio",
  AUDIO_BACKGROUND: "background",
  AUDIO_CLICK: "click",
  // GUI_BACKGROUND: "background",
  // GUI_BTN_GREEN: "btn_green2",
  // GUI_LOGO: "logo",
};

export type IAssetType =
  | typeof Prefab
  | typeof SpriteAtlas
  | typeof SpriteFrame
  | typeof AudioClip;

interface IAsset {
  type: IAssetType;
  urls: string[];
}

export const Bundles = new Map<string, Array<IAsset>>([
  [
    AB_KEY.ENTITY,
    [
      {
        type: Prefab,
        urls: [
          AB_KEY.ENTITY_SCENE_HOME,
          AB_KEY.ENTITY_SCENE_MAIN,
          AB_KEY.ENTITY_SCENE_ROCK_CANDY,
          AB_KEY.ENTITY_POPUP_CONFIRM,
          AB_KEY.ENTITY_POPUP_MODAL,
        ],
      },
    ],
  ],
  [
    AB_KEY.GUI,
    [
      {
        type: SpriteAtlas,
        urls: [AB_KEY.GUI_STICKS_ATLAS],
      },
    ],
  ],
  [
    AB_KEY.AUDIO,
    [
      {
        type: AudioClip,
        urls: [AB_KEY.AUDIO_BACKGROUND, AB_KEY.AUDIO_CLICK],
      },
    ],
  ],
]);
