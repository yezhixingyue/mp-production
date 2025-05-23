import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ExternalMaterialStatusEnum } from './enum';

/** 外来物料到货状态 */
export const ExternalMaterialStatusEnumObj = {
  WaitingDelivery: {
    ID: ExternalMaterialStatusEnum.WaitingDelivery,
    Name: '未到货',
  },
  HaveDelivery: {
    ID: ExternalMaterialStatusEnum.HaveDelivery,
    Name: '已入库',
  },
  Received: {
    ID: ExternalMaterialStatusEnum.Received,
    Name: '已交接',
  },
  Canceled: {
    ID: ExternalMaterialStatusEnum.Canceled,
    Name: '已取消',
  },
};

/** 外来物料到货状态枚举列表 */
export const ExternalMaterialStatusEnumList = getEnumList(ExternalMaterialStatusEnumObj);
