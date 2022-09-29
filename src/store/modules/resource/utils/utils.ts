import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { IMaterialTypeLimitItemTypeWithName, MaterialTypeLimitItemType } from '../EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { IMaterialConstraintsItem, IMaterialConstraintsItemWithName } from '../EquipmentGroupTypeClass/EquipmentGroupItemClass';

// 获取innerIds并对其进行缓存
const getClassInnerIds = (c: IMaterialTypeGroupItemType) => {
  let innerIds: string[] = [];
  if (c.innerIds && c.innerIds.length > 0) {
    innerIds = c.innerIds;
  } else {
    innerIds = c.innerIds ? c.innerIds : c.MaterialTypes.map(it => it.TypeID);
    const _c = c;
    _c.innerIds = innerIds;
  }
  return innerIds;
};

/**
 * 为项中包含MaterialTypeID属性的列表中每一项添加类型和分类名称
 *
 * @export
 * @param {*} a  第一个参数：包含MaterialTypeID属性的列表
 * @param {*} b  第二个参数：按分类获取到的物料类型数据
 * @returns
 */
export function getMaterialConstraintsListWithNames(a: MaterialTypeLimitItemType[], b: IMaterialTypeGroupItemType[]):IMaterialTypeLimitItemTypeWithName[];
export function getMaterialConstraintsListWithNames(a: IMaterialConstraintsItem[], b: IMaterialTypeGroupItemType[]):IMaterialConstraintsItemWithName[];
export function getMaterialConstraintsListWithNames(MaterialConstraints, MaterialTypeGroup) {
  const increaseMaterialTypeName = (item) => {
    let CategoryName = '未知分类';
    let MaterialTypeName = '未知类型';
    for (let i = 0; i < MaterialTypeGroup.length; i++) {
      const c = MaterialTypeGroup[i];

      const innerIds = getClassInnerIds(c); // 获取innerIds并对其进行缓存

      if (innerIds.includes(item.MaterialTypeID)) { // 获取类型名称 及 所属分类名称
        CategoryName = c.CategoryName;
        const t = c.MaterialTypes.find(it => it.TypeID === item.MaterialTypeID);
        if (t) {
          MaterialTypeName = t.TypeName;
        }
        break;
      }
    }
    return { ...item, CategoryName, MaterialTypeName };
  };

  const list = MaterialConstraints.map(it => increaseMaterialTypeName(it)); // 暂未筛选掉未找到的项目

  return list;
}
