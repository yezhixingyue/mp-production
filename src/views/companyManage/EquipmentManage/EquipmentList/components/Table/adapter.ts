import { IComputer, IDisplayer, TEquipment } from '../../types';
import { EquipmentTypeEnum } from '../../types/enum';

export const getAdaptiveAttrList = (item: TEquipment) => {
  const list: { label: string; content: string | number }[] = [];

  switch (item.type) {
    case EquipmentTypeEnum.computer:
      list.push({ label: 'cpu', content: (item.attribute as IComputer['attribute']).cpu });
      list.push({ label: '内存插槽数量', content: (item.attribute as IComputer['attribute']).memorySlotsNumber });
      list.push({ label: '内存', content: (item.attribute as IComputer['attribute']).memory });
      list.push({ label: '硬盘数量', content: (item.attribute as IComputer['attribute']).diskNumber });
      list.push({ label: '硬盘', content: (item.attribute as IComputer['attribute']).disk });
      list.push({ label: '显卡', content: (item.attribute as IComputer['attribute']).graphicsCard });
      list.push({ label: '网卡', content: (item.attribute as IComputer['attribute']).networkCard });
      list.push({ label: '操作系统', content: (item.attribute as IComputer['attribute']).os });
      list.push({ label: '系统盘类型', content: (item.attribute as IComputer['attribute']).systermDiskType });
      list.push({ label: 'mac地址', content: (item.attribute as IComputer['attribute']).mac });
      list.push({ label: 'ip地址', content: (item.attribute as IComputer['attribute']).ip });
      break;

    case EquipmentTypeEnum.displayer:
      list.push({ label: '显示器型号', content: (item.attribute as IDisplayer['attribute']).model });
      break;
    default:
      break;
  }

  return list;
};
