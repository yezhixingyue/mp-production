import { defineStore, DefineStoreOptions } from 'pinia';
import ClassType from '@/store/modules/formattingTime/CommonClassType';
import api from '@/api';
import type { IMaterial, IList } from '@/store/modules/materialWarehouse/StoresRequisitionTypes';

interface IGetListData {
  DateType: string,
  Material: IMaterial,
  Status: string,
  CreateTime: {
    First: string,
    Second: string,
  },
  Page: number,
  KeyWords: string,
  PageSize: number,
}
interface IState {
  DataTotal: number,
  List: IList[],
  // 获取领料单列表
  getListData: IGetListData,
}
interface IActions {
  getList:(page?:number)=>void,
  clearCondition:()=>void,
  ChangeMaterialClassID: (ClassID:number) => void,
  ChangeCondition: ([key, value]:[key:string, value:string]) => void,
  setCondition4DataList: ([[key1, key2], value]: [key:string[], value:string]) => void,
  getData: () => void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'storesRequisitionStore',
  state: () => ({
    DataTotal: 0,
    List: [],
    // 获取领料单列表
    getListData: {
      DateType: 'today',
      Material: {
        ClassID: 0,
        ClassName: '',
        TypeID: '',
        TypeName: '',
        MaterialID: '',
        MaterialName: '',
      },
      Status: '',

      CreateTime: {
        First: '',
        Second: '',
      },
      Page: 1,
      KeyWords: '',
      PageSize: 20,
    },
  }),
  getters: {
  },
  actions: {
    getList(Page = 1) {
      this.getListData.Page = Page;
      ClassType.setDate(this.getListData, 'CreateTime');
      const _obj = ClassType.filter(this.getListData, true);
      api.productionManageApis.getMaterialRequisitionList(_obj).then(res => {
        if (res?.data?.Status === 1000) {
          this.List = res.data.Data as IList[];
          this.DataTotal = res.data.DataNumber;
        }
      });
    },
    clearCondition() {
      this.getListData = {
        DateType: 'today',
        Material: {
          ClassID: 0,
          ClassName: '',
          TypeID: '',
          TypeName: '',
          MaterialID: '',
          MaterialName: '',
        },
        Status: '',

        CreateTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    },
    getData() {
      this.getList();
    },
    ChangeMaterialClassID(ClassID) {
      this.getListData.Material.ClassID = ClassID;
    },
    ChangeCondition([key, value]) {
      this.getListData[key] = value;
    },
    setCondition4DataList([[key1, key2], value]) {
      if (key2) this.getListData[key1][key2] = value;
      else this.getListData[key1] = value;
    },
  },
};
export const useStoresRequisition = defineStore(options);
