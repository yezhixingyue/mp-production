import { LocationMapClass } from './LocationMapClass';
import { LocationSetClass } from './LocationSetClass';
import { Square } from './Square';
import { LocationColorEnums, pointDirection } from './types';

export class Viewer {
  private cxs: CanvasRenderingContext2D | null = null

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
    if (square.x === 0 && ((square.y + 1) % 5 === 0 || square.y === 0)) {
      const text = `${square.DimensionY}${DimensionUnit.DimensionUnitY}`;
      this.cxs.font = 'bold 13px yahei';
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
      this.cxs.font = 'bold 13px yahei';
      this.cxs.fillStyle = '#444';
      this.cxs.textAlign = 'center';
      this.cxs.fillText(
        `${square.DimensionX}${DimensionUnit.DimensionUnitX}`,
        square.points[0][0] + square.width / 2,
        square.points[0][1] - 8,
        square.width * 2,
      );
    }
  }

  locationMapViewer(locationMap: LocationMapClass) { // 渲染全部单元格
    if (!this.cxs) return;
    locationMap.rows.forEach(row => {
      row.forEach(it => {
        this.squareViewer(it, locationMap.DimensionUnit, LocationColorEnums.squareEmptyColor, true);
      });
    });
  }

  private static getLocationStartPoint(squares: Square[]) { // 获取货位起点坐标点
    let minX = Infinity;
    squares.forEach(it => {
      if (it.x < minX) minX = it.x;
    });
    const minSquares = squares.filter(it => it.x === minX);
    if (minSquares.length > 0) {
      const list = [...minSquares].sort((a, b) => a.y - b.y);
      const start = list[0];
      // 找到起点
      if (start) {
        return start;
      }
    }
    return null;
  }

  private static getSetDrawPoints(start: Square | null, squares: Square[]) { // 获取货位坐标点集合
    const points: [number, number][] = [];
    if (start) {
      const pushPoint = (point: [number, number]) => {
        const t = points.find(p => p[0] === point[0] && p[1] === point[1]);
        if (!t) {
          points.push(point);
        }
      };
      const record: { square: Square, direction: pointDirection }[] = [];
      const handler = (square: Square, direction: pointDirection) => { // squares  direction 找寻方向
        const t = record.find(it => it.square === square && it.direction === direction);
        if (t) {
          return;
        }
        record.push({ square, direction });

        let top: Square | undefined;
        let right: Square | undefined;
        let bottom: Square | undefined;
        let left: Square | undefined;
        const handleLeft = () => {
          left = squares.find(it => it.x === square.x - 1 && it.y === square.y);
          if (!left) {
            pushPoint(square.points[3]);
            pushPoint(square.points[0]);
          } else {
            handler(left, pointDirection.left);
          }
        };
        const handleTop = () => {
          top = squares.find(it => it.x === square.x && it.y === square.y - 1);
          if (!top) {
            pushPoint(square.points[0]);
            pushPoint(square.points[1]);
          } else {
            handler(top, pointDirection.top);
          }
        };
        const handleRight = () => {
          right = squares.find(it => it.x === square.x + 1 && it.y === square.y);
          if (right) {
            handler(right, pointDirection.right);
          } else {
            pushPoint(square.points[1]);
            pushPoint(square.points[2]);
          }
        };
        const handleBottom = () => {
          bottom = squares.find(it => it.x === square.x && it.y === square.y + 1);
          if (!bottom) {
            pushPoint(square.points[2]);
            pushPoint(square.points[3]);
          } else {
            handler(bottom, pointDirection.bottom);
          }
        };
        switch (direction) {
          /**
              记录找的方向：
              向右： 上右下
              向上： 左上右
              向下： 右下左
              向左： 下左上
            */
          case pointDirection.top:
            handleLeft();
            handleTop();
            handleRight();
            break;
          case pointDirection.right:
            handleTop();
            handleRight();
            handleBottom();
            break;

          case pointDirection.bottom:
            handleRight();
            handleBottom();
            handleLeft();
            break;

          case pointDirection.left:
            handleBottom();
            handleLeft();
            handleTop();
            break;

          default:
            break;
        }
      };
      handler(start, pointDirection.right);
    }

    return points;
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

  private getTextPostion(Squares:Square[], PositionName:string) {
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
    const fontsize = 14;
    // 每行文字最大宽度
    const maxWidth = temp.length * temp[0].width - fontsize * 1.2;
    // 每行最多字数
    const lineMaxTexts = maxWidth / fontsize;
    for (let index = 0; index < (PositionName.length / lineMaxTexts < 1 ? 1 : PositionName.length / lineMaxTexts); index++) {
      this.cxs.fillText(PositionName.slice(index * lineMaxTexts, (index + 1) * lineMaxTexts), pointx, pointy + (index * fontsize), temp.length * temp[0].width);
    }
  }

  locationSetViewer(locationSet: LocationSetClass[]) { // 渲染货位
    locationSet.forEach(group => {
      // const start = Viewer.getLocationStartPoint(group.squares);
      // const points = Viewer.getSetDrawPoints(start, group.squares);
      // points.forEach((point, pointIndex) => {
      //   if (!this.cxs) return;
      //   this.cxs.strokeStyle = LocationColorEnums.strokeStyle;
      //   this.cxs.lineWidth = 1;
      //   const [x, y] = point;
      //   if (pointIndex === 0) {
      //     this.cxs.beginPath();
      //     this.cxs.moveTo(x, y);
      //   }
      //   this.cxs.lineTo(x, y);
      //   if (pointIndex === points.length - 1) {
      //     this.cxs.closePath();
      //     this.cxs.stroke(); // 画完一个闭环
      //     this.cxs.fillStyle = group.color;
      //     this.cxs.fill();
      //     this.cxs.font = '14px yahei';
      //     this.cxs.fillStyle = '#fff';
      //     this.cxs.textAlign = 'center';
      //     this.getTextPostion(group.squares, group.PositionName);
      //   }
      // });
      // 通过start和points 获取最大矩形： 起点位置（已有） 矩形：宽、高  --- 根据该信息进行货位名称展示

      // 之前的方式有一个问题是 如果货位形状复杂会出现线段不连贯的问题
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
      this.cxs.font = '14px yahei';
      this.cxs.fillStyle = '#fff';
      this.cxs.textAlign = 'center';
      this.getTextPostion(group.squares, group.PositionName);
    });
  }

  allSquare(locationMap, Details) {
    const temp:Square[] = [];
    Details.forEach((item, yIndex) => {
      item.forEach((it, xIndex) => {
        temp.push(new Square(
          it.DimensionX,
          xIndex,
          it.DimensionY,
          yIndex,
          locationMap.squareWidth,
          locationMap.squareHeight,
          true,
        ));
      });
    });
    const allSquare = new LocationSetClass(
      '',
      '',
      LocationColorEnums.squareFillColor,
      temp,
      [],
    );
    this.locationSetViewer([allSquare]);
  }

  draw(locationMap: LocationMapClass, isMultiSelect:boolean, DyadicDetails) {
    if (!this.cxs) return;
    // 1. 渲染方格  -- 出入库时不需要
    this.locationMapViewer(locationMap);
    if (isMultiSelect) {
      this.allSquare(locationMap, DyadicDetails);
    }
    // 2. 渲染货位组
    this.locationSetViewer(locationMap.locationSet);
  }
}
// const _DyadicDetails:DyadicArrayDimensionDataType[][] = DyadicDetails;
// const getAllNullSquare = () => {
//   // 全部单元格
//   const allSquare:DyadicArrayDimensionDataType[] = [];
//   _DyadicDetails.forEach(res => {
//     allSquare.push(...res);
//   });
//   // 已经占用的单元格
//   const occupySquare:Square[] = [];
//   locationMap.locationSet.forEach(res => {
//     occupySquare.push(...res.squares);
//   });
//   const AllNullSquare = allSquare.filter(res => !occupySquare.find(it => it.x === res.xNum && it.y === res.yNum));
//   console.log(allSquare, 'occupySquare');
//   console.log(occupySquare, 'occupySquare');
//   console.log(AllNullSquare, 'occupySquare');
// };
