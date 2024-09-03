// 生产专用

import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

import { IPlateListChild, IManagePlateInfo } from '@/views/productionManagePages/ManagePlateListPage/js/type';
import { IManageOrderListItem } from '@/views/productionManagePages/ManageOrderListPage/js/type';
import { IManageChunkInfo } from '@/views/productionManagePages/ManageChunkListPage/js/type';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';

/** 标记当前系统为哪个，以方便在组件中进行差异性的处理。暂定值类型： factory：工厂，_sellErp：销售Erp，orderPc：官网下单 */
export const nodePicPlatform: 'factory' | '_sellErp' | 'orderPc' = 'factory';

export { DialogContainerComp }; // 弹窗组件

export const getProcessListApi = api.productionManageApis.getProcessList; // 接口地址

export { getEnumList } from '@/assets/js/utils/getListByEnums';

export { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';

export { OrderStatus } from '@/views/productionManagePages/ManageOrderListPage/js/enum';

export { ReportModeEnum } from '@/views/productionSetting/process/enums';

export type INodePicPlateListChild = IPlateListChild;
export type INodePicManagePlateInfo = IManagePlateInfo;
export type INodePicManageOrderListItem = IManageOrderListItem;
export type INodePicManageChunkInfo = IManageChunkInfo;
export type INodePicBaseProperty<T> = IBaseProperty<T>;
export type INodePicEquipmentBaseInfo = IEquipmentBaseInfo;
