import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';

export interface IAssistListItem {
  ID: string;
  Name: string;
  Type: localEnumValueIDType;
  Position: {
    [key: string]: boolean;
  }
}
