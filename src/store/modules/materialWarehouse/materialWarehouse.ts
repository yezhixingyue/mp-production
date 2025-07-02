import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import {
  IState, getMaterialType, AttributeType,
  CategoryType,
  MaterialType,
  MaterialTypeSizeType,
  MaterialManageListType,
  SupplierSelectListType,
  MaterialTypeGroupType,
} from './types';

interface IActions {
  getMaterialCategoryList:(data?, callback?)=>void,
  getMaterialTypeAll:(data:getMaterialType, callback?)=>void,
  getMaterialTypeAttributeAllByTypeID: (TypeID:string, callback?)=>void
  getMaterialTypeSizeAllByTypeID: (TypeID:string, callback?)=>void
  getMaterialManageList: (getMaterialManageData:object, callback?)=>void
  getSupplierSelectList: (callback?)=>void
  getMaterialTypeGroup: ()=>void
}
type IGetters = {
  selectMaterialTypeAttribute: ()=>AttributeType[]
  selectNumberMaterialTypeAttribute: ()=>AttributeType[]
};

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'materialWarehouse',
  state: () => ({
    CategoryList: [],
    MaterialTypeList: [],
    MaterialTypeAttributeAllList: [],
    MaterialTypeSizeAllList: [],
    MaterialManageList: [],
    SupplierSelectList: [],
    MaterialTypeGroup: [],
  }),
  getters: {
    // 选择项的属性
    selectMaterialTypeAttribute() {
      return this.MaterialTypeAttributeAllList.filter((it) => it.AttributeType === 2);
    },
    // 数字的属性
    selectNumberMaterialTypeAttribute() {
      return this.MaterialTypeAttributeAllList.filter((it) => it.AttributeType === 1);
    },
  },
  actions: {
    // 物料所有分类查询
    getMaterialCategoryList(data = {}, callback = () => null) {
      api.getMaterialCategoryAll(data).then(res => {
        if (res?.data?.Status === 1000) {
          this.CategoryList = res.data.Data as CategoryType[];
          callback();
        }
      });
    },
    // 所有物料类型
    getMaterialTypeAll({ categoryID, isStock = true }, callback = () => null) {
      if (!categoryID) return;
      api.getMaterialTypeAll({ categoryID, isStock }).then(res => {
        if (res?.data?.Status === 1000) {
          this.MaterialTypeList = res.data.Data as MaterialType[];
          callback();
        }
      });
    },
    // 所有属性
    getMaterialTypeAttributeAllByTypeID(TypeID, callback = () => null) {
      if (!TypeID) return;
      api.getMaterialTypeAttributeAll({ TypeID }).then((res) => {
        if (res?.data?.Status === 1000) {
          const temp = res.data.Data as AttributeType[];
          this.MaterialTypeAttributeAllList = temp.sort((a, b) => a.Sort - b.Sort);
          callback();
        }
      });
    },
    // 物料所有尺寸查询
    getMaterialTypeSizeAllByTypeID(TypeID, callback = () => null) {
      if (!TypeID) return;
      api.getMaterialTypeSizeAll(TypeID).then((res) => {
        if (res?.data?.Status === 1000) {
          this.MaterialTypeSizeAllList = res.data.Data as MaterialTypeSizeType[];
          callback();
        }
      });
    },
    // 所有物料
    getMaterialManageList(getMaterialManageData, callback = () => null) {
      api.getMaterialList(getMaterialManageData).then(res => {
        if (res?.data?.Status === 1000) {
          // 成功
          this.MaterialManageList = res.data.Data as MaterialManageListType[];
          callback(res.data.DataNumber as number);
        }
      });
    },
    // 所有供应商
    getSupplierSelectList(typeID) {
      api.getMaterialSupplierSelect(typeID).then(res => {
        if (res?.data?.Status === 1000) {
          // 成功
          this.SupplierSelectList = res.data.Data as SupplierSelectListType[];
        }
      });
    },
    // 所有物料分类及类型分组查询
    getMaterialTypeGroup() {
      api.getMaterialTypeGroup().then(res => {
        if (res?.data?.Status === 1000) {
          // 成功
          this.MaterialTypeGroup = res.data.Data as MaterialTypeGroupType[];
        }
      });
    },
  },
};
export const useMaterialWarehouseStore = defineStore(options);
