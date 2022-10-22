import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import type {
  NotesType, SelectAssistInfoGroup, MaterialTypeGroupsType,
  MaterialTypeGroupType, ProcessListType, ImpositionTemmplateListType,
} from '@/store/modules/productionSetting/types';

import { IState, _UseClassEquipmentGroupType, getPropertyListType } from './types';

export interface IActions {
  getEquipmentGroup:(callback?)=>void,
  getResourceNoteGroup:(callback?)=>void,
  getMaterialTypeGroupAll:(callback?)=>void,
  getImpositionTemmplateList:(callback?)=>void,
  getPropertyList:(data:getPropertyListType)=>void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'productionSetting',
  state: () => ({
    EquipmentListGroup: [],
    ResourceNoteGroup: [],
    MaterialTypeGroup: [],
    ImpositionTemmplateList: [],
    PropertyList: [],
  }),
  getters: {},
  actions: {
    // 获取所有设备组
    getEquipmentGroup() {
      api.getEquipmentGroup().then(res => {
        if (res.data.Status === 1000) {
          const temp = res.data.Data as _UseClassEquipmentGroupType[];
          this.EquipmentListGroup = [];
          temp.forEach(item => {
            const EquipmentGroups = item.EquipmentGroups.map(it => ({
              ID: it.GroupID,
              Name: it.GroupName,
            }));
            this.EquipmentListGroup.push({
              ClassID: item.ClassID,
              ClassName: item.ClassName,
              EquipmentGroups,
            });
          });
        }
      });
    },
    // 获取所有文件
    getResourceNoteGroup() {
      api.getResourceNoteGroup().then(res => {
        if (res.data.Status === 1000) {
          const temp = res.data.Data as SelectAssistInfoGroup[];
          temp.forEach((item, i) => {
            temp[i].Notes = item.Notes.map(it => ({ ...it, Type: item.Type }));
          });
          this.ResourceNoteGroup = temp;
        }
      });
    },
    // 获取所有物料资源包
    getMaterialTypeGroupAll() {
      api.getMaterialTypeGroupAll().then(res => {
        if (res.data.Status === 1000) {
          this.MaterialTypeGroup = res.data.Data as MaterialTypeGroupType[];
        }
      });
    },
    // 获取拼版模板列表
    getImpositionTemmplateList(Data) {
      api.getImpositionTemmplateList(Data).then(res => {
        if (res.data.Status === 1000) {
          this.ImpositionTemmplateList = res.data.Data as ImpositionTemmplateListType[];
        }
      });
    },
    async getPropertyList(data) {
      const resp = await api.propertyApis.getPropertyList(data).catch(() => null);
      if (resp?.data.isSuccess) {
        this.PropertyList = resp.data.Data || [];
      }
    },
  },
};
export const useProductionSettingStore = defineStore(options);
