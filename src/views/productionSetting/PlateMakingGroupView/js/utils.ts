import { IClassEquipmentGroups } from '@/store/modules/productionSetting/types';

export const filterClassEquipmentGroups = (list: IClassEquipmentGroups[]) => {
  const _EquipmentGroups = list || [];

  const arr: IClassEquipmentGroups[] = _EquipmentGroups.map(lv1 => {
    const EquipmentGroups = lv1.EquipmentGroups.filter(lv2 => lv2.Equipments.length > 0);
    return { ...lv1, EquipmentGroups };
  }).filter(it => it.EquipmentGroups.length > 0);

  return arr;
};
