import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ChunkStatusEnum } from './enum';

const ChunkStatusEnumObj = {
  HaveMakeup: {
    ID: ChunkStatusEnum.Producibility,
    Name: '待生产',
  },
  InProduction: {
    ID: ChunkStatusEnum.InProduction,
    Name: '生产中',
  },
  Finished: {
    ID: ChunkStatusEnum.Finished,
    Name: '已完成',
  },
  HaveCancled: {
    ID: ChunkStatusEnum.HaveCancled,
    Name: '已取消',
  },
};

export const ChunkStatusEnumList = getEnumList(ChunkStatusEnumObj);
