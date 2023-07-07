import { ShiftTypeEnum } from '@/views/productionSetting/deliveryTimeManage/enums';
import { weekList } from '@/views/productionSetting/deliveryTimeManage/Comps/ShiftTimeSetupDialog/ShiftItemClass';
import { IKeyValuePair } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { IKeyValuePairInEdit } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentRunTimePage/js/types';

export const getFormatValue = (it: Pick<IKeyValuePairInEdit, 'Key' | 'Value'>) => {
  let _First = '';
  let _Second = '';
  if (it) {
    const { Key, Value } = it;
    if (Key || Key === 0) {
      _First = `${`0${Math.floor(Key / 60)}`.slice(-2)}:${`0${Key % 60}`.slice(-2)}`;
    }
    if (Value || Value === 0) {
      _Second = `${`0${Math.floor(Value / 60)}`.slice(-2)}:${`0${Value % 60}`.slice(-2)}`;
    }
  }

  return { _First, _Second };
};

// ShiftTypeEnum
export const getPeriodDateContent = (PeriodType: ShiftTypeEnum, ItemList: number[]) => {
  let content = '';

  switch (PeriodType) {
    case ShiftTypeEnum.everyday:
      content = '每天';
      break;

    case ShiftTypeEnum.weekly:
      content = '每周';
      if (ItemList.length === 7) {
        content += '所有天';
      } else {
        content += weekList.filter(it => ItemList.includes(it.ID)).map(it => it.Name).join('、');
      }

      break;

    case ShiftTypeEnum.monthly:
      content = '每月';
      if (ItemList.length === 31) {
        content += '所有天';
      } else if (ItemList.length > 31 - 7) {
        const arr: number[] = [];
        for (let i = 1; i <= 31; i += 1) {
          if (!ItemList.includes(i)) arr.push(i);
          if (arr.length === 31 - ItemList.length) {
            break;
          }
        }
        content += `${arr.join('、')}号除外`;
      } else {
        content += `${ItemList.join('、')}号`;
      }

      break;
    default:
      break;
  }

  return content;
};

export const getPeriodListContent = (PeriodList: IKeyValuePair[]) => {
  const list = PeriodList.map(it => getFormatValue(it)).map(it => `${it._First}至${it._Second}`);
  return list.join('和');
};
