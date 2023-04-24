import { sys } from "cc";

interface IStorage {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
  removeItem(key: string): void;
  clear(): void;
}

export class Storage implements IStorage {
  constructor(private storage: IStorage) {
    this.storage = storage;
  }
  // 获取
  getItem(key: string) {
    try {
      return JSON.parse(this.storage.getItem(key));
    } catch (e) {
      return null;
    }
  }
  // 设置
  setItem(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  // 移除
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }
  // 移除全部
  clear(): void {
    this.storage.clear();
  }
}

export const storage = new Storage(sys.localStorage);
