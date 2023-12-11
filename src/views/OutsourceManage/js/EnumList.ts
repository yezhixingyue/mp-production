import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ExternalTaskStatusEnum } from './enum';

export const ExternalTaskStatusEnumObj = {
  /** 待外协 */
  WaitFactoryReceive: {
    ID: ExternalTaskStatusEnum.WaitFactoryReceive,
    Name: '待外协',
  },
  /** 已外协 */
  FactoryReceived: {
    ID: ExternalTaskStatusEnum.FactoryReceived,
    Name: '已外协',
  },
  /** 已出库 */
  HaveInstored: {
    ID: ExternalTaskStatusEnum.HaveInstored,
    Name: '已出库',
  },
  /** 已入库 */
  HaveFinished: {
    ID: ExternalTaskStatusEnum.HaveFinished,
    Name: '已入库',
  },
  /** 已交接 */
  Received: {
    ID: ExternalTaskStatusEnum.Received,
    Name: '已交接',
  },
  /** 有问题 */
  Error: {
    ID: ExternalTaskStatusEnum.Error,
    Name: '有问题',
  },
  /** 已取消 */
  Cancled: {
    ID: ExternalTaskStatusEnum.Cancled,
    Name: '已取消',
  },
};

export const ExternalTaskStatusEnumList = getEnumList(ExternalTaskStatusEnumObj);
