import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { PlateStatusEnum } from './enum';

const PlateStatusEnumObj = {
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
    Name: '已分切',
  },
  HaveCancled: {
    ID: PlateStatusEnum.HaveCancled,
    Name: '已取消',
  },
};

export const PlateStatusEnumList = getEnumList(PlateStatusEnumObj);
