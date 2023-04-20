import { SetMusic } from "./SetMusic";

export function Music(on: boolean): () => void {
  return (): void => {
    SetMusic(on);
  };
}
