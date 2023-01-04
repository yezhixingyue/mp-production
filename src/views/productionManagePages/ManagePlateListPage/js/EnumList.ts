import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { PlateStatusEnum } from './enum';

const PlateStatusEnumObj = {
  HaveMakeup: {
    ID: PlateStatusEnum.HaveMakeup,
    Name: '等待生产',
  },
  InProduction: {
    ID: PlateStatusEnum.InProduction,
    Name: '生产中',
  },
  Finished: {
    ID: PlateStatusEnum.Finished,
    Name: '已生产',
  },
  HaveCancled: {
    ID: PlateStatusEnum.HaveCancled,
    Name: '大版取消',
  },
};

export const PlateStatusEnumList = getEnumList(PlateStatusEnumObj);
