import { IPropertyOptionListItem } from '../../../TypeClass/types';

/** 选择物料时对列表的特殊处理后的数据格式 */
export interface IMaterialOptionItem {
  Name: string,
  List: {
    Name: string
    List: {
      Name: string
      Data: IPropertyOptionListItem
    }[]
  }[]
}
