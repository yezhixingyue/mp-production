import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';

export const AssistInfoTypeEnums = {
  file: {
    ID: 0,
    Name: '文件',
  },
  text: {
    ID: 1,
    Name: '文字信息',
  },
  numerical: {
    ID: 2,
    Name: '数值',
  },
};

export class AssistListConditionClass {
  Type: localEnumValueIDType = ''

  Page = 1

  PageSize = 20
}
