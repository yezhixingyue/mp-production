import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { PlateTypeEnum } from '@/views/productionManagePages/ManagePlateListPage/js/enum';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { RevocationTypeEnum, SolveTypeEnum, TargetTypeEnum } from './enum';

/** 处理方式枚举对象 */
export const SolveTypeEnumObj = {
  rollbackBeforeMakeup: {
    ID: SolveTypeEnum.rollbackBeforeMakeup,
    Name: '撤回至拼版前',
    _ExcludePlateTypes: [PlateTypeEnum.Virtual, PlateTypeEnum.Digital], // 当大版类型为这些时不显示该项
  },
  remake: {
    ID: SolveTypeEnum.remake,
    Name: '重做',
    _ExcludePlateTypes: [],
  },
  continue: {
    ID: SolveTypeEnum.continue,
    Name: '继续生产（无异常）',
    _ExcludePlateTypes: [],
  },
};

/** 处理方式枚举列表 */
export const SolveTypeEnumList = getEnumList(SolveTypeEnumObj) as unknown as (typeof SolveTypeEnumObj.rollbackBeforeMakeup)[];

/** 撤销方式枚举对象 */
export const RevocationTypeEnumObj = {
  CurrentChunk: {
    ID: RevocationTypeEnum.CurrentChunk,
    Name: '撤销当前块',
    _Display: [ReportModeEnum.block],
    _needChildList: false, // 是否仅在拥有子版时展示
    _ExcludePlateTypes: [],
  },
  CurrentOrder: {
    ID: RevocationTypeEnum.CurrentOrder,
    Name: '撤销此订单',
    _Display: [ReportModeEnum.order, ReportModeEnum.block],
    _needChildList: false,
    _ExcludePlateTypes: [],
  },
  FixedPlate: {
    ID: RevocationTypeEnum.FixedPlate,
    Name: '撤销指定大版',
    _Display: [ReportModeEnum.order],
    _needChildList: false,
    _ExcludePlateTypes: [],
  },
  CurrentPlate: {
    ID: RevocationTypeEnum.CurrentPlate,
    Name: '撤销此大版',
    _Display: [ReportModeEnum.board, ReportModeEnum.block],
    _needChildList: false,
    _ExcludePlateTypes: [],
  },
  CurrentChildPlate: {
    ID: RevocationTypeEnum.CurrentChildPlate,
    Name: '撤销此子版',
    _Display: [ReportModeEnum.board, ReportModeEnum.block],
    _needChildList: true, // 是否仅在拥有子版时展示
    _ExcludePlateTypes: [],
  },
  OtherChunk: {
    ID: RevocationTypeEnum.OtherChunk,
    Name: '撤销其它块',
    _Display: [ReportModeEnum.board, ReportModeEnum.order, ReportModeEnum.block],
    _needChildList: false,
    _ExcludePlateTypes: [PlateTypeEnum.Digital, PlateTypeEnum.Virtual], // 当大版类型为这些时不显示该项
  },
};

/** 撤销方式枚举列表 */
export const RevocationTypeEnumList = getEnumList(RevocationTypeEnumObj) as unknown as (typeof RevocationTypeEnumObj.OtherChunk)[];

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
