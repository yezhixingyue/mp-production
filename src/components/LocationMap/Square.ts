import { LocationMapClass } from './LocationMapClass';
import { LocationSetClass } from './LocationSetClass';
import { LocationColorEnums, MapConditionEnum } from './types';
import { Viewer } from './Viewer';

export class Square {
  DimensionX = ''

  DimensionY = '' // 可连同上面用于生成名称

  x = 0

  y = 0

  width = 0

  height = 0

  lineWidth = MapConditionEnum.ctxLineWidth

  points:[number, number][] = []

  belongTo: LocationSetClass | null = null // 所属货位

  isMultiSelect: boolean // 所属货位

  constructor(DimensionX:string, xIndex:number, DimensionY:string, yIndex:number, width: number, height: number, isMultiSelect:boolean) {
    this.DimensionX = DimensionX;
    this.x = xIndex;
    this.DimensionY = DimensionY;
    this.y = yIndex;
    this.width = width;
    this.height = height;
    this.isMultiSelect = isMultiSelect;

    this.points.push([this.x * width + this.lineWidth + MapConditionEnum.labelGapWidth, this.y * height + this.lineWidth + MapConditionEnum.labelGapHeight]);
    this.points.push([(this.x + 1) * width + MapConditionEnum.labelGapWidth, this.y * height + this.lineWidth + MapConditionEnum.labelGapHeight]);
    this.points.push([(this.x + 1) * width + MapConditionEnum.labelGapWidth, (this.y + 1) * height + MapConditionEnum.labelGapHeight]);
    this.points.push([this.x * width + this.lineWidth + MapConditionEnum.labelGapWidth, (this.y + 1) * height + MapConditionEnum.labelGapHeight]);
  }

  onclick(viewer: Viewer, locationMap: LocationMapClass): LocationSetClass | null {
    // 如果在货位中 返回货位数据
    if (this.belongTo || this.isMultiSelect) {
      // 已在货位中，执行货位操作
      return this.belongTo;
    }
    // 新增
    if (locationMap.newLocation.includes(this)) {
      const _locationMap = locationMap;
      _locationMap.newLocation = _locationMap.newLocation.filter(it => it !== this);
      viewer.squareViewer(this, '', LocationColorEnums.squareEmptyColor);
    } else {
      locationMap.newLocation.push(this);
      viewer.squareViewer(this, '', LocationColorEnums.squareFillColor);
    }
    return null;
  }

  onmousemove(viewer: Viewer, locationMap: LocationMapClass, DimensionUnit): LocationSetClass | null {
    if (this.belongTo) {
      // 已在货位中，执行货位操作
      return this.belongTo;
    }
    // console.log(
    //   this,
    //   viewer,
    //   locationMap,
    //   'item onmousemove',
    // );

    if (!locationMap.isMultiSelect) {
      locationMap.hoverHtml.push(`${this.DimensionX}${DimensionUnit.DimensionUnitX}-${this.DimensionY}${DimensionUnit.DimensionUnitY}`);
    }

    // // 新增
    // if (locationMap.newLocation.includes(this)) {
    //   const _locationMap = locationMap;
    //   _locationMap.newLocation = _locationMap.newLocation.filter(it => it !== this);
    //   console.log(_locationMap.newLocation.length);
    //   viewer.squareViewer(this, LocationColorEnums.squareEmptyColor);
    // } else {
    //   viewer.squareViewer(this, LocationColorEnums.squareFillColor);
    // }
    return null;
  }

  // 后面可能会添加neighbor属性 以及其在哪个方向上具有邻居 -- 使用dom方式渲染的话，控制其border颜色
}
