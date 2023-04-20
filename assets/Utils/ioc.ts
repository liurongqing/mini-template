export const ioc = {
  container: new Map(),
  bind(key: string, callback: () => void) {
    this.container.set(key, { callback, singleton: false });
  },
  singleton(key: string, callback: () => void) {
    this.container.set(key, { callback, singleton: true });
  },

  use(key: string) {
    const item = this.container.get(key);
    if (!item) {
      throw new Error("item not in ioc container2");
    }

    if (item.singleton && !item.instance) {
      item.instance = item.callback();
    }

    return item.singleton ? item.instance : item.callback();
  },
};
