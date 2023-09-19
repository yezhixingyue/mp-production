import { Ref, onMounted, onUnmounted, ref, computed, onActivated, onDeactivated, watch, nextTick } from 'vue';
import { handlekeyboardEvent } from './keyboardEvent';
import { LocationMapClass } from './LocationMapClass';
import { Viewer } from './Viewer';
import { MapConditionEnum } from './types';

export const useConfigForMap = (locationMap: Ref<LocationMapClass>, readonly: boolean) => {
  const canvas: Ref<HTMLCanvasElement | null> = ref(null);
  const oWrap: Ref<HTMLCanvasElement | null> = ref(null);

  const config = ref({
    scale: 1,
    renderScale: 1,
    position: {
      left: 0,
      top: 0,
    },
    mapSize: {
      width: locationMap.value.width + 60,
      height: locationMap.value.height + 40,
    },
    tipBoxPosition: {
      x: 50,
      y: 50,
      hidden: true,
      show: false,
    },
    isKeydown: {
      space: false,
    },
    moving: false,
  });

  let viewer: Viewer | null = null;

  const initDraw = () => {
    viewer = null;
    if (canvas.value) {
      viewer = new Viewer(canvas.value);

      // 画单元格 货位
      viewer.draw(locationMap.value, locationMap.value.isMultiSelect, locationMap.value._originData.DyadicArrayDimensionData); // 渲染

      canvas.value.onclick = (e) => {
        if (readonly || e.shiftKey || config.value.isKeydown.space || !viewer) return;

        locationMap.value.onMapClick(e, viewer);
      };

      canvas.value.onmouseout = () => {
        config.value.tipBoxPosition.show = false;
      };

      let a = true;
      canvas.value.onmousemove = (e) => {
        const x = Math.floor((e.offsetX - MapConditionEnum.labelGapWidth) / locationMap.value.squareWidth);
        const y = Math.floor((e.offsetY - MapConditionEnum.labelGapHeight) / locationMap.value.squareHeight);
        // 如果不在图标内部则不往后执行
        if (x < 0 || y < 0 || y > locationMap.value.rows.length - 1 || x > locationMap.value.rows[y].length - 1 || !viewer) {
          config.value.tipBoxPosition.show = false;
          return;
        }
        config.value.tipBoxPosition.show = true;

        config.value.tipBoxPosition.x = e.clientX;
        config.value.tipBoxPosition.y = e.clientY;
        config.value.tipBoxPosition.hidden = true;
        locationMap.value.onMapMove(e, viewer, locationMap.value.DimensionUnit);
        if (a) { // 节流
          a = false;
          setTimeout(() => {
            config.value.tipBoxPosition.hidden = false;
            a = true;
          }, 500);
        }
      };

      // 设置默认选中的货位 （入库）
      locationMap.value.setDefaultAction(viewer);
    }
  };

  let unbindFunc: (() => void) | undefined;

  const handler = { // 缩放相关方法
    zoomIn() {
      config.value.scale += 0.1;

      if (config.value.scale > 2) config.value.scale = 2;
    },
    zoomOut() {
      config.value.scale -= 0.1;

      if (config.value.scale < 0.4) config.value.scale = 0.4;
    },
    zoomReset() {
      config.value.scale = 1;
    },
    spaceSwitch(bool: boolean) {
      config.value.isKeydown.space = bool;
    },
  };

  let timer = -1;
  watch(() => config.value.renderScale, (newVal) => { // 监听缩放比率变化，修改相关尺寸，重绘展示图片
    if (timer > -1) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      timer = -1;

      // 1. locationMap需要提供一个方法，其接收scale属性，然后对内部方块和面板的宽高及相关文字等内容的尺寸进行修改
      locationMap.value.handleRenderScaleChange(newVal);

      // 2. config.mapSize的值需要更新
      config.value.mapSize.width = locationMap.value.width + 60;
      config.value.mapSize.height = locationMap.value.height + 60;

      // 3. 重新绘制图片 -- 检查效率问题
      await nextTick();
      if (viewer) {
        viewer.draw(locationMap.value, locationMap.value.isMultiSelect, locationMap.value._originData.DyadicArrayDimensionData, newVal); // 渲染
      }
    }, locationMap.value.xAxis.length + locationMap.value.yAxis.length > 80 ? 30 : 0);
  });

  const _selectArea = ref<null | { left: number, top: number, right: number, bottom: number }>(null);

  const selectArea = computed(() => {
    if (!_selectArea.value) return null;
    return {
      left: Math.min(_selectArea.value.left, _selectArea.value.right),
      top: Math.min(_selectArea.value.top, _selectArea.value.bottom),
      width: Math.abs(_selectArea.value.right - _selectArea.value.left),
      height: Math.abs(_selectArea.value.bottom - _selectArea.value.top),
    };
  });

  const handleSelectArea = (ctrlKey: boolean) => { // 区域选择处理
    if (!selectArea.value || !viewer || !oWrap.value) return;
    // 1. 转换坐标 -- 由相对于父容器的坐标转换至相对于canvas图片上的坐标及宽高
    const temp = {
      left: (selectArea.value.left + config.value.position.left + ((config.value.scale - 1) * config.value.mapSize.width) / 2) / config.value.scale,
      top: (selectArea.value.top + config.value.position.top + ((config.value.scale - 1) * config.value.mapSize.height) / 2) / config.value.scale,
      width: selectArea.value.width / config.value.scale,
      height: selectArea.value.height / config.value.scale,
    };

    // 2. 去除超出范围的部分
    if (temp.left < 0) {
      temp.width += temp.left;
      temp.left = 0;
    }

    if (temp.top < 0) {
      temp.height += temp.top;
      temp.top = 0;
    }

    if (temp.width > config.value.mapSize.width) temp.width = config.value.mapSize.width;
    if (temp.height > config.value.mapSize.height) temp.height = config.value.mapSize.height;

    // 3. 处理使用renderScale后居中导致的坐标便宜 - 仅使用renderScale时处理
    // const style = window.getComputedStyle(oWrap.value);
    // const wrapWidth = oWrap.value.offsetWidth - parseFloat(style.paddingRight);
    // const wrapHeight = oWrap.value.offsetHeight - parseFloat(style.paddingBottom);

    // const innerWidth = config.value.mapSize.width * config.value.scale;
    // const innerHeight = config.value.mapSize.height * config.value.scale;
    // if (innerWidth < wrapWidth) {
    //   temp.left += (innerWidth - wrapWidth) / 2;
    // }
    // if (innerHeight < wrapHeight) {
    //   temp.top += (innerHeight - wrapHeight) / 2;
    // }

    // 4. 设置最小宽度或高度为1
    temp.width = temp.width || 1;
    temp.height = temp.height || 1;

    // 5. 调用locationMap上的区域选择方法
    locationMap.value.areaSelect(temp, viewer, ctrlKey);
  };

  const onwrapmousedown = (e: MouseEvent) => { // 区域选择前置事件
    if (!e.shiftKey || !oWrap.value || readonly || locationMap.value.isMultiSelect) return;

    const left = oWrap.value.offsetLeft;
    const top = oWrap.value.offsetTop;

    const style = window.getComputedStyle(oWrap.value);

    const wrapWidth = oWrap.value.offsetWidth - parseFloat(style.paddingRight);
    const wrapHeight = oWrap.value.offsetHeight - parseFloat(style.paddingBottom);

    const innerWidth = config.value.mapSize.width * config.value.scale;
    const innerHeight = config.value.mapSize.height * config.value.scale;

    const onmousemove = (e: MouseEvent) => {
      const x = e.x - left;
      const y = e.y - top;

      if (!_selectArea.value) {
        _selectArea.value = {
          left: x,
          top: y,
          right: x,
          bottom: y,
        };
      } else {
        let right = x;
        if (right < 0) {
          if (config.value.position.left + ((config.value.scale - 1) * config.value.mapSize.width) / 2 >= 8) { // 滚动条滚动
            config.value.position.left -= 8;
            _selectArea.value.left += 8;
          }
          right = 0;
        }
        if (right > wrapWidth) {
          if (config.value.position.left + ((config.value.scale - 1) * config.value.mapSize.width) / 2 <= innerWidth - wrapWidth - 8) {
            config.value.position.left += 8;
            _selectArea.value.left -= 8;
          }

          right = wrapWidth;
        }

        let bottom = y;
        if (bottom < 0) {
          if (config.value.position.top + ((config.value.scale - 1) * config.value.mapSize.height) / 2 >= 8) {
            config.value.position.top -= 8;
            _selectArea.value.top += 8;
          }
          bottom = 0;
        }
        if (bottom > wrapHeight) {
          if (config.value.position.top + ((config.value.scale - 1) * config.value.mapSize.height) / 2 <= innerHeight - wrapHeight - 8) {
            config.value.position.top += 8;
            _selectArea.value.top -= 8;
          }

          bottom = wrapHeight;
        }

        _selectArea.value.right = right;
        _selectArea.value.bottom = bottom;
      }
    };

    const clearEvent = () => {
      // 1. 处理选择
      handleSelectArea(e.ctrlKey);

      document.body.removeEventListener('mousemove', onmousemove);
      document.body.removeEventListener('mouseup', clearEvent);
      document.body.removeEventListener('mouseleave', clearEvent);

      // 2. 清除信息
      setTimeout(() => {
        _selectArea.value = null;
      }, 0);
    };

    document.body.addEventListener('mousemove', onmousemove);
    document.body.addEventListener('mouseup', clearEvent);
    document.body.addEventListener('mouseleave', clearEvent);
  };

  const oncanvasmousedown = () => { // 处理鼠标拖动图片事件
    // 1. 如果没有按住空格键则返回
    if (!config.value.isKeydown.space || !oWrap.value || !canvas.value) return;

    // 2. 判断左右滚动条是否出现，如果都没有出现则返回
    const style = window.getComputedStyle(oWrap.value);

    const wrapWidth = oWrap.value.offsetWidth - parseFloat(style.paddingRight);
    const wrapHeight = oWrap.value.offsetHeight - parseFloat(style.paddingBottom);

    const innerWidth = config.value.mapSize.width * config.value.scale;
    const innerHeight = config.value.mapSize.height * config.value.scale;

    if (wrapWidth >= innerWidth && wrapHeight >= innerHeight) return;

    // 3. 修改鼠标样式为move样式 ---- 注意在结束拖动时还原为pointer - 修改状态，然后通过类名去修改鼠标样式
    config.value.moving = true;

    // 4. 拖动 - 注意边界判断
    let _position: null | { x: number, y: number } = null;

    const onmousemove = (e: MouseEvent) => {
      if (!_position) {
        _position = { x: e.x, y: e.y };
      } else {
        const _xDistance = wrapWidth >= innerWidth ? 0 : e.x - _position.x;
        const _yDistance = wrapHeight >= innerHeight ? 0 : e.y - _position.y;

        config.value.position.left -= _xDistance;
        config.value.position.top -= _yDistance;

        _position.x = e.x;
        _position.y = e.y;
      }
    };

    const clearEvent = () => {
      _position = null;
      config.value.moving = false;

      document.body.removeEventListener('mousemove', onmousemove);
      document.body.removeEventListener('mouseup', clearEvent);
      document.body.removeEventListener('mouseleave', clearEvent);
    };

    document.body.addEventListener('mousemove', onmousemove);
    document.body.addEventListener('mouseup', clearEvent);
    document.body.addEventListener('mouseleave', clearEvent);
  };

  onMounted(() => {
    unbindFunc = handlekeyboardEvent(handler);
    if (canvas.value) canvas.value.addEventListener('mousedown', oncanvasmousedown);
  });

  onActivated(() => {
    if (!unbindFunc) unbindFunc = handlekeyboardEvent(handler);
  });

  onUnmounted(() => {
    if (unbindFunc) unbindFunc();
    if (canvas.value) canvas.value.removeEventListener('mousedown', oncanvasmousedown);
  });

  onDeactivated(() => {
    if (unbindFunc) unbindFunc();
  });

  return { config, canvas, initDraw, onwrapmousedown, selectArea, oWrap };
};
