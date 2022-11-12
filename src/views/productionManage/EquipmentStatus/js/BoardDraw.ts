import { EquipmentStatusEnumList } from './EnumList';
import { IEquipmentStatusItem } from './types';

export class BoardDraw {
  /** 存放宽高等数据：标题单元格宽度、设备与任务介绍单元格宽度、任务列表中每小时单元格占位宽度、行高 */
  private layout = {
    TitleWidth: 160,
    IntroWidth: 210,
    HourCellWidth: 100,
    rowHeight: 50,
    TitleLeftWidth: 56,
  }

  /** 面板宽度 */
  private get boardWidth() {
    return this.layout.TitleWidth + this.layout.IntroWidth + this.layout.HourCellWidth * 24;
  }

  /** 面板高度 */
  private get boardHeight() {
    return this.layout.rowHeight * this.list.length || 300;
  }

  /** 主标题最大宽度 */
  private get TitleRightWidth() {
    return this.layout.TitleWidth - this.layout.TitleLeftWidth - 10;
  }

  canvas: null | HTMLCanvasElement = null

  ctx: CanvasRenderingContext2D | null = null

  list: IEquipmentStatusItem[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.ctx = canvas.getContext('2d');
  }

  /** 清除画板 */
  clear() {
    if (!this.canvas || !this.ctx) return;
    console.log('this.boardHeight', this.boardHeight);
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
  }

  /** 画图 */
  draw(list: IEquipmentStatusItem[]) {
    if (!this.canvas || !this.ctx) return;
    this.list = list;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.clear();
    list.forEach((it, i) => {
      if (!this.ctx) return;
      const EquipmentStatusEnumItem = EquipmentStatusEnumList.find(_it => _it.ID === it.Status);

      if (!EquipmentStatusEnumItem) return;
      // 1. 外边框
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#E5E5E5';
      const x = 0;
      const y = this.layout.rowHeight * i + 0.5;
      const w = this.boardWidth;
      const h = this.layout.rowHeight - 1;
      if (i === 0) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + w, y);
      } else {
        this.ctx.moveTo(x + w, y);
      }
      this.ctx.lineTo(x + w, y + h);
      this.ctx.lineTo(x, y + h);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.closePath();
      // 2. 标题单元格竖线
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.layout.TitleWidth - 0.5, y);
      this.ctx.lineTo(x + this.layout.TitleWidth - 0.5, y + h);
      this.ctx.stroke();
      this.ctx.closePath();
      // 3. 内容介绍单元格竖线
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.layout.TitleWidth + this.layout.IntroWidth - 0.5, y);
      this.ctx.lineTo(x + this.layout.TitleWidth + this.layout.IntroWidth - 0.5, y + h);
      this.ctx.stroke();
      this.ctx.closePath();
      // 4. 渲染标题单元格
      this.ctx.beginPath();

      // 4.1 背景色
      this.ctx.rect(x, y, this.layout.TitleWidth - 0.5, h);
      this.ctx.fillStyle = EquipmentStatusEnumItem.Color;
      this.ctx.fill();

      // 4.2 左侧文字
      this.ctx.fillStyle = '#444';
      this.ctx.textBaseline = 'top';
      this.ctx.font = '14px YaHei';
      this.ctx.fillText(it.ClassName.slice(0, 6), x + 10 + 0.5, y + 6 + 2 + 0.5, this.layout.TitleLeftWidth);

      this.ctx.font = 'bold 14px YaHei';
      this.ctx.fillText(it.GroupName.slice(0, 6), x + 10 + 0.5, y + 6 + 22 + 0.5, this.layout.TitleLeftWidth);

      // 4.3 右侧文字
      this.ctx.font = 'bold 25px YaHei';
      this.ctx.fillText(it.Name.slice(0, 6), x + 10 + 0.5 + this.layout.TitleLeftWidth, y + 14 + 0.5, this.TitleRightWidth);
    });
  }
}
