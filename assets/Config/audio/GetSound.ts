import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";

export function GetSound(): boolean {
  return ConfigStore.get(CONFIG_DEFAULTS.SOUND);
}
