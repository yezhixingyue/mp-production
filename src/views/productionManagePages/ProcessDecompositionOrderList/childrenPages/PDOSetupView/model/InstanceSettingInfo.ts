import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { FeedEdgePositionEnum, MoveTypeEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { PDOLineInstance } from './Instance';

/** 在拼版文件上面绑定的一些设置 */
export class InstanceSettingInfo {
  /** 允许合拼 */
  ForbitUnionMakeup = false

  /** 手动设置拼版尺寸 禁止合拼后才可设置  */
  NeedSetPlateSize = false

  /** 是否需要折手 */
  NeedFolding: boolean | '' = ''

  /** 是否需要贴标 */
  NeedSheetIndex = false

  /** 爬移类型 */
  MoveType = MoveTypeEnum.None

  /** 爬移系数 */
  MoveInValue: '' | number = ''

  /** 掀口设置 */
  GripperEdgePosition = FeedEdgePositionEnum.None

  /** 掀口值 */
  GripperEdgeValue: '' | number = ''

  /** 铣背值 */
  HaveMilling = false

  MillingValue: '' | number = ''

  constructor(data?: Required<PDOLineInstance>) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  private _check() {
    // 一. 验证折手
    if (this.NeedFolding === '') {
      MpMessage.error('保存失败', '请勾选是否需要折手');
      return false;
    }
    if (!this.NeedFolding) return true;

    // 二. 验证折手设置
    // 1. 验证贴标 无需验证

    // 2. 爬移使用
    if (this.MoveType !== MoveTypeEnum.None) { // 需要设置爬移系数
      if (this.MoveInValue === '') {
        MpMessage.error('保存失败', '爬移系数未设置');
        return false;
      }
      if (!/^\d+(\.\d{1})?$/.test(`${this.MoveInValue}`) || this.MoveInValue <= 0) {
        MpMessage.error('保存失败', '爬移系数设置不正确，必须为大于0的数字类型且最多1位小数');
        return false;
      }
    }

    // 3. 叼口设置
    if (this.GripperEdgePosition !== FeedEdgePositionEnum.None) {
      if (this.GripperEdgeValue === '') {
        MpMessage.error('保存失败', '掀口值未设置');
        return false;
      }
      if (!/^\d+(\.\d{1})?$/.test(`${this.GripperEdgeValue}`) || this.GripperEdgeValue <= 0) {
        MpMessage.error('保存失败', '掀口值设置不正确，必须为大于0的数字类型且最多1位小数');
        return false;
      }
    }

    // 4. 铣背设置
    if (this.HaveMilling && (this.MillingValue === '' || !/^\d+(\.\d{1})?$/.test(`${this.MillingValue}`) || this.MillingValue <= 0)) {
      MpMessage.error('保存失败', '铣背值设置不正确，请输入大于0的数字类型（最多1位小数）');
      return false;
    }

    return true;
  }

  getParams(ignore = false) {
    if (!ignore && !this._check()) return null;

    const temp = { ...this, NeedSetPlateSize: this.ForbitUnionMakeup };

    Object.keys(temp).forEach(key => {
      if (key.startsWith('_')) {
        temp[key] = undefined;
      }
    });

    return temp;
  }
}
