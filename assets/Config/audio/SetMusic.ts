import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";

export function SetMusic(on: boolean): void {
  ConfigStore.set(CONFIG_DEFAULTS.MUSIC, on);
}
