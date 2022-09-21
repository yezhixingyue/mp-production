import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';

interface IDisplayItem {
  CategoryName: string,
  MaterialTypeNames: string[],
}
// 放置一些相关使用方法
export const getDisplayList = (list: IMaterialTypeItemInBundle[], infoList: IMaterialTypeGroupItemType[]) => {
  if (list.length === 0) return [];
  const _list = infoList.map(it => {
    const t = list.find(_it => _it.CategoryID === it.CategoryID);
    if (t) {
      const { CategoryName, MaterialTypes } = it;
      const MaterialTypeNames = t.MaterialTypeIDS.map(id => MaterialTypes.find(t => t.TypeID === id)).filter(t => t).map(t => t?.TypeName) as string[];
      if (MaterialTypeNames.length === 0) return null;
      return {
        CategoryName,
        MaterialTypeNames,
      };
    }
    return null;
  }).filter(it => !!it) as IDisplayItem[];
  return _list;
};

export const getTableDiaplayContent = (list: IMaterialTypeItemInBundle[], infoList: IMaterialTypeGroupItemType[]) => {
  const _list = getDisplayList(list, infoList);
  const arr:string[] = [];
  _list.forEach(it => {
    arr.push(...it.MaterialTypeNames);
  });
  return arr.join('、');
};
