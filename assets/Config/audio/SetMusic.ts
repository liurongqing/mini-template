import { CONFIG_DEFAULTS } from "../consts";
import { ConfigStore } from "../ConfigStore";
import { storage } from "../../Utils";

export function SetMusic(on: boolean): void {
  storage.setItem(CONFIG_DEFAULTS.MUSIC, on);
  ConfigStore.set(CONFIG_DEFAULTS.MUSIC, on);
}
