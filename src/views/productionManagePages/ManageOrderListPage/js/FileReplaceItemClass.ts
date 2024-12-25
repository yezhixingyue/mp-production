import { extname } from '@/assets/js/utils';
import FileTypeClass from '@/assets/js/FileTypeClass';
import { IManageOrderListItem } from './type';

export enum ReplaceFileUploadEnum {
  init = 'init',
  uploading = 'uploading',
  success = 'success',
  exception = 'exception',
}

export class FileReplaceItemClass {
  data: IManageOrderListItem['CheckedFileList'][number]

  file: null | File = null

  UniqueName: null | string = null

  accept: string

  uploadInfo = {
    percentage: 0,
    status: ReplaceFileUploadEnum.init,
    errorText: '',
  }

  get status4process() {
    if ([ReplaceFileUploadEnum.success, ReplaceFileUploadEnum.exception].includes(this.uploadInfo.status)) {
      return this.uploadInfo.status;
    }

    return undefined;
  }

  constructor(item: IManageOrderListItem['CheckedFileList'][number]) {
    this.data = item;

    this.accept = extname(item.FilePath);
  }

  clear() {
    this.file = null;
    this.UniqueName = null;
    this.uploadInfo = {
      percentage: 0,
      status: ReplaceFileUploadEnum.init,
      errorText: '',
    };
  }

  select(file:File) {
    this.clear();
    this.file = file;
  }

  setUniqueFileName(ID: string, CustomerID: string) {
    if (!this.file) return;
    this.UniqueName = FileTypeClass.getUniqueFileName({
      file: this.file,
      Terminal: 3,
      aside: `${ID}_file_replace`,
      CustomerID,
    });
  }

  async upload() {
    if (!this.file || !this.UniqueName) return null;

    if (this.uploadInfo.status === ReplaceFileUploadEnum.success) return this;

    const cb = (percentage: number) => {
      const num = +percentage;
      if (Number.isNaN(num)) return;
      this.uploadInfo.percentage = num;
    };

    this.uploadInfo.status = ReplaceFileUploadEnum.uploading;
    const result = await FileTypeClass.UploadFileByBreakPoint(this.file, this.UniqueName, cb);

    // 3. 上传完成或上传失败 -- 修改状态及错误信息
    if (result.status) { // 成功
      this.uploadInfo.percentage = 100;
      this.uploadInfo.status = ReplaceFileUploadEnum.success;
      return this;
    }

    this.uploadInfo.status = ReplaceFileUploadEnum.exception;
    this.uploadInfo.errorText = result.error;
    return null;
  }
}
