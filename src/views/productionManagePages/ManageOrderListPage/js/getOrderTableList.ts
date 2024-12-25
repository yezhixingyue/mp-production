import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IManageOrderListItem, ISellOrderInstanceItem } from './type';
import { OrderStatusList } from './enum';

const getSellSideProductName = (it: IManageOrderListItem) => {
  const { FirstLevel, SecondLevel, ProductName } = it;
  const list = [FirstLevel || '', SecondLevel || '', ProductName || ''];
  return list.filter(it => it).join('-');
};

/** 获取普通生产线的生产线列的展示内容 */
export const _getNormalOrderLineContent = (instance: ISellOrderInstanceItem) => {
  const { LineList, PrintFileRemark, AfterPrintFileRemark } = instance;

  const _LineContent = LineList.map(l => (l.PlateList.length > 0 ? `${l.Name} 大版ID:${l.PlateList.join('、')}` : ''))
    .filter(it => it)
    .join('；\r\n') || '';

  const _PrintFileRemark = PrintFileRemark ? ` \r\n印刷版: ${PrintFileRemark || ''}` : '';
  const _AfterPrintFileRemark = AfterPrintFileRemark ? ` \r\n后工版: ${AfterPrintFileRemark || ''}` : '';

  return [_LineContent, _PrintFileRemark, _AfterPrintFileRemark].filter(it => it).join('；');
};

const _getRootNormalOrderLineContent = (it: IManageOrderListItem) => {
  if (it.InstanceList.length > 1 && it.AfterPrintFileRemark) return `后工版: ${it.AfterPrintFileRemark}`;

  if (it.InstanceList[0]) return _getNormalOrderLineContent(it.InstanceList[0]);

  return '';
};

const getIsMakeuped = (it: IManageOrderListItem) => {
  const t = it.InstanceList.find(ins => ins.LineList.find(l => l.PlateList.length > 0));

  return !!t;
};

export const getOrderTableListItem = (it: IManageOrderListItem, spreadList: string[]) => ({
  ...it,
  /** 销售端产品 */
  _SellSideProductName: getSellSideProductName(it),
  _Count: [`${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit}`, it.KindCount ? `${it.KindCount}款` : ''].filter(it => it).join(' '),
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  _ProduceEndTime: format2MiddleLangTypeDateFunc2(it.WishFinishTime),
  _isSpread: spreadList.includes(it.ID),
  _isCombineLine: it.InstanceList.length > 1,
  _Size: it.InstanceList.length > 1 ? it.Size || '' : it.InstanceList[0]?.Size || '',
  _Material: it.InstanceList.length > 1 ? '' : it.InstanceList[0]?.Material || '',
  _LineContent: _getRootNormalOrderLineContent(it),
  _isMakeuped: getIsMakeuped(it),
  _StatusDetail: OrderStatusList.find(_it => _it.ID === it.Status),
});
