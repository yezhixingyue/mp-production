/**
 * 创建一个js动画
 *
 * @param {*} options from、to、totalMS、duration、onend、onmove
 */
const createAnimation = (options) => {
  let { from } = options; // 起始值
  const { to } = options; // 结束值
  const totalMS = options.totalMS || 1000; // 变化总时间
  const duration = options.duration || 15; // 动画间隔时间
  const times = Math.floor(totalMS / duration); // 变化的次数
  const dis = (to - from) / times; // 每一次变化改变的值
  let curTimes = 0; // 当前变化的次数
  const timerId = setInterval(() => {
    from += dis;
    curTimes += 1; // 当前变化增加一次
    // 无数的可能性
    if (options.onmove) options.onmove(from);
    if (curTimes >= times) {
      // 变化的次数达到了
      from = to; // 变化完成了
      clearInterval(timerId); // 不再变化了
      if (options.onend) options.onend();
    }
  }, duration);
};

export default createAnimation;
