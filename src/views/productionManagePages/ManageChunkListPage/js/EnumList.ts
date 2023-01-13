import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ChunkStatusEnum } from './enum';

const ChunkStatusEnumObj = {
  Initial: {
    ID: ChunkStatusEnum.Initial,
    Name: '等待物料',
  },
  HaveMakeup: {
    ID: ChunkStatusEnum.HaveMakeup,
    Name: '等待生产',
  },
  InProduction: {
    ID: ChunkStatusEnum.InProduction,
    Name: '生产中',
  },
  Finished: {
    ID: ChunkStatusEnum.Finished,
    Name: '已生产',
  },
  HaveCancled: {
    ID: ChunkStatusEnum.HaveCancled,
    Name: '块取消',
  },
};

export const ChunkStatusEnumList = getEnumList(ChunkStatusEnumObj);
