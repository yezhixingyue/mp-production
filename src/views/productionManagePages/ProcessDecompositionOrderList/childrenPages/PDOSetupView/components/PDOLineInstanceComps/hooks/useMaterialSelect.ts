import { ComputedRef, ref, watch } from 'vue';
import { getMaterialTypeGroup, IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { PDOLineInstanceType } from '../../../model/Instance';

export const useMaterialSelect = (instanceItem: ComputedRef<PDOLineInstanceType>) => {
  const materialState = ref({
    visible: false,
    loading: false,
    FactoryMaterialClassList: [] as IMaterialTypeGroupItemType[],
  });

  /** 获取物料类型数据 */
  const getFactoryMaterialClassList = async () => {
    if (materialState.value.FactoryMaterialClassList.length > 0) return;

    const result = await getMaterialTypeGroup(true);

    const list = result.filter(it => it.MaterialTypes.length > 0);

    materialState.value.FactoryMaterialClassList = list;
  };

  const getMaterialList = async (TypeID: string) => {
    materialState.value.loading = true;
    await instanceItem.value.getMaterialList(TypeID);
    materialState.value.loading = false;
  };

  watch(() => instanceItem.value.Material, (newVal) => {
    if (newVal === instanceItem.value.Attribute.Material.ID) return;

    const targetMaterial = instanceItem.value._MaterialList.find(it => it.ID === newVal);
    const targetType = {
      TypeID: '',
      TypeName: '',
    };

    if (targetMaterial) {
      materialState.value.FactoryMaterialClassList.forEach(it => {
        if (targetType.TypeID) return;
        it.MaterialTypes.forEach(_it => {
          if (targetType.TypeID) return;
          if (_it.TypeID === targetMaterial.TypeID) {
            targetType.TypeID = _it.TypeID;
            targetType.TypeName = _it.TypeName;
          }
        });
      });
    }

    const _instanceItem = instanceItem;
    _instanceItem.value.Attribute.Material.ID = targetMaterial?.ID || '';
    _instanceItem.value.Attribute.Material.Name = targetMaterial?.Name || '';
    _instanceItem.value.Attribute.Material.TypeID = targetType.TypeID;
    _instanceItem.value.Attribute.Material.TypeName = targetType.TypeName;
  });

  return { materialState, getMaterialList, getFactoryMaterialClassList };
};
