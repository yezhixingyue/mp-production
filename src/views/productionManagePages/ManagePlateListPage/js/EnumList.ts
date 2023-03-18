import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { PlateStatusEnum } from './enum';

const PlateStatusEnumObj = {
  Initial: {
    ID: PlateStatusEnum.WaiteMaterial,
    Name: '等待物料',
  },
  HaveMakeup: {
    ID: PlateStatusEnum.Producibility,
    Name: '待生产',
  },
  InProduction: {
    ID: PlateStatusEnum.InProduction,
    Name: '生产中',
  },
  Finished: {
    ID: PlateStatusEnum.Finished,
    Name: '已完成',
  },
  HaveCancled: {
    ID: PlateStatusEnum.HaveCancled,
    Name: '大版取消',
  },
};

export const PlateStatusEnumList = getEnumList(PlateStatusEnumObj);
