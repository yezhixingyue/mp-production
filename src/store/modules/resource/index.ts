import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { ResourceBundleClass } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { ResourceBundleListCondition } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundleListCondition';
import { getMaterialTypeGroup, IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import CommonClassType from '../formattingTime/CommonClassType';
import { EquipmentGroupTypeClass } from './EquipmentGroupTypeClass';

interface IState {
  resourceBundleCondition: ResourceBundleListCondition
  resourceBundleList: ResourceBundleClass[]
  resourceBundleListNumber: number
  MaterialTypeGroup: IMaterialTypeGroupItemType[]
  EquipmentGroupData: EquipmentGroupTypeClass
}

type IGetters = Record<string, never>;

interface IActions {
  getResourceBundleList: (Page?: number) => Promise<void>;
  getMaterialTypeGroup: () => Promise<void>;
  handleResourceBundleItemChange: (data: { item: ResourceBundleClass, isEdit: boolean, isRemove: boolean }) => void;
}

const options: DefineStoreOptions<string, IState, IGetters, IActions> = { // 存放公共数据的模块
  id: 'resourceStore',
  state: () => ({
    /** 物料资源包相关
     -------------------------------------*/
    resourceBundleCondition: new ResourceBundleListCondition(),
    resourceBundleList: [],
    resourceBundleListNumber: 0,
    MaterialTypeGroup: [], // 按分类返回的物料类型列表
    /** 设备组相关
     -------------------------------------*/
    EquipmentGroupData: new EquipmentGroupTypeClass(),
  }),
  getters: {
  },
  actions: {
    /** 物料资源包相关
     -------------------------------------*/
    async getResourceBundleList(Page = 1) {
      this.resourceBundleCondition.Page = Page;
      this.resourceBundleList = [];
      const temp = CommonClassType.filter(this.resourceBundleCondition);
      const resp = await api.getMaterialGroupList(temp).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.resourceBundleList = resp.data.Data as ResourceBundleClass[];
        this.resourceBundleListNumber = resp.data.DataNumber;
      }
    },
    async getMaterialTypeGroup() { // 获取按分类返回的物料类型列表
      this.MaterialTypeGroup = await getMaterialTypeGroup();
    },
    handleResourceBundleItemChange({ item, isEdit, isRemove }) { // 资源包添加|编辑|删除接口调用后的处理
      if (!isEdit && !isRemove) {
        this.resourceBundleList.unshift(item);
        this.resourceBundleListNumber += 1;
      } else {
        const i = this.resourceBundleList.findIndex(it => it.GroupID === item.GroupID);
        if ((i < 0)) return;
        if (isRemove) {
          this.resourceBundleList.splice(i, 1);
          this.resourceBundleListNumber -= 1;
        } else this.resourceBundleList.splice(i, 1, item);
      }
    },
  },
};

export const useResourceStore = defineStore(options);
