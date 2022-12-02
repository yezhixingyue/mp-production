import { IProductionLineSet, IWorkingProcedureInfo } from '@/assets/Types/ProductionLineSet/types';
import { PlaceOrderMaterialSourceEnum, PrintColorEnum, PrintSideEnum } from './enums';
import { IConvertAssistInfo, IConvertOrderFile } from './types';

/**
 * 手动下单生产线实例，组合生产线由多个该实例组成
 *
 * @export
 * @class PlaceOrderProductionInstance
 */
export class PlaceOrderProductionInstance { // 区分普通和组合生产线 ？
  ID = ''

  Name = ''

  Index = 0

  /** 实例数量 仅属于组合生产线内使用 */
  Number: number | '' = ''

  /** 数量单位 仅属于组合生产线内使用 */
  Unit = ''

  Size = ''

  ColorList: PrintColorEnum[] = []

  PrintSide = PrintSideEnum.double;

  /** 使用物料 */
  Material = ''

  /** 物料来源 */
  MaterialSource: PlaceOrderMaterialSourceEnum | '' = ''

  /** 上门取料地址 仅MaterialSource为上门取件时需要 */
  Address = {
    /** 收货人 */
    Consignee: '',
    /** 手机号 */
    Mobile: '',
    /** 详细地址 */
    AddressDetail: '',
  }

  /** 选中生产线 里面只赋值ID? 后面看情况 */
  LineList: IProductionLineSet[] = []

  /** 工序 */
  WorkingList: IWorkingProcedureInfo[] = []

  /** 辅助信息列表 - 根据所选工序自动生成 */
  AssistList: IConvertAssistInfo[] = []

  /** 文件列表 在展示中分为拼版文件、辅助文件和专色文件 专色文件可以为空 */
  FileList: IConvertOrderFile[] = []

  /** 允许合拼 */
  AllowUnionMekeup = true

  /** 输出半成品, 仅属于组合生产线时使用 */
  SemiFinished = ''

  /* 特殊情况处理及其需要用到的一些数据支撑
  ------------------------------------------------------- */
  /** 当前实例是否属于组合生产线 */
  _isBelongToCombineLine = false

  /** 如果属于组合生产线时，在组合生产线实例中的次序； 当_belongIndex为1时，为组合生产线的根实例 */
  _belongIndex: '' | number = ''

  /** 是否为组合生产线的根实例，当属于组合生产线 且 次序为0时 为true */
  _isCombineLineRootInstance = false

  constructor(isCombine: boolean, index?: number) {
    if (isCombine) {
      this._isBelongToCombineLine = true;
      if (index || index === 0) {
        this._belongIndex = index;
        if (index === 0) {
          // 组合生产线根实例（必须为组合工序？）中仅需要尺寸、工序、辅助文件
          this._isCombineLineRootInstance = true;
        }
      }
    }
  }

  // 后面需要加一个选中生产线的方法，在选中的同时生成辅助信息、拼版文件等信息， 可用物料？
}
