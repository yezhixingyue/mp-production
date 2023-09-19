import { LocationMapClass } from './LocationMapClass';
import { LocationSetClass } from './LocationSetClass';
import { Square } from './Square';
import { LocationColorEnums, MapConditionEnum } from './types';

export class Viewer {
  private cxs: CanvasRenderingContext2D | null = null

  private _renderScale = 1; // 缩放比率 - 默认为1 - 通过darw方法传入可改变该值 - 目前仅用于填充文字时对文字尺寸的改变 (如果大于1则不再增加字号)

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    this.cxs = ctx;
    this.cxs.clearRect(0, 0, canvas.width, canvas.height);
  }

  squareViewer(square: Square, DimensionUnit, color = LocationColorEnums.squareEmptyColor, isAll = false) { // 渲染单元格
    if (!this.cxs) return;
    // this.cxs.clearRect(...square.points[0], square.width, square.height);
    this.cxs.strokeStyle = LocationColorEnums.strokeStyle;
    this.cxs.lineWidth = 1;

    square.points.forEach((point, pointIndex) => {
      if (!this.cxs) return;
      const [x, y] = point;
      if (pointIndex === 0) {
        this.cxs.beginPath();
        this.cxs.moveTo(x, y);
      }
      this.cxs.lineTo(x, y);
      if (pointIndex === square.points.length - 1) {
        this.cxs.closePath();
        this.cxs.stroke(); // 画完一个闭环
        this.cxs.fillStyle = color;
        this.cxs.fill();
      }
    });
    if (!isAll) {
      return;
    }

    let fontsize = this._renderScale >= 1 ? 13 : 13 * this._renderScale;
    if (fontsize < 6) fontsize = 6;

    if (square.x === 0 && ((square.y + 1) % 5 === 0 || square.y === 0)) {
      const text = `${square.DimensionY}${DimensionUnit.DimensionUnitY}`;
      this.cxs.font = `bold ${fontsize}px yahei`;
      this.cxs.fillStyle = '#444';
      this.cxs.textAlign = 'right';
      // this.cxs.fillText(`${square.DimensionY}${DimensionUnit.DimensionUnitY}`, square.points[0][0] - 4, square.points[0][1] + square.height / 1.67, 50);
      // 用于处理文字数量过多挤到一块的问题 begin
      const lineHeight = 15; // 行高
      const lineNum = square.height / lineHeight; // 可以放下的行数
      const allLine = Math.ceil(text.length / 4); // 文字总行数
      const cycleIndex = allLine <= lineNum ? allLine : lineNum; // 循环次数
      const initCoordinate = (square.points[0][1] + square.height / 1.67) - (cycleIndex * lineHeight) / 2;
      for (let index = 0; index < cycleIndex; index++) {
        let msg = text.slice(index, index + 4);
        if (index >= cycleIndex && text.slice(index).length > 4) {
          msg = `${text.slice(index, index + 2)}...`;
        }
        this.cxs.fillText(msg, square.points[0][0] - 3, initCoordinate + index * lineHeight, 50);
      }
      // 用于处理文字数量过多挤到一块的问题 end
    }
    if (square.y === 0 && ((square.x + 1) % 5 === 0 || square.x === 0)) {
      this.cxs.font = `bold ${fontsize}px yahei`;
      this.cxs.fillStyle = '#444';
      this.cxs.textAlign = 'center';
      let text = `${square.DimensionX}${DimensionUnit.DimensionUnitX}`;
      if ((text.length + 4) * fontsize > square.width * 4) {
        text = text.slice(0, Math.floor((square.width * 4) / fontsize - 2));
        text += '...';
      }
      this.cxs.fillText(
        text,
        square.points[0][0] + square.width / 3,
        square.points[0][1] - 8,
        square.width * 4,
      );
    }
  }

  locationMapViewer(locationMap: LocationMapClass) { // 渲染全部单元格
    if (!this.cxs) return;
    locationMap.rows.forEach(row => {
      row.forEach(it => {
        const color = locationMap.newLocation.includes(it) ? LocationColorEnums.squareFillColor : LocationColorEnums.squareEmptyColor;
        this.squareViewer(it, locationMap.DimensionUnit, color, true);
      });
    });
  }

  private static setLocationBorder(squares: Square[]) { // 设置货位边框
    // 所有线段的点
    const lines:[number, number][][] = [];
    const pushPoint = (line: [number, number][]) => {
      lines.push(line);
    };
    squares.forEach(square => {
      const handleLeft = () => {
        const left = squares.find(it => it.x === square.x - 1 && it.y === square.y);
        if (!left) {
          // 左边的线和上边的线需要减去1 以渲染和边框一致的位置
          const [ax, ay] = square.points[3];
          const [bx, by] = square.points[0];
          pushPoint([[ax - 1, ay - 1], [bx - 1, by - 1]]);
        }
      };
      const handleTop = () => {
        const top = squares.find(it => it.x === square.x && it.y === square.y - 1);
        if (!top) {
          // pushPoint([square.points[0], square.points[1]]);
          // 左边的线和上边的线需要减去1以渲染和边框一致的位置
          const [ax, ay] = square.points[0];
          const [bx, by] = square.points[1];
          pushPoint([[ax - 1, ay - 1], [bx - 1, by - 1]]);
        }
      };
      const handleRight = () => {
        const right = squares.find(it => it.x === square.x + 1 && it.y === square.y);
        if (!right) {
          pushPoint([square.points[1], square.points[2]]);
        }
      };
      const handleBottom = () => {
        const bottom = squares.find(it => it.x === square.x && it.y === square.y + 1);
        if (!bottom) {
          pushPoint([square.points[2], square.points[3]]);
        }
      };
      handleLeft();
      handleTop();
      handleRight();
      handleBottom();
    });

    return lines;
  }

  private getTextPostion(Squares:Square[], PositionName:string, fontsize: number) {
    // 货位最长部分 (可能有两个长度一样)
    let maxlength:Square[][] = [[]];
    // 当前相连单元格的长度
    let nowSquares:Square[] = [];
    // 查找当前单元格相连的单元格
    function getSquaresLength(x, y) {
      const temp = Squares.find(it => it.x === x && it.y === y);
      if (temp) {
        nowSquares.push(temp);
        getSquaresLength(x + 1, y);
      }
    }
    Squares.forEach((Square) => {
      // 获取横向相连的单元格;
      getSquaresLength(Square.x, Square.y);
      // 如果当前相连单元格的长度大于当前最大的长度
      if (nowSquares.length > maxlength[0].length) {
        maxlength = [nowSquares];
      } else if (nowSquares.length === maxlength[0].length) {
        maxlength.push(nowSquares);
      }
      nowSquares = [];
    });
    if (!this.cxs) return;
    // 最终文字要渲染到那一行 暂定为第一行
    const temp = maxlength[0];
    // 第一个单元格离左侧的距离加上 第一个离最后一个距离的一半为中间
    const pointx = temp[0].points[0][0] + ((temp[temp.length - 1].points[1][0] - temp[0].points[0][0]) / 2);
    const pointy = temp[0].points[0][1] + (temp[0].height / 2);

    // 每行文字最大宽度
    const maxWidth = temp.length * temp[0].width - fontsize * 1.2;
    // 每行最多字数
    const lineMaxTexts = Math.floor(maxWidth / fontsize) || 1;
    for (let index = 0; index < (PositionName.length / lineMaxTexts < 1 ? 1 : PositionName.length / lineMaxTexts); index++) {
      this.cxs.fillText(
        `${PositionName.slice(
          index * lineMaxTexts,
          (index + 1) * lineMaxTexts,
        )}`,
        pointx,
        pointy + (index * fontsize),
        temp.length * temp[0].width,
      );
    }
  }

  locationSetViewer(locationSet: LocationSetClass[]) { // 渲染货位
    locationSet.forEach(group => {
      // 新方案货位图 方案为：先把货位画上 然后获取所有边（如：单元格上方的单元格不是此货位的单元格就把此单元格的上边线获取到）
      //                    然后绘制所有边线
      if (!this.cxs) return;
      this.cxs.strokeStyle = LocationColorEnums.strokeStyle;
      this.cxs.lineWidth = 1;
      this.cxs.lineCap = 'square';
      // 画货位包含的单元格
      group.squares.forEach(square => {
        if (!this.cxs) return;
        this.cxs.fillStyle = group.color;
        this.cxs?.fillRect(square.points[0][0], square.points[0][1], square.width, square.height);
      });
      // 画货位的边框

      const lines = Viewer.setLocationBorder(group.squares);

      lines.forEach((line) => {
        this.cxs?.beginPath();
        // x轴一样
        if (line[0][0] === line[1][0]) {
          this.cxs?.moveTo(line[0][0] + 0.5, line[0][1] + 0.5);
          this.cxs?.lineTo(line[1][0] + 0.5, line[1][1] + 0.5);
        }
        if (line[0][1] === line[1][1]) {
          this.cxs?.moveTo(line[0][0] + 0.5, line[0][1] + 0.5);
          this.cxs?.lineTo(line[1][0] + 0.5, line[1][1] + 0.5);
        }
        this.cxs?.stroke();
        this.cxs?.closePath();
      });

      let fontsize = this._renderScale >= 1 ? 14 : 14 * this._renderScale;
      if (fontsize < 6) fontsize = 6;

      this.cxs.font = `${fontsize}px yahei`;
      this.cxs.fillStyle = '#fff';
      this.cxs.textAlign = 'center';
      this.getTextPostion(group.squares, group.PositionName, fontsize);
    });
  }

  // private allSquare(locationMap, Details) { // 弃用 ?
  //   const temp:Square[] = [];
  //   Details.forEach((item, yIndex) => {
  //     item.forEach((it, xIndex) => {
  //       temp.push(new Square(
  //         it.DimensionX,
  //         xIndex,
  //         it.DimensionY,
  //         yIndex,
  //         locationMap.squareWidth,
  //         locationMap.squareHeight,
  //         true,
  //       ));
  //     });
  //   });
  //   const allSquareSet = new LocationSetClass(
  //     '',
  //     '',
  //     LocationColorEnums.squareFillColor,
  //     temp,
  //     [],
  //   );
  //   this.locationSetViewer([allSquareSet]);
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw(locationMap: LocationMapClass, isMultiSelect:boolean, DyadicDetails, renderScale?: number) {
    if (!this.cxs) return;

    if (typeof renderScale === 'number' && renderScale > 0) this._renderScale = renderScale;

    // 1. 渲染方格  -- 出入库时不需要
    this.locationMapViewer(locationMap);

    if (isMultiSelect) { // 出入口模式
      // this.allSquare(locationMap, DyadicDetails);
      if (this.cxs) {
        this.cxs.fillStyle = LocationColorEnums.squareFillColor;
        this.cxs.fillRect(MapConditionEnum.labelGapWidth + 1, MapConditionEnum.labelGapHeight + 1, locationMap.width - 1, locationMap.height - 1);
      }
    }
    // 2. 渲染货位组
    this.locationSetViewer(locationMap.locationSet);
  }
}
