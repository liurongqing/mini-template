import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";
import { storage } from "../../Utils";

export function GetMusic(): boolean {
  if (ConfigStore.has(CONFIG_DEFAULTS.MUSIC)) {
    return ConfigStore.get(CONFIG_DEFAULTS.MUSIC);
  }

  return storage.getItem(CONFIG_DEFAULTS.MUSIC);
}
