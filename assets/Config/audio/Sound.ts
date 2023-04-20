import { SetSound } from "./SetSound";

export function Sound(on: boolean): () => void {
  return (): void => {
    SetSound(on);
  };
}
