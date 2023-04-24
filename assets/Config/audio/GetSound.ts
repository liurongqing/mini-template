import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";
import { storage } from "../../Utils";

export function GetSound(): boolean {
  if (ConfigStore.has(CONFIG_DEFAULTS.SOUND)) {
    return ConfigStore.get(CONFIG_DEFAULTS.SOUND);
  }

  return storage.getItem(CONFIG_DEFAULTS.SOUND);
}
