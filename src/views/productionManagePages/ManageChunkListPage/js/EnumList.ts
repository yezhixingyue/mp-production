import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ChunkStatusEnum } from './enum';

const ChunkStatusEnumObj = {
  Initial: {
    ID: ChunkStatusEnum.WaitMaterial,
    Name: '等待物料',
  },
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
  ChunkReMakeup: {
    ID: ChunkStatusEnum.ChunkReMakeup,
    Name: '块重新拼版',
  },
  OrderReMakeup: {
    ID: ChunkStatusEnum.OrderReMakeup,
    Name: '订单重新拼版',
  },
  HaveCancled: {
    ID: ChunkStatusEnum.HaveCancled,
    Name: '订单取消',
  },
};

export const ChunkStatusEnumList = getEnumList(ChunkStatusEnumObj);
