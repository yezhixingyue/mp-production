import { Square } from './Square';
import { LocationColorEnums, goodsPositionStockDetailsType } from './types';

export class LocationSetClass {
  PositionID = ''

  PositionName = ''

  color: LocationColorEnums = LocationColorEnums.normal

  squares: Square[] = []

  goodsPositionStockDetails: goodsPositionStockDetailsType[] = []

  LocationName = ''

  selectedLocationID?: string

  constructor(PositionID, PositionName, status, points, goodsPositionStockDetails, LocationName = '') {
    this.PositionID = PositionID;
    this.PositionName = PositionName;
    this.color = status;
    this.squares = points;
    this.goodsPositionStockDetails = goodsPositionStockDetails;
    this.LocationName = LocationName;
  }

  private lines: [number, number][][] | null = null;

  private _textInfo: null | { row: Square[], pointx: number, pointy: number } = null;

  private _getTextInfo() {
    if (!this._textInfo) {
      // 货位最长部分 (可能有两个长度一样)
      let maxlength:Square[][] = [[]];

      // 当前相连单元格的长度
      let nowSquares:Square[] = [];

      // 查找当前单元格相连的单元格
      const getSquaresLength = (x, y) => {
        const temp = this.squares.find(it => it.x === x && it.y === y);
        if (temp) {
          nowSquares.push(temp);
          getSquaresLength(x + 1, y);
        }
      };

      this.squares.forEach((Square) => {
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

      // 最终文字要渲染到那一行 暂定为第一行
      const row = maxlength[0];
      // 第一个单元格离左侧的距离加上 第一个离最后一个距离的一半为中间
      const pointx = row[0].points[0][0] + ((row[row.length - 1].points[1][0] - row[0].points[0][0]) / 2);
      const pointy = row[0].points[0][1] + (row[0].height / 2);

      this._textInfo = {
        pointx,
        pointy,
        row,
      };
    }
  }

  /** 描绘边框 */
  drawBorder(cxs: CanvasRenderingContext2D) {
    if (!this.lines) {
      this.lines = this.setLocationBorder();
    }

    this.lines.forEach((line) => {
      cxs.beginPath();
      // x轴一样
      if (line[0][0] === line[1][0]) {
        cxs.moveTo(line[0][0] + 0.5, line[0][1] + 0.5);
        cxs.lineTo(line[1][0] + 0.5, line[1][1] + 0.5);
      }
      if (line[0][1] === line[1][1]) {
        cxs.moveTo(line[0][0] + 0.5, line[0][1] + 0.5);
        cxs.lineTo(line[1][0] + 0.5, line[1][1] + 0.5);
      }
      cxs.stroke();
      cxs.closePath();
    });
  }

  /** 填写文字 */
  writeText(cxs: CanvasRenderingContext2D, fontsize = 13) {
    if (!cxs) return;
    this._getTextInfo();
    if (!this._textInfo) return;

    const { row, pointx, pointy } = this._textInfo;

    // 每行文字最大宽度
    const maxWidth = row.length * row[0].width - fontsize * 1.2;
    // 每行最多字数
    const lineMaxTexts = Math.floor(maxWidth / fontsize) || 1;

    for (let index = 0; index < (this.PositionName.length / lineMaxTexts < 1 ? 1 : this.PositionName.length / lineMaxTexts); index++) {
      cxs.fillText(
        `${this.PositionName.slice(
          index * lineMaxTexts,
          (index + 1) * lineMaxTexts,
        )}`,
        pointx,
        pointy + (index * fontsize),
        row.length * row[0].width,
      );
    }
  }

  private setLocationBorder() { // 获取货位边框点的集合
    const { squares } = this;

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
}
