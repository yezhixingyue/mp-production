import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api/request/MaterialStorage';

interface CategoryType {
  CategoryID: number | undefined
  CategoryName: string
}
interface MaterialType {
  TypeID: number | undefined
  TypeName: string
}
interface AttributeSelectsType {
  SelectID: number,
  Sort: number,
  SelectItemValue: string
}
interface AttributeType {
 AttributeID: number,
 AttributeName: string,
 Sort: number,
 AttributeType: number,
 IsAllowDecimal: true,
 RegularQuantity: string,
 AttributeUnit: string,
 IsRequired: true,
 IsCustom: true,
 AttributeSelects: AttributeSelectsType[]
}
interface MaterialTypeSizeType {
  SizeID: number,
  SizeName: string,
  SizeCode: string,
  SizeLength: number,
  SizeWidth: number,
  SizeLengthIsChange: boolean,
  SizeWidthIsChange: boolean
}
interface MaterialAttributesType {
  CodeID: number| string,
  AttributeID: number| string,
  SelectID: number| string,
  NumericValue: string,
  InputSelectValue: string,
  SelectValue: string,

  AttributeUnit:string
}
interface MaterialSizesType {
  CodeID: number| string,
  SizeName: string,
  SizeLength: number,
  SizeWidth: number,
}
interface MaterialManageListType {
  CategoryID: number| string,
  CategoryName: string,
  ID: number| string,
  TypeID: number| string,
  TypeName: string,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  MaterialSizes: MaterialSizesType[]
}
interface SupplierSelectListType {
  SupplierID: number| string,
  SupplierName: string,
}
interface IState {
  CategoryList:CategoryType[],
  MaterialTypeList:MaterialType[],
  MaterialTypeAttributeAllList:AttributeType[]
  MaterialTypeSizeAllList:MaterialTypeSizeType[]
  MaterialManageList:MaterialManageListType[]
  SupplierSelectList:SupplierSelectListType[],
}
interface IActions {
  getMaterialCategoryList:()=>void,
  getMaterialTypeAll:(categoryID:number)=>void,
  getMaterialTypeAttributeAllByTypeID: (TypeID:number, callback?)=>void
  getMaterialTypeSizeAllByTypeID: (TypeID:number, callback?)=>void
  getMaterialManageList: (getMaterialManageData:object, callback?)=>void
  getSupplierSelectList: (callback?)=>void
}
type IGetters = {
  selectMaterialTypeAttribute: ()=>AttributeType[]
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
  }),
  getters: {
    // 选择项的属性
    selectMaterialTypeAttribute() {
      return this.MaterialTypeAttributeAllList.filter((it) => it.AttributeType === 2);
    },
  },
  actions: {
    // 物料所有分类查询
    getMaterialCategoryList(data = {}) {
      api.getMaterialCategoryAll(data).then(res => {
        if (res.data.Status === 1000) {
          this.CategoryList = res.data.Data as CategoryType[];
        }
      });
    },
    // 所有物料类型
    getMaterialTypeAll(categoryID) {
      if (!categoryID) return;
      api.getMaterialTypeAll(categoryID).then(res => {
        if (res.data.Status === 1000) {
          this.MaterialTypeList = res.data.Data as MaterialType[];
        }
      });
    },
    // 所有属性
    getMaterialTypeAttributeAllByTypeID(TypeID, callback = () => null) {
      if (!TypeID) return;
      api.getMaterialTypeAttributeAll({ TypeID }).then((res) => {
        if (res.data.Status === 1000) {
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
        if (res.data.Status === 1000) {
          this.MaterialTypeSizeAllList = res.data.Data as MaterialTypeSizeType[];
          callback();
        }
      });
    },
    // 所有物料
    getMaterialManageList(getMaterialManageData, callback = () => null) {
      api.getMaterialList(getMaterialManageData).then(res => {
        if (res.data.Status === 1000) {
          // 成功
          this.MaterialManageList = res.data.Data as MaterialManageListType[];
          callback(res.data.DataNumber as number);
        }
      });
    },
    // 所有供应商
    getSupplierSelectList() {
      api.getMaterialSupplierSelect().then(res => {
        if (res.data.Status === 1000) {
          // 成功
          this.SupplierSelectList = res.data.Data as SupplierSelectListType[];
        }
      });
    },
  },
};
export const useMaterialWarehouseStore = defineStore(options);
