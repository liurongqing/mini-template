// 常量 key
export const AB_KEY = {
  ENTITY: "Entity",
  ENTITY_SCENE_HOME: "SceneHome",
  ENTITY_SCENE_MAIN: "SceneMain",
  GUI: "GUI",
  GUI_BACKGROUND: "background",
  GUI_BTN_GREEN: "btn_green2",
  GUI_LOGO: "logo",
};

export const Bundles = new Map<string, string[]>([
  [AB_KEY.ENTITY, [AB_KEY.ENTITY_SCENE_HOME, AB_KEY.ENTITY_SCENE_MAIN]],
  // [AB_KEY.GUI, [AB_KEY.GUI_BACKGROUND, AB_KEY.GUI_BTN_GREEN, AB_KEY.GUI_LOGO]],
]);
