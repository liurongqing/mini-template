// time 为毫秒
export const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
