/* eslint-disable max-len */
import { ElMessageBox } from 'element-plus';

/**
 * 失败提示框 --- 不含内容，只有标题 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function failSingle(msg, successFunc, failFunc, dangerouslyUseHTMLString = false) {
  ElMessageBox({
    showClose: true,
    confirmButtonText: '确定',
    title: msg,
    draggable: false,
    customClass: 'mp-order-del-pop-reverse-warn-null fail mp-message',
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 失败提示框 --- 有标题和内容 单按钮
 *
 * @param {string} [title='出错啦 ！']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function failSingleError(title, msg, successFunc, failFunc, dangerouslyUseHTMLString = false) {
  ElMessageBox({
    showClose: true,
    message: msg,
    type: 'fail ',
    confirmButtonText: '关闭',
    title,
    draggable: false,
    customClass: 'mp-order-del-pop-reverse-fail mp-message',
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题和内容 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {string} [title='注意']
 * @param {string} [text='关闭']
 */
function warnSingleError(msg, successFunc, failFunc, title = '注意', text = '关闭', dangerouslyUseHTMLString = false) {
  ElMessageBox({
    showClose: true,
    message: msg,
    type: 'warning',
    confirmButtonText: text,
    title,
    customClass: 'mp-order-del-pop-reverse-warn mp-message',
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题和内容 双按钮   用于取消或删除 操作确认 如订单列表取消
 *
 * @param {string} [title='确定取消此订单吗 ?']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelBox(title, msg, successFunc, failFunc, dangerouslyUseHTMLString = false) {
  ElMessageBox({
    showClose: true,
    message: msg,
    type: 'success ',
    confirmButtonText: '确定',
    title,
    customClass: 'mp-order-del-pop-reverse-warn mp-message',
    showCancelButton: true,
    cancelButtonText: '取消',
    draggable: false,
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}
/**
 * 警告提示框 --- 有标题和内容 双按钮   用于取消或删除 操作确认 如订单列表取消
 *
 * @param {string} [title='确定取消此订单吗 ?']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function dangerCancelBox(title, msg, successFunc, failFunc) {
  ElMessageBox({
    showClose: true,
    message: msg,
    type: 'success ',
    confirmButtonText: '确定',
    title,
    customClass: 'mp-operation-reverse-danger mp-message',
    showCancelButton: true,
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelNullMsg(title, successFunc, failFunc, dangerouslyUseHTMLString = false) {
  ElMessageBox({
    showClose: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    title,
    customClass: 'mp-order-del-pop-reverse-warn-null mp-message',
    draggable: false,
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 成功提示框 --- 不含内容，只有标题 单按钮 -- 后加msg 添加有内容
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {boolean} [canCloseOnPressEscape=true]
 */
function successSingle(title, successFunc, failFunc, canCloseOnPressEscape = true, msg = '', dangerouslyUseHTMLString = false) {
  let customClass = 'mp-order-del-pop-success mp-message';
  if (!msg) customClass = `${customClass} none-msg`;
  ElMessageBox({
    showClose: true,
    confirmButtonText: '确定',
    title,
    message: msg,
    closeOnPressEscape: canCloseOnPressEscape,
    customClass,
    draggable: false,
    dangerouslyUseHTMLString,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等 小文字 可换行
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelMsgSM(title, successFunc, failFunc) {
  ElMessageBox({
    showClose: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    // dangerouslyUseHTMLString: true,
    title,
    customClass: 'mp-del-pop-reverse-warn-wrap-sm mp-message',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 处理使用isLoading状态时的错误处理回调函数
 *
 * @param {*} error
 * @param {*} trueFunc
 * @param {*} failFunc
 */
function handleLoadingError(error, trueFunc, failFunc) {
  let msg = error;
  if (error.response && error.response.data && error.response.data.Message) {
    msg = error.response.data.Message;
  }
  failSingleError(undefined, msg, trueFunc, failFunc);
}

export const message = {
  // 失败/错误提示框 --- 不含内容，只有标题 单按钮
  failSingle,
  // 失败/错误提示框 --- 有标题和内容 单按钮
  failSingleError,
  // 警告提示框 --- 有标题和内容 单按钮
  warnSingleError,
  // 警告提示框 --- 有标题和内容 双按钮   用于取消或删除 操作确认 如订单列表取消
  warnCancelBox, // 删除常用
  // 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等
  warnCancelNullMsg,
  // 成功提示框 --- 不含内容，只有标题 单按钮 -- 后加msg 添加有内容
  successSingle, // 成功
  // 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等 小文字 可换行
  warnCancelMsgSM,
  handleLoadingError,
  // 危险操作确认弹框 -- 有标题和内容 双按钮
  dangerCancelBox,
};

export default message;
