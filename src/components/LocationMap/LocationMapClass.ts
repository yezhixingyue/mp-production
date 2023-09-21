// import { ElMessage } from 'element-plus';
import { LocationSetClass } from './LocationSetClass';
import { Square } from './Square';
import {
  ILocationMapOriginData, LocationColorEnums, MapConditionEnum, IUsePositionDetailsItem,
} from './types';
import { Viewer } from './Viewer';

interface DimensionUnitType {
  DimensionUnitX:string
  DimensionUnitY:string
}

export class LocationMapClass {
  width = 0

  height = 0

  squareWidth = 0

  squareHeight = 0

  xAxis:string[] = []

  yAxis:string[] = []

  // 是否可编辑

  // 已有货位
  locationSet: LocationSetClass[] = [] // [{ ID: '', status: 0, List: [{x:1,y:1},[x:1,y:2]], stock: { 库存信息 } }]

  // 新加货位
  newLocation:Square[] = [] // 和上面分开了 或许可以合并为一个 -- 暂不合并

  // hover html
  hoverHtml:string[] = []

  // 被选中的货位  可编辑?(暂定) 可删除
  selectedLocation: LocationSetClass[] = []

  rows:Square[][] = []

  // 是否开启多选 用于出入库选择货位
  isMultiSelect: boolean

  // 当前点击的货位
  clickLocation: LocationSetClass| null = null

  // 默认选中的货位 用于切换仓库或货位维度时选中状态保持
  DefaultAction: LocationSetClass[] = []

  // 当前物料的ID
  currentMaterialID: string

  DimensionUnit:DimensionUnitType

  _originData: ILocationMapOriginData

  constructor(
    originData: ILocationMapOriginData,
    isMultiSelect:boolean,
    DefaultAction:LocationSetClass[],
    currentMaterialID,
  ) {
    this._originData = originData;
    this.isMultiSelect = isMultiSelect;
    this.DefaultAction = DefaultAction;
    this.currentMaterialID = currentMaterialID;
    this.DimensionUnit = {
      DimensionUnitX: originData.AllPositionDetails.DimensionUnitX || '',
      DimensionUnitY: originData.AllPositionDetails.DimensionUnitY || '',
    };
    this.init();
  }

  // isLocation 是否入库时候的多选
  getColor(PositionDetail:IUsePositionDetailsItem|LocationSetClass) {
    // 没有开启多选的时候全部渲染黄色
    if (!this.isMultiSelect) {
      return LocationColorEnums.normal;
    }
    // 如果没有物料 goodsPositionStockDetails
    if (!PositionDetail.goodsPositionStockDetails || !PositionDetail.goodsPositionStockDetails.length) { // vacancy
      return LocationColorEnums.vacancy;
    }
    // PositionDetail;
    // 与入库物料一致
    if (PositionDetail.goodsPositionStockDetails?.find(it => it.MaterialID === this.currentMaterialID)) { // vacancy
      return LocationColorEnums.identical;
    }
    return LocationColorEnums.normal;
  }

  _setSize(renderScale) {
    this.squareWidth = 30 * renderScale;
    this.squareHeight = 30 * renderScale;

    this.width = this.xAxis.length * this.squareWidth;
    this.height = this.yAxis.length * this.squareHeight;
  }

  init(renderScale = 1) {
    // 0. 数据初始化
    this.newLocation = [];
    this.selectedLocation = [];
    this.rows = [];

    // 1. 生成xAxis和yAxis数据 -- 使用模拟数据
    this.xAxis = [...new Set(this._originData.AllPositionDetails.DimensionXS.map(it => it.Dimension))];
    this.yAxis = [...new Set(this._originData.AllPositionDetails.DimensionYS.map(it => it.Dimension))];

    // 1.5 此处进行一些设置用于固定每个单元格的宽高尺寸
    // this.width = this.xAxis.length * 30;
    // this.height = this.yAxis.length * 30;

    // 2. 计算出宽高数据
    // this.squareWidth = Math.floor(this.width / this.xAxis.length);
    // this.squareHeight = Math.floor(this.height / this.yAxis.length);
    // if (this.squareWidth <= 5 || this.squareHeight <= 5) {
    //   ElMessage({
    //     message: '单元格宽高过小，可能无法正常渲染货位图',
    //     showClose: true,
    //     duration: 10000,
    //     offset: 120,
    //     type: 'warning',
    //   });
    // }

    // 设置尺寸
    this._setSize(renderScale);

    // 3. 生成square集合rows
    this._originData.DyadicArrayDimensionData.forEach((item, yIndex) => {
      const arr:Square[] = [];
      item.forEach((it, xIndex) => {
        arr.push(new Square(
          it.DimensionX,
          xIndex,
          it.DimensionY,
          yIndex,
          this.squareWidth,
          this.squareHeight,
          this.isMultiSelect,
        ));
      });
      this.rows.push(arr);
    });

    // 4. 生成locationSet -- 使用模拟数据 -- 后面需从外部传递入
    this.locationSet = this._originData.UsePositionDetails
      .map(it => new LocationSetClass(
        it.PositionID,
        it.PositionName,
        this.getColor(it),
        it.PositionDetails.map(p => {
          // 根据保存的xy值获得位置信息
          let coord;
          this._originData.DyadicArrayDimensionData.forEach(item => {
            item.forEach(it => {
              if (it.DimensionX === p.DimensionX && it.DimensionY === p.DimensionY) {
                coord = it;
              }
            });
          });
          return this.rows[coord.yNum][coord.xNum];
        }),
        it.goodsPositionStockDetails,
      ));

    // 5. 为rows中belongTo进行赋值
    this.rows.forEach(row => {
      row.forEach(square => {
        const t = this.locationSet.find(it => it.squares.includes(square));
        if (t) {
          const _square = square;
          _square.belongTo = t;
        }
      });
    });
  }

  handleRenderScaleChange(renderScale: number) {
    this._setSize(renderScale);
    this.rows.forEach(row => {
      row.forEach(square => {
        square.setSizeAndPoints(this.squareWidth, this.squareHeight);
      });
    });
  }

  setDefaultAction(viewer: Viewer) {
    if (this.DefaultAction.length) {
      this.selectedLocation = this.DefaultAction;
    }
    // 处理默认选中
    if (this.selectedLocation && this.selectedLocation.length) {
      this.selectedLocation.forEach((it, i) => {
        if (this.selectedLocation) {
          this.selectedLocation[i].color = LocationColorEnums.isSetSelected;
        }
      });
      console.log(this.selectedLocation);
      this.selectedLocation.forEach((it) => {
        console.log('it', it, it instanceof LocationSetClass);
      });
      viewer.locationSetViewer(this.selectedLocation);
    }
  }

  // async addLocationSet() { // 添加货位 -- 取消该方法
  //   // const list = this.newLocation.map(square => ({ x: square.x + 1, y: square.y + 1 }));
  //   // const resp = await api.getGoodsAllocationVerify(list).catch(() => null);
  //   // if (resp?.data.Data === 'True') {
  //   //   // 验证通过
  //   // } else {
  //   //   // 报错处理
  //   // }
  //   console.log(this.newLocation);
  // }

  // removeLocationSet() { // 删除货位
  //   console.log('removeLocationSet', this.selectedLocation);
  // }

  // renameLocationSet() { // 编辑货位名称
  //   console.log('editLocationSet', this.selectedLocation);
  // }

  // 点击事件 选中货位或者单元格
  onMapClick(e: MouseEvent, viewer: Viewer) {
    const x = Math.floor((e.offsetX - MapConditionEnum.labelGapWidth) / this.squareWidth);
    const y = Math.floor((e.offsetY - MapConditionEnum.labelGapHeight) / this.squareHeight);
    if (this.rows[y] && this.rows[y][x]) {
      // 调用单元格点击事件
      const set = this.rows[y][x].onclick(viewer, this);
      // 如果是多选（入库选择货位 此时不用设置货位所以没有货位的单元格都为禁用）并且点击的单元格没有货位信息

      if (this.isMultiSelect && !set) {
        return;
      }

      if (set) { // 如果点击的目标方块属于一个货位集合，就清空掉newLocation并把其中方块的状态由选中重新渲染至未选中状态
        this.newLocation.forEach(it => {
          viewer.squareViewer(it, this.DimensionUnit);
        });
        this.newLocation = [];
      }
      this.clickLocation = set;

      if (this.selectedLocation) {
        this.selectedLocation.forEach((it, i) => {
          // 多选得时候全部画空
          if (set?.PositionID === it.PositionID || !this.isMultiSelect) {
            this.selectedLocation[i].color = this.getColor(it);
          }
          if (!set) {
            this.selectedLocation[i].color = LocationColorEnums.normal;
          }
        });

        viewer.locationSetViewer(this.selectedLocation);

        const old = this.selectedLocation.find(it => it.PositionID === set?.PositionID);
        // 因为响应式 使用 noSelected 转换一下
        const noSelected = this.selectedLocation.filter(it => it.PositionID !== set?.PositionID);
        this.selectedLocation = [...noSelected];
        if (old?.PositionID === set?.PositionID || !set) {
          if (!this.isMultiSelect) {
            this.selectedLocation = [];
          }
          return;
        }
      }
      // 多选得时候添加
      if (this.isMultiSelect) {
        this.selectedLocation.push(set as LocationSetClass);
      } else {
        this.selectedLocation = [set as LocationSetClass];
      }

      if (this.selectedLocation) {
        this.selectedLocation.forEach((it, i) => {
          if (this.selectedLocation) {
            this.selectedLocation[i].color = LocationColorEnums.isSetSelected;
          }
        });

        viewer.locationSetViewer(this.selectedLocation);
      }
    }
  }

  // 区域选择 - 不处理多选
  areaSelect(area: { left: number, top: number, width: number, height: number }, viewer: Viewer, ctrlKey: boolean) {
    if (this.isMultiSelect) return;

    // 1. 去除边界 转换坐标和宽高
    const _getTransformedArea = () => {
      const diff = {
        left: MapConditionEnum.labelGapWidth - area.left > 0 ? MapConditionEnum.labelGapWidth - area.left : 0,
        top: MapConditionEnum.labelGapHeight - area.top > 0 ? MapConditionEnum.labelGapHeight - area.top : 0,
      };

      if (area.width - diff.left <= 0) return null;
      if (area.height - diff.top <= 0) return null;

      const _area = {
        left: area.left - MapConditionEnum.labelGapWidth,
        top: area.top - MapConditionEnum.labelGapHeight,
        width: area.width,
        height: area.height,
      };

      if (_area.left < 0) {
        _area.width += _area.left;
        _area.left = 0;
      }

      if (_area.top < 0) {
        _area.height += _area.top;
        _area.top = 0;
      }

      return _area;
    };

    const _area = _getTransformedArea();
    if (!_area) return;

    // 2. 从所有的方块中筛选出来和该范围有交叉的块列表
    const _getSquares = () => {
      const squares: Square[] = [];

      const _row = {
        start: Math.floor(_area.top / this.squareHeight),
        end: Math.floor((_area.top + _area.height) / this.squareHeight),
      };

      const _column = {
        start: Math.floor(_area.left / this.squareWidth),
        end: Math.floor((_area.left + _area.width) / this.squareWidth),
      };

      for (let rowIndex = _row.start; rowIndex <= _row.end; rowIndex += 1) {
        const row = this.rows[rowIndex];

        if (row) {
          for (let columnIndex = _column.start; columnIndex <= _column.end; columnIndex += 1) {
            const square = row[columnIndex];
            if (square) squares.push(square);
          }
        }
      }

      return squares;
    };

    const squares = _getSquares();
    if (squares.length === 0) return;

    // 3. 从块列表中筛选出没有货位的块列表，修改每个块的状态
    const emptySquares = squares.filter(it => !it.belongTo);
    if (emptySquares.length === 0) return;

    emptySquares.forEach(square => { // 渲染颜色
      if (this.newLocation.includes(square) && !ctrlKey) return;
      if (!this.newLocation.includes(square) && ctrlKey) return;
      const color = ctrlKey ? LocationColorEnums.squareEmptyColor : LocationColorEnums.squareFillColor;
      viewer.squareViewer(square, '', color);
    });

    if (ctrlKey) { // 清除选中
      this.newLocation = this.newLocation.filter(it => !emptySquares.includes(it));
    } else { // 选中
      this.newLocation.push(...emptySquares);
      this.newLocation = [...new Set(this.newLocation)];
    }

    // 4. 清除之前选中货位
    this.selectedLocation.forEach((it, i) => {
      this.selectedLocation[i].color = LocationColorEnums.normal;
    });

    viewer.locationSetViewer(this.selectedLocation);

    this.selectedLocation = [];
  }

  // 鼠标移动事件
  onMapMove(e: MouseEvent, viewer: Viewer, DimensionUnit:DimensionUnitType) {
    const x = Math.floor((e.offsetX - MapConditionEnum.labelGapWidth) / this.squareWidth);
    const y = Math.floor((e.offsetY - MapConditionEnum.labelGapHeight) / this.squareHeight);
    this.hoverHtml = [];
    if (this.rows[y] && this.rows[y][x]) {
      const set = this.rows[y][x].onmousemove(viewer, this, DimensionUnit);
      // 已设置货位
      if (set) {
        if (set.goodsPositionStockDetails) {
          this.hoverHtml = set.goodsPositionStockDetails.map((res => {
            const msg:string[] = [];
            msg.push(res.AttributeDescribe);
            msg.push(res.SizeDescribe || '');
            msg.push(`${res.Stock}${res.StockUnit || ''}`);
            return msg.join(' ');
          }));
        } else {
          this.hoverHtml = ['空货位'];
        }
      }
    }
  }
  /**
   * 通过上方数据 生成一个二维数组:
   *
   * [
   *  [{x:1,y:1}, {x:1,y:2}, {x:1,y:3}]
   *  [{x:2,y:1}, {x:2,y:2}, {x:2,y:3}]
   *  [{x:3,y:1}, {x:3,y:2}, {x:3,y:3}]
   * ]
   *
   * 使用vue动态渲染该列表
   */

  // square   x y坐标组成一个square， 有自己的状态（选中、未选中、已在货位、准备取消），所属货位类，(4个坐标点?)  -- 或许需要一个货位类
}

// 另 展示模块： 宽、高 --- 宽高暂不考虑 到时候看是否可自适应填充满容器
