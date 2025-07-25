import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PlaceOrderProductionInstance } from './PlaceOrderProductionInstance';
import { FeedEdgePositionEnum, MoveTypeEnum } from './enums';

/** 在拼版文件上面绑定的一些设置 */
export class InstanceSettingsOnMakeupFileClass {
  /** 允许合拼 */
  ForbitUnionMakeup = false

  /** 手动设置拼版尺寸 禁止合拼后才可设置  */
  NeedSetPlateSize = false

  /** 是否需要折手 */
  NeedFolding = false

  /** 是否需要贴标 */
  NeedSheetIndex = false

  /** 爬移类型 */
  MoveType = MoveTypeEnum.None

  /** 内爬移量 */
  MoveInValue: '' | number = ''

  /** 外爬移量 */
  MoveOutValue: '' | number = ''

  /** 叼口空白枚举值 */
  FeedEdgePosition = FeedEdgePositionEnum.None

  /** 叼口空白尺寸值 */
  FeedEdgeValue: '' | number = ''

  /** 铣背值 */
  MillingValue: '' | number = ''

  /** 勾选了内爬移 */
  _CheckedMoveIn = false

  /** 勾选了外爬移 */
  _CheckedMoveOut = false

  constructor(data?: Required<PlaceOrderProductionInstance>) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  private _check() {
    if (!this.NeedFolding) return true;

    // 1. 验证贴标 无需验证

    // 2. 爬移使用
    if (this.MoveType !== MoveTypeEnum.None) {
      if (!this._CheckedMoveIn && !this._CheckedMoveOut) {
        MpMessage.error('保存失败', '未设置爬移量');
        return false;
      }
      if (this._CheckedMoveIn) {
        if (this.MoveInValue === '') {
          MpMessage.error('保存失败', '内爬移量未设置');
          return false;
        }
        if (!/^\d+(\.\d{1})?$/.test(`${this.MoveInValue}`) || this.MoveInValue <= 0) {
          MpMessage.error('保存失败', '内爬移设置不正确，必须为大于0的数字类型且最多1位小数');
          return false;
        }
      }
      if (this._CheckedMoveOut) {
        if (this.MoveOutValue === '') {
          MpMessage.error('保存失败', '外爬移量未设置');
          return false;
        }
        if (!/^\d+(\.\d{1})?$/.test(`${this.MoveOutValue}`) || this.MoveOutValue <= 0) {
          MpMessage.error('保存失败', '外爬移设置不正确，必须为大于0的数字类型且最多1位小数');
          return false;
        }
      }
    }

    // 3. 叼口设置
    if (this.FeedEdgePosition !== FeedEdgePositionEnum.None) {
      if (this.FeedEdgeValue === '') {
        MpMessage.error('保存失败', '叼口空白尺寸未设置');
        return false;
      }
      if (!/^\d+(\.\d{1})?$/.test(`${this.FeedEdgeValue}`) || this.FeedEdgeValue <= 0) {
        MpMessage.error('保存失败', '叼口空白尺寸设置不正确，必须为大于0的数字类型且最多1位小数');
        return false;
      }
    }

    // 4. 铣背设置
    if (this.MillingValue && (!/^\d+(\.\d{1})?$/.test(`${this.MillingValue}`) || this.MillingValue <= 0)) {
      MpMessage.error('保存失败', '铣背值设置不正确，必须为大于0的数字类型且最多1位小数');
      return false;
    }

    return true;
  }

  getParams() {
    if (!this._check()) return null;

    return { ...this };
  }
}
