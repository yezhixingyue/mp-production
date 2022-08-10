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
interface IState {
  CategoryList:CategoryType[],
  MaterialTypeList:MaterialType[],
  MaterialTypeAttributeAllList:AttributeType[]
  MaterialTypeSizeAllList:MaterialTypeSizeType[]
}
interface IActions {
  getMaterialCategoryList:()=>void,
  getMaterialTypeAll:(categoryID:number)=>void,
  getMaterialTypeAttributeAllByTypeID: (TypeID:number, callback?)=>void
  getMaterialTypeSizeAllByTypeID: (TypeID:number, callback?)=>void
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
  },
};
export const useMaterialWarehouseStore = defineStore(options);
