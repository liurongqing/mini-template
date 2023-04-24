import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";
import { storage } from "../../Utils";

export function SetSound(on: boolean): void {
  storage.setItem(CONFIG_DEFAULTS.SOUND, on);
  ConfigStore.set(CONFIG_DEFAULTS.SOUND, on);
}
