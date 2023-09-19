import FileTypeClass from '@/assets/js/FileTypeClass';
import { useUserStore } from '@/store/modules/user';
import { IConvertOrderFile } from '../../../js/types';

export class UploadHelper {
  target: null | IConvertOrderFile = null

  /** 上传进度百分比 最大100 */
  percentage = 0

  status: 'success' | 'exception' | '' = '' // 成功 | 异常 | 尚无状态

  error = ''

  key = Math.random().toString(16).slice(-10)

  constructor(target: IConvertOrderFile) {
    this.target = target;
  }

  /** 执行上传 */
  async updload() {
    if (!this.target || !this.target._File) return false;
    const userStore = useUserStore();

    // 判断之前是否已上传成功
    if (this.target.UniqueName) {
      this.percentage = 100;
      this.status = 'success';
      return true;
    }

    // 1. 获取文件唯一名 对 target上的UniqueName进行赋值
    let type = 0;
    if (this.target._PlateTemplate) type = 1;
    if (this.target._SpecialColorInfo) type = 2;

    let _id = '';
    if (this.target.AssistList && this.target.AssistList.length === 1) _id = this.target.AssistList[0].ID;
    // eslint-disable-next-line prefer-destructuring
    if (this.target.ColorList && this.target.ColorList.length === 1) _id = this.target.ColorList[0];

    const UniqueName = FileTypeClass.getUniqueFileName({
      file: this.target._File,
      Terminal: 3,
      aside: `${this.target._LineInfo.ID}${this.target._LineInfo.Index}${type}${_id}`,
      CustomerID: userStore.user?.StaffID || '',
    });

    // 2. 开始上传 -- 在上传过程中更新percentage
    const cb = (percentage: number) => {
      const num = +percentage;
      if (Number.isNaN(num)) return;
      this.percentage = num;
    };

    const result = await FileTypeClass.UploadFileByBreakPoint(this.target._File, UniqueName, cb);

    // 3. 上传完成或上传失败 -- 修改状态及错误信息
    if (result.status) { // 成功
      this.percentage = 100;
      this.status = 'success';
      this.target.UniqueName = UniqueName; // 在上传成功后再修改唯一名字段
      return true;
    }
    this.status = 'exception';
    this.error = result.error;
    return false;
  }
}
