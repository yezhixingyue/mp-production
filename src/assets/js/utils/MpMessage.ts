import { ElMessage } from 'element-plus';
import { message } from './message';

/** 提示选项内容 */
interface Ioptions {
  /** 错误标题 */
  title?: string
  /** 错误内容 */
  msg?: string
  /** 点击确认后的处理函数 */
  onOk?: () => void
  /** 点击取消或关闭弹窗后的处理函数 */
  onCancel?: () => void
  /** 是否用html的方式插入内容 */
  dangerouslyUseHTMLString?: boolean
  /** 仅 warn 时有效 */
  danger?: boolean // 仅 warn 时有效
}

export class MpMessage {
  static error(options: Ioptions): void

  static error(title: string, msg?: string, onOk?:() => void, onCancel?:() => void, dangerouslyUseHTMLString?:boolean): void

  /**
   * 错误提示
   *
   * @static
   * @param {(Ioptions | string)} options
   * @param {string} [msg]
   * @param {() => void} [onOk]
   * @param {() => void} [onCancel]
   * @param {boolean} [dangerouslyUseHTMLString]
   * @memberof MpMessage
   */
  static error(options: Ioptions | string, msg?: string, onOk?:() => void, onCancel?:() => void, dangerouslyUseHTMLString?:boolean) {
    const _title = typeof options === 'object' ? options.title : options;
    const _msg = typeof options === 'object' ? options.msg : msg;
    const _onOk = typeof options === 'object' ? options.onOk : onOk;
    const _onCancel = typeof options === 'object' ? options.onCancel : onCancel;
    const _dangerouslyUseHTMLString = typeof options === 'object' ? options.dangerouslyUseHTMLString : dangerouslyUseHTMLString;

    if (_msg) message.failSingleError(_title, _msg, _onOk, _onCancel, _dangerouslyUseHTMLString);
    else message.failSingle(_title, _onOk, _onCancel, _dangerouslyUseHTMLString);
  }

  static warn(options: Ioptions): void

  static warn(title: string, msg?: string, onOk?:() => void, onCancel?:() => void, dangerouslyUseHTMLString?:boolean): void

  /**
   * 警告提示 通常用于删除等操作时的确认
   *
   * @static
   * @param {(Ioptions | string)} options
   * @param {string} [msg]
   * @param {() => void} [onOk]
   * @param {() => void} [onCancel]
   * @param {boolean} [dangerouslyUseHTMLString]
   * @param {boolean} [danger]
   * @memberof MpMessage
   */
  static warn(options: Ioptions | string, msg?: string, onOk?:() => void, onCancel?:() => void, dangerouslyUseHTMLString?:boolean, danger?: boolean) {
    const _title = typeof options === 'object' ? options.title : options;
    const _msg = typeof options === 'object' ? options.msg : msg;
    const _onOk = typeof options === 'object' ? options.onOk : onOk;
    const _onCancel = typeof options === 'object' ? options.onCancel : onCancel;
    const _dangerouslyUseHTMLString = typeof options === 'object' ? options.dangerouslyUseHTMLString : dangerouslyUseHTMLString;
    const _danger = typeof options === 'object' ? options.danger : danger;

    if (_msg) {
      if (_danger) {
        message.dangerCancelBox(_title, _msg, _onOk, _onCancel, _dangerouslyUseHTMLString);
      } else {
        message.warnCancelBox(_title, _msg, _onOk, _onCancel, _dangerouslyUseHTMLString);
      }
    } else message.warnCancelNullMsg(_title, _onOk, _onCancel, _dangerouslyUseHTMLString);
  }

  static success(options: Ioptions): void

  static success(title: string, onOk?:() => void, onCancel?:() => void, msg?: string, dangerouslyUseHTMLString?:boolean): void

  /**
   * 成功提示
   *
   * @static
   * @param {(Ioptions | string)} options
   * @param {() => void} [onOk]
   * @param {() => void} [onCancel]
   * @param {string} [msg]
   * @param {boolean} [dangerouslyUseHTMLString]
   * @memberof MpMessage
   */
  static success(options: Ioptions | string, onOk?:() => void, onCancel?:() => void, msg?: string, dangerouslyUseHTMLString?:boolean) {
    const _title = typeof options === 'object' ? options.title : options;
    const _msg = typeof options === 'object' ? options.msg : msg;
    const _onOk = typeof options === 'object' ? options.onOk : onOk;
    const _onCancel = typeof options === 'object' ? options.onCancel : onCancel;
    const _dangerouslyUseHTMLString = typeof options === 'object' ? options.dangerouslyUseHTMLString : dangerouslyUseHTMLString;

    const canCloseOnPressEscape = true;

    message.successSingle(_title, _onOk, _onCancel, canCloseOnPressEscape, _msg, _dangerouslyUseHTMLString);
  }

  static dialogSuccess(options: Ioptions): void

  static dialogSuccess(title: string, onOk?:() => void, onCancel?:() => void, msg?: string, dangerouslyUseHTMLString?:boolean): void

  /**
   * 成功提示
   *
   * @static
   * @param {(Ioptions | string)} options
   * @param {() => void} [onOk]
   * @param {() => void} [onCancel]
   * @param {string} [msg]
   * @param {boolean} [dangerouslyUseHTMLString]
   * @memberof MpMessage
   */
  static dialogSuccess(options: Ioptions | string, onOk?:() => void, onCancel?:() => void, msg?: string, dangerouslyUseHTMLString?:boolean) {
    const _title = typeof options === 'object' ? options.title : options;
    const _msg = typeof options === 'object' ? options.msg : msg;
    const _onOk = typeof options === 'object' ? options.onOk : onOk;
    const _onCancel = typeof options === 'object' ? options.onCancel : onCancel;
    const _dangerouslyUseHTMLString = typeof options === 'object' ? options.dangerouslyUseHTMLString : dangerouslyUseHTMLString;

    const canCloseOnPressEscape = true;

    const needToast = false;

    if (needToast) {
      message.successSingle(_title, _onOk, _onCancel, canCloseOnPressEscape, _msg, _dangerouslyUseHTMLString);
    } else if (_onOk) {
      ElMessage({
        showClose: true,
        message: _title,
        type: 'success',
      });
      _onOk();
    }
  }
}
