let canvasInstance: null | HTMLCanvasElement = null;

/** 获取文字宽度 */
export const getWordsWidth = (words: string, fontSize: number, canvas?: HTMLCanvasElement, fontFamily = 'Microsoft YaHei') => {
  let context: null | CanvasRenderingContext2D = null;

  if (canvasInstance) {
    context = canvasInstance.getContext('2d');
  } else if (canvas) {
    context = canvas.getContext('2d');
  } else {
    canvasInstance = document.createElement('canvas');
    context = canvasInstance.getContext('2d');
  }

  if (!context) return words.length * fontSize;

  context.font = `${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(words);

  return metrics.width;
};

/**
 * 截取文字长度，生成打点展示文字内容
 *
 * 目前由于使用了canvas获取文字宽度的方法 所以不兼容低版本浏览器 后续如果考虑兼容性的时候再补充其它方法
 *
 * @param {string} words    文字内容
 * @param {number} fontSize 文字大小
 * @param {number} width    最大显示宽度
 * @param {HTMLCanvasElement} [canvas]  如果有canvas实例则使用该实例，不用重新创建
 * @param {string} [font='YaHei']
 */
export const getLimitWords = (words: string, fontSize: number, width: number, canvas?: HTMLCanvasElement, font = 'YaHei') => {
  if (!words || !width || getWordsWidth(words, fontSize, canvas, font) <= width) return words;

  const handler = (_words: string, _width: number): string => {
    const min = Math.floor(_width / fontSize); // 最小文字展示数量

    const initWidth = getWordsWidth(_words.slice(0, min), fontSize, canvas, font);

    const diffWidth = _width - initWidth;

    if (diffWidth <= 1.5 * fontSize) {
      return _words.slice(0, min);
    }
    return _words.slice(0, min) + handler(_words.slice(min), diffWidth);
  };

  return `${handler(words, width)}...`;
};
