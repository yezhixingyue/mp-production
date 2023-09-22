export const handlekeyboardEvent = (handler: {
  /** 放大 */
  zoomIn: () => void;
  /** 缩小 */
  zoomOut: () => void;
  /** 重置缩放比率为1 */
  zoomReset: () => void;
  /** 空格键按住及松开 */
  spaceSwitch: (bool: boolean) => void
}) => {
  const _handleKeydown = (e: KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase();

    if (key === 'alt') {
      e.preventDefault();
    }

    /** 控制货位图缩放相关 */
    if (e.ctrlKey && ['+', '-', '1', '='].includes(key)) {
      e.preventDefault();
      const result = {
        /** 放大 */
        zoomIn: ['+', '='].includes(key),
        /** 缩小 */
        zoomOut: key === '-',
        /** 重置为1 */
        reset: key === '1',
      };
      if (result.zoomIn) handler.zoomIn();
      if (result.zoomOut) handler.zoomOut();
      if (result.reset) handler.zoomReset();
    }

    if (key === ' ') handler.spaceSwitch(true);
  };

  const _handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) { // 阻止滚动放大缩小默认事件
      if (e.deltaY < 0 || e.deltaY > 0) {
        e.preventDefault();
      }
    }
    if (e.altKey) { // 自定义放大缩小事件： alt + 滚轮
      if (e.deltaY < 0) handler.zoomIn();
      if (e.deltaY > 0) handler.zoomOut();
    }
  };

  const _handleKeyup = (e: KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase();

    if (key === ' ') handler.spaceSwitch(false);
  };

  document.addEventListener('keydown', _handleKeydown);
  document.addEventListener('keyup', _handleKeyup);
  document.body.addEventListener('wheel', _handleWheel, { passive: false });

  return () => {
    document.removeEventListener('keydown', _handleKeydown);
    document.removeEventListener('keyup', _handleKeyup);
    document.body.removeEventListener('wheel', _handleWheel);
  };
};
