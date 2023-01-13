import { getLimitWords } from '@/assets/js/utils/getLimitWords';
import { EquipmentStatusEnumList, EquipmentTaskStatusEnumList } from './EnumList';
import { EquipmentStatusForBoardEnum } from './enums';
import { IHoverTarget, ILocalEquipmentStatusItem, IPopupDataItemData } from './types';

/** 条纹颜色 */
const STRIPE_WHITE_COLOR = '#FFF';
const STRIPE_GRAY_COLOR = '#F8F8F8';
/** 每小时显示宽度 */
const HOURWIDTH = 100;

export class BoardDraw {
  /** 存放宽高等数据：标题单元格宽度、设备与任务介绍单元格宽度、任务列表中每小时单元格占位宽度、行高 */
  private layout = {
    /** 标题单元格宽度 */
    TitleWidth: 160,
    /** 任务单元格宽度 */
    IntroWidth: 210,
    /** 后面每小时单元格宽度 */
    HourCellWidth: HOURWIDTH,
    /** 行高 */
    rowHeight: 50,
    /** 标题单元格中左侧文字宽度（不含空白边距） */
    TitleLeftWidth: 56,
    /** 标题单元格中右侧文字宽度（不含空白边距） */
    TaskNumberWidth: 115,
    /** 顶部留白区域高度（填充时间点文字） */
    TopWhiteSpace: 20,
    /** 首个时间段长度 */
    firstTimeWidth: 0,
  }

  /** 面板宽度 */
  private get boardWidth() {
    return this.layout.TitleWidth + this.layout.IntroWidth + this.layout.HourCellWidth * 23 + this.layout.firstTimeWidth + 1;
  }

  /** 面板高度 */
  private get boardHeight() {
    return this.layout.rowHeight * this.list.length + this.layout.TopWhiteSpace || 300;
  }

  /** 主标题最大宽度 */
  private get TitleRightWidth() {
    return this.layout.TitleWidth - this.layout.TitleLeftWidth - 10;
  }

  canvas: null | HTMLCanvasElement = null

  ctx: CanvasRenderingContext2D | null = null

  list: ILocalEquipmentStatusItem[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.ctx = canvas.getContext('2d');
    /** 下一个整点时间节点时间戳 */
    const lastHourTime = new Date(new Date(new Date().setHours(new Date().getHours() + 1)).setMinutes(0)).setSeconds(0);
    this.layout.firstTimeWidth = ((lastHourTime - Date.now()) / (60 * 60 * 1000)) * HOURWIDTH;
  }

  /** 清除画板 */
  clear() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
  }

  /** 画单元格 和 条纹 */
  private _drawCell(x: number, y: number, w: number, h: number, i: number) {
    if (!this.ctx) return;

    // 1. 外边框
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#e5e5e5';
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

    // 2. 条纹背景
    this.ctx.beginPath();
    this.ctx.rect(x, y + 0.5, w - 1, h);
    this.ctx.fillStyle = i % 2 === 0 ? STRIPE_WHITE_COLOR : STRIPE_GRAY_COLOR;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();

    // 3. 标题单元格竖线
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.layout.TitleWidth - 0.5, y);
    this.ctx.lineTo(x + this.layout.TitleWidth - 0.5, y + h);
    this.ctx.stroke();
    this.ctx.closePath();

    // 4. 内容介绍单元格竖线
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.layout.TitleWidth + this.layout.IntroWidth - 0.5, y);
    this.ctx.lineTo(x + this.layout.TitleWidth + this.layout.IntroWidth - 0.5, y + h);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /** 渲染标题单元格 */
  private _drawTitle(
    x: number,
    y: number,
    h: number,
    it: ILocalEquipmentStatusItem,
    EquipmentStatusEnumItem: typeof EquipmentStatusEnumList[number],
    isHover = false,
  ) {
    if (!this.ctx) return;
    // 开始
    this.ctx.beginPath();

    // 1 背景色
    this.ctx.rect(x + (isHover ? 1 : 0), y, this.layout.TitleWidth - 0.5 + (isHover ? -1 : 0), h);
    this.ctx.fillStyle = isHover ? EquipmentStatusEnumItem.HoverColor : EquipmentStatusEnumItem.Color;
    this.ctx.fill();

    // 2 左侧文字
    this.ctx.fillStyle = '#444';
    this.ctx.textBaseline = 'top';
    this.ctx.font = '14px YaHei';
    this.ctx.fillText(it.ClassName.slice(0, 6), x + 10 + 0.5, y + 6 + 2 + 0.5, this.layout.TitleLeftWidth);

    this.ctx.font = 'bold 14px YaHei';
    this.ctx.fillText(it.Equipment.GroupName.slice(0, 6), x + 10 + 0.5, y + 6 + 22 + 0.5, this.layout.TitleLeftWidth);

    // 3 右侧文字
    this.ctx.font = 'bold 25px YaHei';
    this.ctx.fillText(it.Equipment.Name.slice(0, 6), x + 10 + 0.5 + this.layout.TitleLeftWidth, y + 14 + 0.5, this.TitleRightWidth);
    this.ctx.closePath();
  }

  /** 渲染任务详情按钮 */
  private _renderDetailBtn(x: number, y: number, isHover = false) {
    if (!this.ctx) return;

    this.ctx.beginPath();

    this.ctx.font = '13px YaHei';
    this.ctx.fillStyle = isHover ? '#35dff9' : '#26bcf9';
    this.ctx.fillText('任务详情', x + this.layout.TitleWidth + 20 + 0.5 + this.layout.TaskNumberWidth, y + 6 + 2 + 0.5);

    this.ctx.closePath();
  }

  /** 渲染第二个文字单元格 */
  private _drawSecondCell(x: number, y: number, it: ILocalEquipmentStatusItem) {
    if (!this.ctx) return;

    this.ctx.beginPath();

    // 1 背景色
    // this.ctx.rect(x + this.layout.TitleWidth, y, this.layout.IntroWidth - 0.5, h);
    // this.ctx.fillStyle = i % 2 === 0 ? STRIPE_WHITE_COLOR : STRIPE_GRAY_COLOR;
    // this.ctx.fill();

    // 2 任务数量
    this.ctx.fillStyle = '#444';
    this.ctx.textBaseline = 'top';
    this.ctx.font = '14px YaHei';
    this.ctx.fillText(`任 务: ${it.TaskList.length}个`, x + this.layout.TitleWidth + 14 + 0.5, y + 6 + 2 + 0.5, this.layout.TaskNumberWidth);

    // 3 操作人
    this.ctx.font = '14px YaHei';
    this.ctx.fillText(`操作人: ${it.Operator.slice(0, 10)}`, x + this.layout.TitleWidth + 14 + 0.5, y + 6 + 23 + 0.5, this.layout.IntroWidth - 30);

    this.ctx.closePath();

    // 4 任务详情
    this._renderDetailBtn(x, y);

    // 5 为该条数据上_menuBorder进行赋值，以供后续使用
    const _it = it;
    _it._menuBorder.x = x + this.layout.TitleWidth + 15 + 0.5 + this.layout.TaskNumberWidth;
    _it._menuBorder.y = y + 6;
    _it._menuBorder.h = 20;
    _it._menuBorder.w = 70;
  }

  /** 补充绘制不完整部分 */
  private _replenishLine(x: number) {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x, this.layout.TopWhiteSpace);
    this.ctx.lineTo(x, this.boardHeight);
    this.ctx.lineTo(x + this.boardWidth, this.boardHeight);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /** 描绘时间点和时间线 */
  private _drawTimeLine() {
    const _getTimePoint = (date: Date) => {
      const hour = `${new Date(date).getHours()}`.padStart(2, '0');
      const minute = `${new Date(date).getMinutes()}`.padStart(2, '0');
      return `${hour}:${minute}`;
    };

    const start = {
      date: new Date(),
      point: _getTimePoint(new Date()),
    };

    // 生成后续时间点
    const list = [start];

    const _writePoint = (point: string, left: number) => { // 填充时间节点文字
      if (!this.ctx) return;

      this.ctx.beginPath();

      this.ctx.fillStyle = '#444';
      this.ctx.textBaseline = 'top';
      this.ctx.font = '12px YaHei';
      this.ctx.fillText(point, left, 6);

      this.ctx.closePath();
    };

    const _drawLine = (left: number) => { // 画线
      if (!this.ctx) return;

      this.ctx.beginPath();

      this.ctx.moveTo(left, this.layout.TopWhiteSpace + 1);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineTo(left, this.boardHeight - 1);
      this.ctx.stroke();

      this.ctx.closePath();
    };

    for (let i = 0; i < 24; i += 1) {
      if (i === 0) {
        const left = this.layout.firstTimeWidth > 30
          ? this.layout.TitleWidth + this.layout.IntroWidth
          : this.layout.TitleWidth + this.layout.IntroWidth - (35 - this.layout.firstTimeWidth);
        _writePoint(start.point, left);
      } else {
        const left = this.layout.TitleWidth + this.layout.IntroWidth + (i - 1) * this.layout.HourCellWidth + this.layout.firstTimeWidth;
        const date = new Date(new Date(new Date().setHours(new Date().getHours() + i)).setMinutes(0));
        const point = _getTimePoint(date);
        list.push({ date, point });
        _drawLine(left);
        _writePoint(point, left);
      }
    }
  }

  /** 画任务进度条 */
  private _drawTaskBar(x: number, y: number, len: number, color: string) {
    if (!this.ctx) return;

    this.ctx.beginPath();

    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = '#e5e5e5';
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + len, y);
    this.ctx.lineTo(x + len, y + 10);
    this.ctx.lineTo(x, y + 10);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.closePath();
  }

  /** 描绘任务列表 */
  private _drawTask(x: number, y: number, h: number, it: ILocalEquipmentStatusItem) {
    if (!this.ctx) return;
    // 正常任务列表, 错误信息提取到其它步骤呈现
    if (it.Status !== EquipmentStatusForBoardEnum.error && it.TaskList.length > 0) {
      const startX = x + this.layout.TitleWidth + this.layout.IntroWidth;
      const startY = y + 10;

      it.TaskList.forEach((task) => {
        // 需要知道： 1. 起点  2. 长度 3. 颜色（4种状态） 4. 文字内容（剪切、 小于30不显示？）
        const startTime = new Date(task.StartTime.replace('Z', '')) > new Date() ? new Date(task.StartTime.replace('Z', '')) : new Date();
        const endTime = new Date(task.EndTime.replace('Z', ''));
        // 1. 起点x坐标
        const x = startX + ((startTime.getTime() - Date.now()) / (60 * 60 * 1000)) * this.layout.HourCellWidth;

        // 2. 任务渲染长度
        const len = ((endTime.getTime() - startTime.getTime()) / (60 * 60 * 1000)) * this.layout.HourCellWidth;

        // 2.5 记录坐标
        const _task = task;
        _task._points = { x, y: startY, len };

        // 3. 颜色
        const t = EquipmentTaskStatusEnumList.find(_it => _it.ID === task.Status);
        const color = t ? t.Color : '';

        _task._EquipmentTaskStatusEnumitem = t;

        // 4. 画图
        if (this.ctx && len > 0 && color) {
          this._drawTaskBar(x, startY, len, color);

          // 5. 填充文字 -- 因为显示问题（画图覆盖） 放置到后面步骤完成
          // this.ctx.beginPath();

          // this.ctx.fillStyle = '#444';
          // this.ctx.textBaseline = 'top';
          // this.ctx.font = '12px YaHei';
          // this.ctx.fillText(`ID:${task.ID} ${task.ProductName}`, x, y + 25, len);

          // this.ctx.closePath();
        }
      });
    }
  }

  /** 添加任务文字 */
  private _drawTaskWords() {
    this.list.forEach(it => {
      if (it.Status !== EquipmentStatusForBoardEnum.error && it.TaskList.length > 0) {
        it.TaskList.forEach((task) => {
          // 4. 画图
          if (this.ctx && task._points && task._points.len >= 30) {
            this.ctx.beginPath();

            this.ctx.fillStyle = '#444';
            this.ctx.textBaseline = 'top';
            this.ctx.font = '12px YaHei';
            const words = getLimitWords(
              `ID:${task.Code} ${task.Material} ${task.Number}${task.Unit} ${task.Duration}小时`,
              12,
              task._points.len,

              this.canvas || undefined,
            );
            this.ctx.fillText(words, task._points.x, task._points.y + 20, task._points.len);

            this.ctx.closePath();
          }
        });
      }
    });
  }

  /** 填充错误和错误报告人信息 */
  private _drawErrorInfo() {
    this.list.forEach((it, i) => {
      if (it.Remark && it.Status === EquipmentStatusForBoardEnum.error) {
        if (!this.ctx) return;
        const x = 0;
        const y = this.layout.rowHeight * i + 0.5 + this.layout.TopWhiteSpace;
        const startX = x + this.layout.TitleWidth + this.layout.IntroWidth + 15;

        // 1. 绘制三角形
        this.ctx.beginPath();

        const w = 30;
        const h = 25;
        const top = 11;
        const d = 2; // 退回距离
        const d2 = (h / (w / 2)) * d;
        const r = Math.sqrt(d); // 圆角半径
        this.ctx.moveTo(startX + w / 2 + d, y + top + d2);
        this.ctx.lineTo(startX + w - d, y + top + h - d2);
        this.ctx.arcTo(startX + w, y + top + h, startX + w - r, y + top + h, r);
        this.ctx.lineTo(startX + d, y + top + h);
        this.ctx.arcTo(startX, y + top + h, startX + d, y + top + h - d2, r);
        this.ctx.lineTo(startX + w / 2 - d, y + top + d2);
        this.ctx.arcTo(startX + w / 2, y + top, startX + w / 2 + d, y + top + d2, r);
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fill();

        this.ctx.fillStyle = '#FFF';
        this.ctx.textBaseline = 'top';
        this.ctx.font = 'bold 16px YaHei-Bold';
        this.ctx.fillText('！', startX + (w / 2 - 4), y + 14 + 5);

        this.ctx.closePath();

        // 2. 填充文字
        this.ctx.beginPath();

        this.ctx.fillStyle = '#FF0000';
        this.ctx.textBaseline = 'top';
        this.ctx.font = 'bold 15px SimHei';
        this.ctx.fillText(`报告: ${it.Remark}!    —— ${it.ErrorOperator}`, startX + 30 + 10, y + 17, this.layout.HourCellWidth * 22);

        this.ctx.closePath();
      }
    });
  }

  _backupImgData: null | ImageData = null

  /** 画图 */
  draw(list: ILocalEquipmentStatusItem[], isInit = true) {
    if (!this.canvas || !this.ctx) return;
    if (isInit) this.list = list;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.clear();
    this.list.forEach((it, i) => {
      if (!this.ctx) return;
      const EquipmentStatusEnumItem = EquipmentStatusEnumList.find(_it => _it.ID === it.Status);

      if (!EquipmentStatusEnumItem) return;
      // 坐标信息： x：当前行的左上角起点x坐标  y：当前行的左上角起点y坐标  w: 当前行总宽度  h: 当前行高度
      const x = 0;
      const y = this.layout.rowHeight * i + 0.5 + this.layout.TopWhiteSpace;
      const w = this.boardWidth;
      const h = this.layout.rowHeight - 1;
      // 1. 画边框和单元格
      this._drawCell(x, y, w, h, i);
      // 2. 渲染标题
      this._drawTitle(x, y, h, it, EquipmentStatusEnumItem);
      // 3. 渲染第二个文字单元格
      this._drawSecondCell(x, y, it);
      // 4. 补线
      this._replenishLine(x);
      // 5. 渲染任务列表
      this._drawTask(x, y, h, it);
    });
    // 时间节点划线
    this._drawTimeLine();
    // 填充任务文字
    this._drawTaskWords();
    // 填充错误信息
    this._drawErrorInfo();
    // 添加事件绑定
    if (isInit) this._bindEvent();
    // 备份图画
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this._backupImgData = imgData;
  }

  /** 事件绑定数据 */
  hoverTarget: IHoverTarget = {
    position: {
      offsetX: 0,
      offsetY: 0,
      clientX: 0,
      clientY: 0,
    },
    index: -1,
    data: {
      item: null,
      Task: null,
    },
  }

  /** 画虚线 当前任务赋值 当前任务条展示 */
  private _drawDottedLine(x: number) {
    // 3. 画虚线
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#aaa';
    this.ctx.setLineDash([5, 3]);
    this.ctx.moveTo(x + 0.5, this.layout.TopWhiteSpace);
    this.ctx.lineTo(x + 0.5, this.boardHeight);
    this.ctx.stroke();
    this.ctx.closePath();

    // 1. 当前任务赋值
    this.hoverTarget.data.Task = null;
    if (this.hoverTarget.data.item) {
      const task = this.hoverTarget.data.item.TaskList.find(it => it._points && it._points.x < x && it._points.len + it._points.x > x);
      this.hoverTarget.data.Task = task || null;
      // 2. 高亮展示任务进度条
      if (task && task._points) {
        const t = EquipmentTaskStatusEnumList.find(_it => _it.ID === task.Status);
        const color = t ? t.HoverColor : '';
        this._drawTaskBar(task._points.x, task._points.y, task._points.len, color);
      }
    }
    // this._drawTimeLine();
  }

  private onmousemove(e:MouseEvent) {
    if (!this.hoverTarget || !this.canvas) return;
    this.hoverTarget.position.offsetX = e.offsetX;
    this.hoverTarget.position.offsetY = e.offsetY;
    this.hoverTarget.position.clientX = e.clientX;
    this.hoverTarget.position.clientY = e.clientY;

    const index = Math.floor((e.offsetY - this.layout.TopWhiteSpace) / this.layout.rowHeight);
    this.hoverTarget.index = index;

    const it: IPopupDataItemData = this.list[index];

    this.hoverTarget.data.item = it;
    // 1. 重绘 --  次数较多，可能会影响性能
    if (this._backupImgData) this.ctx?.putImageData(this._backupImgData, 0, 0);
    if (!it) return;

    const EquipmentStatusEnumItem = EquipmentStatusEnumList.find(_it => it && _it.ID === it.Status);
    it._EquipmentStatusEnumItem = EquipmentStatusEnumItem;

    // --- 后续填充Task信息

    // 2. 悬浮位置为标题
    const x = 0;
    const y = this.layout.rowHeight * index + 0.5 + this.layout.TopWhiteSpace;
    const h = this.layout.rowHeight - 1;
    if (e.offsetX < this.layout.TitleWidth && EquipmentStatusEnumItem) {
      this._drawTitle(x, y, h, it, EquipmentStatusEnumItem, true);
    }
    // 3. 任务单元格变化 - 暂不变化

    // 4. 悬浮到任务详情按钮时对鼠标指针样式的处理
    if (
      e.offsetX > it._menuBorder.x
      && e.offsetX < it._menuBorder.x + it._menuBorder.w
      && e.offsetY > it._menuBorder.y
      && e.offsetY < it._menuBorder.y + it._menuBorder.h) {
      this.canvas.style.cursor = 'pointer';
      this._renderDetailBtn(x, y, true);
    } else {
      this.canvas.style.cursor = 'default';
      this._renderDetailBtn(x, y);
    }
    // 5. 悬浮到任务列表部分时
    if (e.offsetX > this.layout.TitleWidth + this.layout.IntroWidth) {
      this._drawDottedLine(e.offsetX);
    } else {
      this.hoverTarget.data.Task = null;
    }
  }

  private onmouseleave() {
    this.hoverTarget.data.item = null;
    this.hoverTarget.data.Task = null;
    // this.draw([], false);
    if (this._backupImgData) this.ctx?.putImageData(this._backupImgData, 0, 0);
  }

  private onmouseclick(e:MouseEvent) {
    const index = Math.floor((e.offsetY - this.layout.TopWhiteSpace) / this.layout.rowHeight);
    const it = this.list[index];
    if (
      e.offsetX > it._menuBorder.x
      && e.offsetX < it._menuBorder.x + it._menuBorder.w
      && e.offsetY > it._menuBorder.y
      && e.offsetY < it._menuBorder.y + it._menuBorder.h) {
      console.log('点击了任务详情按钮');
    }
  }

  /** 设置事件绑定 */
  private _bindEvent() {
    if (!this.canvas) return;
    this.canvas.onmousemove = this.onmousemove.bind(this);
    this.canvas.onmouseleave = this.onmouseleave.bind(this);
    this.canvas.onclick = this.onmouseclick.bind(this);
  }
}
