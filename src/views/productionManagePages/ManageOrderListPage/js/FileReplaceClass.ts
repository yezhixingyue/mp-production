/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { extname } from '@/assets/js/utils';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { getOrderTableListItem } from './getOrderTableList';
import { FileReplaceItemClass } from './FileReplaceItemClass';

type RowType = ReturnType<typeof getOrderTableListItem>

export class FileReplaceClass {
  row: RowType

  fileList: FileReplaceItemClass[]

  loading = false

  isFileLoading = false

  constructor(row: RowType) {
    this.row = row;

    this.fileList = row.CheckedFileList.filter(it => it.IsReplaceable).map(it => new FileReplaceItemClass(it));
  }

  private _validateAndGetList() {
    if (!this.fileList.find(it => it.file)) {
      MpMessage.error('保存失败', '请选择文件');
      return null;
    }

    const t = this.fileList.find(it => it.file && it.accept && extname(it.file.name) !== it.accept);
    if (t) {
      MpMessage.error('保存失败', `[${t.data.Name}]文件格式不符合${t.accept}要求`);
      return null;
    }

    // 生成待上传列表 并进行唯一名设置
    const list = this.fileList.filter(it => it.file);

    const userStore = useUserStore();

    list.forEach(it => it.setUniqueFileName(this.row.ID, userStore.user?.StaffID || ''));

    // 唯一名不能重复验证
    if (list.length > [...new Set(list.map(it => it.UniqueName))].length) {
      MpMessage.error('保存失败', '选中了重复文件');
      return null;
    }

    return list;
  }

  async submit(cb: () => void) {
    const list = this._validateAndGetList();
    if (!list) return;

    // 文件上传
    this.loading = true;

    this.isFileLoading = true;
    const updloadedList = await Promise.all(list.map(it => it.upload()));
    this.isFileLoading = false;

    if (updloadedList.includes(null)) {
      this.loading = false;
      return;
    }

    // 提交
    const temp = {
      CheckedFileList: updloadedList.map(it => ({ ID: it!.data.ID, UniqueName: it!.UniqueName, Name: it!.data.Name })),
      ID: this.row.ID,
    };
    const resp = await api.productionManageApis.getOrderFileReplace(temp);

    this.loading = false;

    // 成功后对旧下载文件路径的修改
    if (resp.data?.isSuccess) {
      const list: { ID: string; FilePath: string }[] = resp.data.Data;
      const callback = () => {
        cb();
        list.forEach(({ ID, FilePath }) => {
          const t = this.row.CheckedFileList.find(it => it.ID === ID);
          if (t) t.FilePath = FilePath;
        });
      };

      MpMessage.dialogSuccess('文件替换成功', callback, callback);
    }
  }
}
