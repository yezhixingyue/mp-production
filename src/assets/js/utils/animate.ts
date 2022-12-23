interface IOptions {
  from: number[]
  to: number[]
  totalMS?: number
  duration?: number
  onmove?: (n: number[]) => void
  onend?: () => void
}

/**
 * 创建一个js动画
 *
 * @param {*} options from、to、totalMS、duration、onend、onmove
 */
export const createAnimate = (options: IOptions) => {
  const starts = [...options.from];
  const ends = [...options.to];

  const totalMS = options.totalMS || 300; // 变化总时间
  const duration = options.duration || 15; // 动画间隔时间
  const times = Math.floor(totalMS / duration); // 变化的次数

  const disances = starts.map((f, i) => {
    const t = typeof ends[i] === 'number' ? ends[i] : f;
    return (t - f) / times;
  }); // 每一次变化改变的值

  let curTimes = 0; // 当前变化的次数

  const timerId = setInterval(() => {
    curTimes += 1; // 当前变化增加一次
    starts.forEach((f, i) => {
      starts[i] += disances[i];

      if (curTimes >= times) {
        starts[i] = ends[i]; // 变化完成了
      }
    });
    if (options.onmove) options.onmove(starts);
    if (curTimes >= times) {
      clearInterval(timerId); // 不再变化了
      if (options.onend) options.onend();
    }
  }, duration);

  return timerId;
};
