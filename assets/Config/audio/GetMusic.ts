import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";

export function GetMusic(): boolean {
  return ConfigStore.get(CONFIG_DEFAULTS.MUSIC);
}
