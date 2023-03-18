import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { RevocationTypeEnum, SolveTypeEnum, TargetTypeEnum } from './enum';

/** 处理方式枚举对象 */
export const SolveTypeEnumObj = {
  rollbackBeforeMakeup: {
    ID: SolveTypeEnum.rollbackBeforeMakeup,
    Name: '撤回至拼版前',
  },
  remake: {
    ID: SolveTypeEnum.remake,
    Name: '重做',
  },
  continue: {
    ID: SolveTypeEnum.continue,
    Name: '继续生产（无异常）',
  },
};

/** 处理方式枚举列表 */
export const SolveTypeEnumList = getEnumList(SolveTypeEnumObj);

/** 撤销方式枚举对象 */
export const RevocationTypeEnumObj = {
  CurrentChunk: {
    ID: RevocationTypeEnum.CurrentChunk,
    Name: '撤销当前块',
    _Display: [ReportModeEnum.block],
    _needChildList: false, // 是否仅在拥有子版时展示
  },
  CurrentOrder: {
    ID: RevocationTypeEnum.CurrentOrder,
    Name: '撤销此订单',
    _Display: [ReportModeEnum.order, ReportModeEnum.block],
    _needChildList: false,
  },
  FixedPlate: {
    ID: RevocationTypeEnum.FixedPlate,
    Name: '撤销指定大版',
    _Display: [ReportModeEnum.order],
    _needChildList: false,
  },
  CurrentPlate: {
    ID: RevocationTypeEnum.CurrentPlate,
    Name: '撤销此大版',
    _Display: [ReportModeEnum.board, ReportModeEnum.block],
    _needChildList: false,
  },
  CurrentChildPlate: {
    ID: RevocationTypeEnum.CurrentChildPlate,
    Name: '撤销此子版',
    _Display: [ReportModeEnum.board, ReportModeEnum.block],
    _needChildList: true,
  },
  OtherChunk: {
    ID: RevocationTypeEnum.OtherChunk,
    Name: '撤销其它块',
    _Display: [ReportModeEnum.board, ReportModeEnum.order, ReportModeEnum.block],
    _needChildList: false,
  },
};

/** 撤销方式枚举列表 */
export const RevocationTypeEnumList = getEnumList(RevocationTypeEnumObj) as unknown as (typeof RevocationTypeEnumObj.CurrentChunk)[];

/** 对象类型枚举对象 */
export const TargetTypeEnumObj = {
  Order: {
    ID: TargetTypeEnum.Order,
    Name: '订单',
  },
  Plate: {
    ID: TargetTypeEnum.Plate,
    Name: '大版',
  },
  Chunk: {
    ID: TargetTypeEnum.Chunk,
    Name: '块',
  },
  UnionChunk: {
    ID: TargetTypeEnum.UnionChunk,
    Name: '组合块',
  },
};

/** 对象类型枚举列表 */
export const TargetTypeEnumList = getEnumList(TargetTypeEnumObj);
