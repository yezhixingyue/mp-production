import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { IState, FoldWayTemplateClassType } from './types';

export interface IActions {
  getFoldWayTemplateClassList:(callback?)=>void,
  getImpositionTemmplateClassList:(callback?)=>void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'pasteupSetting',
  state: () => ({
    FoldWayTemplateClassList: [],
    ImpositionTemmplateClassList: [],
  }),
  getters: {},
  actions: {
    // 折手模板
    getFoldWayTemplateClassList(callback = () => null) {
      api.getFoldWayTemplateClassList().then(res => {
        if (res.data.Status === 1000) {
          this.FoldWayTemplateClassList = res.data.Data as FoldWayTemplateClassType[];
          callback(res.data.DataNumber);
          //
        }
      });
    },
    // 拼版模板列表
    getImpositionTemmplateClassList(callback = () => null) {
      api.getImpositionTemmplateClassList().then(res => {
        if (res.data.Status === 1000) {
          this.ImpositionTemmplateClassList = res.data.Data as FoldWayTemplateClassType[];
          callback(res.data.DataNumber);
          //
        }
      });
    },
  },
};
export const usePasteupSettingStore = defineStore(options);
