import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import type {
  SelectAssistInfoGroup,
  MaterialTypeGroupType, ImpositionTemmplateListType,
} from '@/store/modules/productionSetting/types';

import { LinePutOutClass } from '@/views/productionSetting/putOutAndCapacity/js/LinePutOutClass';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { LineCapacityClass } from '@/views/productionSetting/putOutAndCapacity/js/LineCapacityClass';
import { EquipmentListType } from '@/views/productionSetting/putOutAndCapacity/js/types';
import { PlateMakingGroupManageClass } from '@/views/productionSetting/PlateMakingGroupView/js/PlateMakingGroupManageClass';
import { PlateMakingWorkSetupClass } from '@/views/productionSetting/productionLine/js/PlateMakingWorkSetupClass';
import { IState, _UseClassEquipmentGroupType, getPropertyListType } from './types';

export interface IActions {
  getEquipmentGroup:(callback?)=>void,
  getResourceNoteGroup:(callback?)=>void,
  getMaterialTypeGroupAll:(callback?)=>void,
  getImpositionTemmplateList:(callback?)=>void,
  getPropertyList:(data:getPropertyListType)=>void,
  setLinePutOutPageData: (data: EquipmentListType) => void,
  setLineCapacityPageData: (data: EquipmentListType) => void,
  setCombineLinePutOutPageData: (data: EquipmentListType) => void,
  setCombineLineCapacityPageData: (data: EquipmentListType) => void,
  initPlateMakingGroupManageData: () => void,
  setPlateMakingGroupPutOutPageData: (data: EquipmentListType) => void,
  setPlateMakingGroupCapacityPageData: (data: EquipmentListType) => void,
  setPlateMakingWorkSetupHanderInit: () => void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'productionSetting',
  state: () => ({
    EquipmentListGroup: [],
    ResourceNoteGroup: [],
    MaterialTypeGroup: [],
    /** 仅工序列表使用？ */
    ImpositionTemmplateList: [],
    PropertyList: [],
    LinePutOutPageData: null,
    LineCapacityPageData: null,
    CombineLinePutOutPageData: null,
    CombineLineCapacityPageData: null,
    /** 制版组 */
    PlateMakingGroupManageData: new PlateMakingGroupManageClass(),
    PlateMakingGroupPutOutPageData: null,
    PlateMakingGroupCapacityPageData: null,
    /** 制版工序设置 */
    PlateMakingWorkSetupHander: new PlateMakingWorkSetupClass(),
  }),
  getters: {},
  actions: {
    // 获取所有设备组
    getEquipmentGroup() {
      api.getEquipmentGroup().then(res => {
        if (res?.data?.Status === 1000) {
          const temp = res.data.Data as _UseClassEquipmentGroupType[];
          this.EquipmentListGroup = [];
          temp.forEach(item => {
            const EquipmentGroups = item.EquipmentGroups.map(it => ({
              ID: it.GroupID,
              Name: it.GroupName,
              AllowBatchReport: it.AllowBatchReport,
            }));
            this.EquipmentListGroup.push({
              ClassID: item.ClassID,
              ClassName: item.ClassName,
              ID: item.ClassID,
              Name: item.ClassName,
              EquipmentGroups,
            });
          });
        }
      });
    },
    // 获取所有文件
    getResourceNoteGroup() {
      api.getResourceNoteGroup().then(res => {
        if (res?.data?.Status === 1000) {
          const temp = res.data.Data as SelectAssistInfoGroup[];
          temp.forEach((item, i) => {
            temp[i].Notes = item.Notes.map(it => ({ ...it, Type: item.Type }));
          });
          this.ResourceNoteGroup = temp;
        }
      });
    },
    // 获取所有物料资源包
    async getMaterialTypeGroupAll(feature) {
      const resp = await api.getMaterialTypeGroupAll(feature).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.MaterialTypeGroup = resp.data.Data as MaterialTypeGroupType[];
      }
    },
    // 获取拼版模板列表 -- 仅工序列表使用？
    getImpositionTemmplateList(Data) {
      api.getImpositionTemmplateList(Data).then(res => {
        if (res?.data?.Status === 1000) {
          this.ImpositionTemmplateList = res.data.Data as ImpositionTemmplateListType[];
        }
      });
    },
    async getPropertyList(data) {
      const resp = await api.propertyApis.getPropertyList(data).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.PropertyList = resp.data.Data || [];
      }
    },
    /** 设置申放相关数据 */
    setLinePutOutPageData(LineEquipment) {
      this.LinePutOutPageData = new LinePutOutClass(LineEquipment, UseModuleEnum.WastageFormula);
    },
    setLineCapacityPageData(LineEquipment) {
      this.LineCapacityPageData = new LineCapacityClass(LineEquipment);
    },
    setCombineLinePutOutPageData(LineEquipment) {
      this.CombineLinePutOutPageData = new LinePutOutClass(LineEquipment, UseModuleEnum.UnionLineWastageFormula);
    },
    setCombineLineCapacityPageData(LineEquipment) {
      this.CombineLineCapacityPageData = new LineCapacityClass(LineEquipment);
    },
    initPlateMakingGroupManageData() {
      this.PlateMakingGroupManageData.getWorkingList();
    },
    setPlateMakingGroupPutOutPageData(LineEquipment) {
      this.PlateMakingGroupPutOutPageData = new LinePutOutClass(LineEquipment);
    },
    setPlateMakingGroupCapacityPageData(LineEquipment) {
      this.PlateMakingGroupCapacityPageData = new LineCapacityClass(LineEquipment);
    },
    /** 制版工序设置 */
    setPlateMakingWorkSetupHanderInit() {
      this.PlateMakingWorkSetupHander.init();
    },
  },
};
export const useProductionSettingStore = defineStore(options);
