import Mock from 'mockjs';
import getEquipmentStatusList from './getEquipmentStatusList';

Mock.mock('/Api/EquipmentStatus/List', getEquipmentStatusList);
