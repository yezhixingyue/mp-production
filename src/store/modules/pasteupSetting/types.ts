import { ImpositionTemmplate } from '@/views/pasteupSetting/pasteupTemplate/types';

export interface FoldWayTemplateClassType {
  Type: number,
  CreateTime: string,
  ID: number,
  Name: string
}
export interface getImpositionTemmplateDataType {
  Page: number,
  PageSize: number,
}
export interface IState {
  FoldWayTemplateClassList:FoldWayTemplateClassType[],
  ImpositionTemmplateClassList:FoldWayTemplateClassType[],
  ImpositionTemmplateList:ImpositionTemmplate[],
  getImpositionTemmplateData: getImpositionTemmplateDataType,
}
