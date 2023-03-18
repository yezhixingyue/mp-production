import sha1 from 'js-sha1';
import UploadFileByBreakPoint from './UploadFileByBreakPoint';
import { extname } from '../utils';

/**
 * @description: 处理文件上传相关的方法类
 * @param {*}
 * @return {*}
 */
export default class FileTypeClass {
  /**
   * 生成规则： 生成文件唯一名：账户ID+设备类型+文件名+修改时间+文件大小 通过这些组合成字符串，经过哈希运算
   * @description: 解析文件，获取文件唯一标识名称
   * @static
   * @param {*} { file, Terminal, CustomerID }  Terminal：设备类型  CustomerID:用户ID
   * @returns
   * @memberof FileTypeClass
   */
  static getUniqueFileName({
    file, Terminal, CustomerID, aside,
  }: { file: File, Terminal: number, CustomerID: string, aside: string }) {
    const ext = extname(file.name);
    const combineName = `${CustomerID}${Terminal}${aside}${file.name}${file.lastModified}${file.size}`; // 按照规则进行组合
    return `${sha1(combineName)}.${ext}`;
  }

  /**
   * 断点续传
   *
   * @static
   * @param {*} file
   * @param {*} uniqueName
   * @param {*} onUploadProgressFunc 调用进度条方法
   * @param {*} finalPercentage
   * @returns
   * @memberof FileTypeClass
   */
  static UploadFileByBreakPoint(
    file: File,
    uniqueName: string,
    onUploadProgressFunc: (percentage: number) => void,
    finalPercentage = 100,
  ): Promise<{ status: boolean; error: string }> {
    return UploadFileByBreakPoint(file, uniqueName, onUploadProgressFunc, finalPercentage);
  }
}
