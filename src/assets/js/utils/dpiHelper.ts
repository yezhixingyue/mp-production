const INCH_MM_RATE = 25.4; // 英寸与mm转换比率

class DpiHelper {
  private _dpi = 0

  public get dpi() {
    if (!this._dpi) {
      this._getDpi();
    }

    return this._dpi;
  }

  private _getDpi() {
    const tempNode = document.createElement('DIV');

    tempNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';

    document.body.appendChild(tempNode);

    this._dpi = parseInt(`${tempNode.offsetWidth}`, 10);

    document.body.removeChild(tempNode);
  }

  /** 像素转毫米 */
  public px2Mm(value: number) {
    const inch = value / this.dpi; // 1. 像素转为英寸

    const cValue = inch * INCH_MM_RATE; // 2. 英寸乘以25.4 转为毫米

    return cValue;
  }

  /** 毫米转像素 */
  public mm2Px(value: number) {
    const inch = value / INCH_MM_RATE; // 1. 毫米转为英寸

    const cValue = inch * this.dpi; // 2. 英寸乘以dpi转为像素

    return cValue;
  }
}

/** 获取dpi，执行像素和毫米之间单位的转换  */
export const dpiHelper = new DpiHelper();
