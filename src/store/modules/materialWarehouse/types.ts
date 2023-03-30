export interface CategoryType {
  CategoryID: number | undefined
  CategoryName: string
}
export interface MaterialType {
  TypeID: string
  TypeName: string
}
export interface AttributeSelectsType {
  SelectID: string,
  Sort: number,
  SelectItemValue: string
}
export interface AttributeType {
 AttributeID: string,
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
export interface MaterialTypeSizeType {
  SizeID: string,
  SizeName: string,
  SizeCode: string,
  SizeDescribe: string,
  SizeLength: number,
  SizeWidth: number,
  SizeLengthIsChange: boolean,
  SizeWidthIsChange: boolean
}
export interface MaterialAttributesType {
  CodeID: number| string,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,

  AttributeUnit:string
}
export interface MaterialSizesType {
  CodeID: number| string,
  SizeName: string,
  SizeLength: number,
  SizeWidth: number,
}
export interface MaterialManageListType {
  CategoryID: number| string,
  CategoryName: string,
  ID: string,
  TypeID: string,
  TypeName: string,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  MaterialSizes: MaterialSizesType[]
}
export interface SupplierSelectListType {
  SupplierID: string,
  SupplierName: string,
}
export interface getMaterialType {
  categoryID: number| string,
  isStock?: boolean,
}
export interface MaterialTypes {
  TypeID: string,
  TypeName: string
}
export interface MaterialTypeGroupType {
  CategoryID: number,
  CategoryName: string,
  MaterialTypes: MaterialTypes[]
}
export interface IState {
  CategoryList:CategoryType[],
  MaterialTypeList:MaterialType[],
  MaterialTypeAttributeAllList:AttributeType[]
  MaterialTypeSizeAllList:MaterialTypeSizeType[]
  MaterialManageList:MaterialManageListType[]
  SupplierSelectList:SupplierSelectListType[],
  MaterialTypeGroup:MaterialTypeGroupType[],
}
