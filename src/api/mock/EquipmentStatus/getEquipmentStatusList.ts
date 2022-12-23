import { EquipmentTaskStatusEnum } from '@/views/productionManagePages/EquipmentStatus/js/enums';
import { ITask } from '@/views/productionManagePages/EquipmentStatus/js/types';
import Mock from 'mockjs';

export default () => {
  const TaskList: ITask[] = [];

  for (let i = 0; i < 12; i += 1) {
    const h = new Date().getHours() + i * 2 + 8;

    const BeginTime = `${new Date(new Date().setHours(h)).toISOString().slice(0, 14)}05:00`;
    const EndTime = `${new Date(new Date().setHours(h + 2)).toISOString().slice(0, 14)}00:00`;

    let Status = EquipmentTaskStatusEnum.inWorking;

    if (i > 0) {
      Status = EquipmentTaskStatusEnum.canWorking;
    }

    if (i > 2) {
      Status = Math.random() > 0.5 ? EquipmentTaskStatusEnum.needMaterial : EquipmentTaskStatusEnum.error;
    }

    TaskList.push({
      ID: 102536221 + i,
      ProductName: '铜版纸200克 5000张',
      Status,
      BeginTime,
      EndTime,
      Duration: 2,
    });
  }

  const result = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumber: 20,
    VersionCode: 0,
    'Data|20': [
      {
        ID: Mock.mock('@guid'),
        'Name|+1': ['1号机', '2号机', '3号机', '4号机', '5号机', '6号机', '7号机', '8号机', '9号机', '10号机', '11号机', '12号机', '13号机'],
        ClassName: '印刷机',
        'GroupName|1': ['G37', 'G46', 'CD102', 'SM74', 'XL145', 'CD74', 'LS40', '紫名'],
        'Status|1-4': 1,
        Operater: {
          ID: '1223',
          Name: '王大锤',
        },
        'TaskNumber|30-1500': 40,
        TaskList,
        ErrorOperater: '王建国',
        Error: '机器变成了变形金刚，即将飞往塞伯坦星球', // 仅在错误状态显示
      },
    ],
  });

  return result;
};
