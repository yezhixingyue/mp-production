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

  squareViewer(square: Square, color = LocationColorEnums.squareEmptyColor) { // 渲染单元格
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
    if (square.x === 0 && ((square.y + 1) % 5 === 0 || square.y === 0)) {
      this.cxs.font = 'bold 13px yahei';
      this.cxs.fillStyle = '#444';
      this.cxs.textAlign = 'right';
      this.cxs.fillText(square.DimensionY, square.points[0][0] - 4, square.points[0][1] + square.height / 1.67, 50);
    }
    if (square.y === 0 && ((square.x + 1) % 5 === 0 || square.x === 0)) {
      this.cxs.font = 'bold 13px yahei';
      this.cxs.fillStyle = '#444';
      this.cxs.textAlign = 'center';
      this.cxs.fillText(square.DimensionX, square.points[0][0] + square.width / 2, square.points[0][1] - 8, square.width * 2);
    }
  }

  locationMapViewer(locationMap: LocationMapClass) { // 渲染全部单元格
    if (!this.cxs) return;
    locationMap.rows.forEach(row => {
      row.forEach(it => {
        this.squareViewer(it);
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

  locationSetViewer(locationSet: LocationSetClass[]) { // 渲染货位
    locationSet.forEach(group => {
      const start = Viewer.getLocationStartPoint(group.squares);
      const points = Viewer.getSetDrawPoints(start, group.squares);
      points.forEach((point, pointIndex) => {
        if (!this.cxs) return;
        this.cxs.strokeStyle = LocationColorEnums.strokeStyle;
        this.cxs.lineWidth = 1;
        const [x, y] = point;
        if (pointIndex === 0) {
          this.cxs.beginPath();
          this.cxs.moveTo(x, y);
        }
        this.cxs.lineTo(x, y);
        if (pointIndex === points.length - 1) {
          this.cxs.closePath();
          this.cxs.stroke(); // 画完一个闭环
          this.cxs.fillStyle = group.color;
          this.cxs.fill();
          this.cxs.font = '16px yahei';
          this.cxs.fillStyle = '#fff';
          this.cxs.textAlign = 'center';
          this.cxs.fillText(group.PositionName, points[0][0] + 20, points[0][1] + 20);
        }
      });
      // 通过start和points 获取最大矩形： 起点位置（已有） 矩形：宽、高  --- 根据该信息进行货位名称展示
    });
  }

  draw(locationMap: LocationMapClass) {
    if (!this.cxs) return;
    // 1. 渲染方格  -- 出入库时不需要
    this.locationMapViewer(locationMap);

    // 2. 渲染货位组
    console.log(locationMap.locationSet);
    this.locationSetViewer(locationMap.locationSet);
  }
}
