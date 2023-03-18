export default () => {
  // distance 其他高度 (如main 的 margin 默认20像素为据上方的margin值)
  //          + footer 元素的高度，包括 margin
  // 或者说是 除了 头部高度 和 当前需要设置动态高度的元素 之外的所有高度 等于 distance
  function getHeight(elementSelector, distance = 20) {
    const oWrap:HTMLElement | null = document.querySelector('#app .mp-erp-layout-page-content-comp-wrap');
    if (!oWrap || !oWrap.offsetHeight) return 886;
    // 元素的padding值
    const oWrapStylePdiBtmStr = window.getComputedStyle(oWrap)['padding-bottom'];
    const oWrapStylePdiTopStr = window.getComputedStyle(oWrap)['padding-top'];
    // 元素的上下padding和
    const elePaddingHeight = (oWrapStylePdiBtmStr.slice(0, oWrapStylePdiBtmStr.length - 2) - 0)
    + (oWrapStylePdiTopStr.slice(0, oWrapStylePdiBtmStr.length - 2) - 0);

    const oHeader = elementSelector ? document.querySelector(elementSelector) : null;
    const _diff = oHeader ? oWrap.offsetHeight - oHeader.offsetHeight : oWrap.offsetHeight;
    return _diff - elePaddingHeight - distance;
  }
  // 暴露出去
  return {
    getHeight,
  };
};
