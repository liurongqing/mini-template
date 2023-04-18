/**
 * 节流函数
 */
export const throttle = (fn, wait = 800) => {
  let inThrottle, lastTime;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      if (Date.now() - lastTime >= wait) {
        fn.apply(this, args);
        lastTime = Date.now();
      }
    }
  };
};
