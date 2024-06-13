/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import api from '@/api';

const chunkSize = 1024 * 1024 * 20;

/**
 * 传入两个参数，用于获取其百分比
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function _getPercentage(num1: number, num2: number) {
  const result = +(((num1 / num2) * 100).toFixed(2));
  return result;
}

/**
 * 设置上传百分比进度
 *
 * @param {*} e 上传的事件参数
 * @param {*} { initPercentage, lastedPercentage, onUploadProgressFunc } 分别为当次上传初始百分比、最终百分比及修改百分比的方法
 */
function _onUploadProgressFunc(e, { initPercentage, lastedPercentage, onUploadProgressFunc }) {
  const tempPer = +initPercentage + +((e.loaded / e.total) * (lastedPercentage - initPercentage)).toFixed(2);
  const willPer = (+`${tempPer.toFixed(2)}0`).toFixed(2);
  if (willPer) onUploadProgressFunc(willPer);
}

/**
 * 用于文件切片后上传
 *
 * @param {*} chunkCount 需要上传的总次数
 * @param {*} curChunkNum 当前切片上传起始位置
 * @param {*} { data, uniqueName, onUploadProgressFunc }  主函数参数
 * @returns
 */
async function uploadFile(chunkCount, curChunkNum, { data, uniqueName, onUploadProgressFunc }) {
  if (chunkCount <= 0) return;

  const beginNode = curChunkNum;
  const initPercentage = _getPercentage(beginNode, data.size); // 当次初始百分比
  onUploadProgressFunc(initPercentage);

  const endNode = chunkCount === 1 ? data.size : beginNode + chunkSize;
  const chunk = data.slice(beginNode, endNode);
  const lastedPercentage = _getPercentage(endNode, data.size);

  const resp = await api.UploadFileBreakpointResume(chunk, uniqueName, beginNode, endNode, data.size, (e) => _onUploadProgressFunc(e, { initPercentage, lastedPercentage, onUploadProgressFunc }));

  if (resp.data?.isSuccess) {
    await uploadFile(chunkCount - 1, endNode, { data, uniqueName, onUploadProgressFunc }); // 递归调用
  } else {
    throw new Error(resp.message || resp?.data?.Message || 'Upload Error!');
  }
}

/**
 *  用于检查是否已上传完成
 *
 * @param {*} data 文件总数据
 * @param {*} uniqueName 文件唯一标识
 * @returns 返回布尔值
 */
async function checkIsTrue(data, uniqueName) {
  const resp = await api.getUploadedProgress(uniqueName);
  if (!resp.data?.isSuccess) return false;
  if (resp.data.Data < data.size) return false;
  return true;
}

/**
 * 断点续传主函数，接收三个参数
 *
 * @param {*} data 需要上传的文件总数据
 * @param {*} uniqueName 文件的唯一标识名称
 * @param {*} onUploadProgressFunc 回调函数，用于设置进度条的百分比
 * @returns 返回true或false，用于告知该函数上传结果: 成功 还是 失败
 */
async function breakPointUpload(data: File, uniqueName: string, onUploadProgressFunc: (percentage: number) => void) {
  const resp4Progress = await api.getUploadedProgress(uniqueName);
  if (!resp4Progress.data?.isSuccess) {
    return { status: false, error: resp4Progress.message || resp4Progress.data?.Message || '上传失败' };
  }

  if (+resp4Progress.data.Data === +data.size && +resp4Progress.data.Data === 0) {
    return { status: false, error: '文件找不到' };
  }

  if (+resp4Progress.data.Data < +data.size) {
    onUploadProgressFunc(_getPercentage(+resp4Progress.data.Data, data.size)); // 根据已上传信息设置初始已上传百分比

    const chunkCount = Math.ceil((data.size - +resp4Progress.data.Data) / (chunkSize)); // 计算出总共需要上传的次数
    const curChunkNum = +resp4Progress.data.Data; // 获取到当前已上传的节点位置

    let error = '';
    await uploadFile(chunkCount, curChunkNum, { data, uniqueName, onUploadProgressFunc }).catch((err) => {
      if (typeof err === 'object') error = err.message || '未知错误';
    });
    if (error) return { status: false, error };

    if (await checkIsTrue(data, uniqueName)) return { status: true, error: '' };

    return { status: false, error: '文件上传失败' };
  }

  onUploadProgressFunc(100);
  return { status: true, error: '' };
}

export default breakPointUpload;
