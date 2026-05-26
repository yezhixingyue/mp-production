import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IPlateChunk } from '@/views/productionManagePages/PrepressAdjustment/types';

export class AddNumberRuleForm {
  OrderID = ''

  result: { chunkList: IPlateChunk[], isError: boolean, OrderID: string } | null = null

  loading = false

  chunkId = ''

  /** 追加数量 整数 --- 该值需要校验 */
  Number: '' | number = ''

  reason = {
    radio: '' as '' | number,
    remark: '',
  }

  constructor(OrderID?: string, result?: { chunkList: IPlateChunk[], isError: boolean, OrderID: string }) {
    if (OrderID) this.OrderID = OrderID;
    if (result) this.result = result;
  }

  /** 当前选中块 */
  get currentChunk() {
    if (this.result && !this.result.isError && this.chunkId) {
      const t = this.result.chunkList.find(it => it.ID === this.chunkId);
      return t || null;
    }

    return null;
  }

  /** 最大可追加数量 */
  get maxAddNumber() {
    if (!this.currentChunk) return null;

    return Math.floor(this.currentChunk.TotalNumber * 0.2);
  }

  /** 获取提交数据 */
  getParams(reasons: string[]) {
    if (!this.currentChunk) {
      MpMessage.error('追加失败', '请选择块');
      return null;
    }

    if (this.Number === '') {
      MpMessage.error('追加失败', '请输入追加数量');
      return null;
    }

    if (!/^\d+$/.test(String(this.Number))) {
      MpMessage.error('追加失败', '追加数量不正确');
      return null;
    }

    if (this.Number === 0) {
      MpMessage.error('追加失败', '追加数量必须大于0');
      return null;
    }

    if (typeof this.maxAddNumber === 'number' && this.Number > this.maxAddNumber) {
      MpMessage.error('追加失败', `追加数量不能超过${this.maxAddNumber}`);
      return null;
    }

    let reason = '';
    if (this.reason.radio === 255) {
      reason = this.reason.remark;
    } else if (typeof this.reason.radio === 'number') {
      reason = reasons[this.reason.radio];
    }

    if (!reason) {
      MpMessage.error('追加失败', '请设置原因');
      return null;
    }

    return {
      PlateID: this.currentChunk.PlateID,
      ChunkID: this.currentChunk.ID,
      Number: this.Number,
      Remark: reason,
    };
  }
}
