import api from '@/api';
import { NormalLineCategoryTypeEnum, LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';

/** 获取生产线列表数据  返回数据类型：Awaited<ReturnType<typeof getProductionLineList>> | -- 或可移出该文件 */
export const getProductionLineList = async () => {
  const CombineLineList: IProductionLineSet[] = [];

  let NormalLineList = [
    {
      ID: NormalLineCategoryTypeEnum.normal,
      Name: '常规生产线',
      children: [] as IProductionLineSet[],
    },
    {
      ID: NormalLineCategoryTypeEnum.special,
      Name: '专版生产线',
      children: [] as IProductionLineSet[],
    },
    {
      ID: NormalLineCategoryTypeEnum.digital,
      Name: '数码生产线',
      children: [] as IProductionLineSet[],
    },
  ];

  const _getLineList = async () => {
    const resp = await api.getProductionLineAll().catch(() => null);
    if (resp?.data?.isSuccess) {
      return resp.data.Data as IProductionLineSet[];
    }

    return null;
  };

  const originData = await _getLineList();
  if (!originData) return null;

  originData.forEach(child => {
    if (child.Type === LineTypeEnum.combine) {
      CombineLineList.push(child);
      return;
    }

    // 普通生产线
    const t = NormalLineList.find(it => it.ID === child.Category);
    if (t) t.children.push(child);
  });

  NormalLineList = NormalLineList.filter(it => it.children.length > 0);

  return { NormalLineList, CombineLineList, originData };
};
export type TProductionLineListData = NonNullable<Awaited<ReturnType<typeof getProductionLineList>>>;
