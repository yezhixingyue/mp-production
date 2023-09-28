import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { PlaceOrderMaterialSourceEnumList } from '../../ManualOrderHandlerPage/js/EnumList';
import { ExternalMaterialStatusEnumList } from './EnumList';
import { IExternalMaterialDetail } from './types';

export const formatTableList = (list: IExternalMaterialDetail[]) => {
  const _getNextWorkingText = (it: IExternalMaterialDetail) => {
    if (it.NextWorking?.Equipment) {
      const { GroupName, Name } = it.NextWorking.Equipment;
      return [GroupName, Name].filter(_it => _it).join('-');
    }

    return '';
  };

  const _list = list.map(it => ({
    ...it,
    _Number: it.Number || it.Number === 0 ? `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit || ''}` : '',
    _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
    _CustomerInfo: `${it.Customer || ''}${it.Mobile ? `(${it.Mobile})` : ''}`,
    _MaterialSource: getEnumNameByID(it.MaterialSource, PlaceOrderMaterialSourceEnumList),
    _ReceiveTime: format2MiddleLangTypeDateFunc2(it.ReceiveTime),
    _Status: getEnumNameByID(it.Status, ExternalMaterialStatusEnumList),
    _NextWorkingText: _getNextWorkingText(it),
  }));

  return _list;
};
