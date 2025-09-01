import api from '@/api';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PutOutCapacityCommonListClass } from './PutOutCapacityCommonListClass';
import { PutOutConditionItemType } from './PutOutConditionItemClass';

export class LinePutOutClass extends PutOutCapacityCommonListClass<PutOutConditionItemType> {
  getListFunc = (params: Parameters<PutOutCapacityCommonListClass<PutOutConditionItemType>['getListFunc']>[0]) => {
    if (Array.isArray(params)) return Promise.resolve(null);

    return api.formulaApis.getFormulaList(params);
  }

  removeFunc = (id: number | string) => (typeof id === 'number' ? Promise.resolve(null) : api.formulaApis.getFormulaRemove(id));

  saveFunc = api.formulaApis.getFormulaSave

  UseModule = UseModuleEnum.PutOutLimit
}
