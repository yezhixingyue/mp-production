import { ElMessage } from 'element-plus';
import { LocationSetClass } from './LocationSetClass';
import { Square } from './Square';
import { ILocationMapOriginData, LocationColorEnums, MapConditionEnum } from './types';
import { Viewer } from './Viewer';

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

  // 被选中的货位  可编辑?(暂定) 可删除
  selectedLocation: LocationSetClass | null = null

  rows:Square[][] = []

  constructor(originData: ILocationMapOriginData, option: { width: number, height: number }) {
    this.width = option.width;
    this.height = option.height;
    this.init(originData);
  }

  init(originData: ILocationMapOriginData) {
    // 0. 数据初始化
    this.newLocation = [];
    this.selectedLocation = null;
    this.rows = [];

    // 1. 生成xAxis和yAxis数据 -- 使用模拟数据
    this.xAxis = [...new Set(originData.AllPositionDetails.sort((a, b) => a.LeftTopX - b.LeftTopX).map(it => it.DimensionX))];
    this.yAxis = [...new Set(originData.AllPositionDetails.sort((a, b) => a.LeftTopY - b.LeftTopY).map(it => it.DimensionY))];
    // 2. 计算出宽高数据
    this.squareWidth = Math.floor(this.width / this.xAxis.length);
    this.squareHeight = Math.floor(this.height / this.yAxis.length);
    if (this.squareWidth <= 5 || this.squareHeight <= 5) {
      ElMessage({
        message: '单元格宽高过小，可能无法正常渲染货位图',
        showClose: true,
        duration: 10000,
        offset: 120,
        type: 'warning',
      });
    }
    // 3. 生成square集合rows
    this.xAxis.forEach((DimensionX, xIndex) => {
      const arr:Square[] = [];
      this.yAxis.forEach((DimensionY, yIndex) => {
        arr.push(new Square(DimensionX, xIndex, DimensionY, yIndex, this.squareWidth, this.squareHeight));
      });
      this.rows.push(arr);
    });
    // 4. 生成locationSet -- 使用模拟数据 -- 后面需从外部传递入
    this.locationSet = originData.UsePositionDetails
      .map(it => new LocationSetClass(
        it.PositionID,
        it.PositionName,
        LocationColorEnums.normal,
        it.PositionDetails.map(p => this.rows[p.LeftTopX][p.LeftTopY]),
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

  async addLocationSet() { // 添加货位 -- 取消该方法
    // const list = this.newLocation.map(square => ({ x: square.x + 1, y: square.y + 1 }));
    // const resp = await api.getGoodsAllocationVerify(list).catch(() => null);
    // if (resp?.data.Data === 'True') {
    //   // 验证通过
    // } else {
    //   // 报错处理
    // }
    console.log(this.newLocation);
  }

  removeLocationSet() { // 删除货位
    console.log('removeLocationSet', this.selectedLocation);
  }

  renameLocationSet() { // 编辑货位名称
    console.log('editLocationSet', this.selectedLocation);
  }

  onMapClick(e: MouseEvent, viewer: Viewer) {
    const x = Math.floor((e.offsetX - MapConditionEnum.labelGapWidth) / this.squareWidth);
    const y = Math.floor((e.offsetY - MapConditionEnum.labelGapHeight) / this.squareHeight);
    if (this.rows[x] && this.rows[x][y]) {
      const set = this.rows[x][y].onclick(viewer, this);
      if (set) {
        this.newLocation.forEach(it => {
          viewer.squareViewer(it);
        });
        this.newLocation = [];
      }
      if (this.selectedLocation) {
        this.selectedLocation.color = LocationColorEnums.normal;
        viewer.locationSetViewer([this.selectedLocation]);
        const old = this.selectedLocation;
        this.selectedLocation = null;
        if (old === set) {
          return;
        }
      }
      this.selectedLocation = set;
      if (this.selectedLocation) {
        this.selectedLocation.color = LocationColorEnums.isSetSelected;
        viewer.locationSetViewer([this.selectedLocation]);
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
