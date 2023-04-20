import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";

export function SetSound(on: boolean): void {
  ConfigStore.set(CONFIG_DEFAULTS.SOUND, on);
}
