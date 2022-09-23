/**
   * @desc 函数防抖 -- 在某种操作延迟一段时间后再执行，如果中间一直有操作则一直延迟
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行  --立即执行指先执行一次然后再开始防抖判断
   */
export function debounce(func, wait, immediate) {
  let timeout;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function a(this: any, ...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(self, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(self, args);
      }, wait);
    }
  };
}
