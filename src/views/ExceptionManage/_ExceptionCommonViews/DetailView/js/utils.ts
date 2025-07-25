import { IExceptionWorking, IRedoReproduce } from '../../js/type';

/** 获取工序展示信息 */
export const getWorkingContent = (w: IExceptionWorking) => {
  const { Name, ReceiveMaterial, PlateMaking } = w;
  const content = (PlateMaking || ReceiveMaterial) ? `（${[ReceiveMaterial ? '重新领料' : '', PlateMaking ? '重新制版' : ''].filter(_it => _it).join('、')}）` : '';

  return `${Name}${content}`;
};

/** 获取大版重新信息 */
export const getReproduceContent = (Reproduce: IRedoReproduce | null) => {
  if (!Reproduce) return '';
  const m = Reproduce.ReceiveMaterial ? '重新领料' : '不再领料';
  const p = Reproduce.Platemaking ? '重新制版' : '不重新制版';
  const remark = [m, p].filter(it => it).join('、');

  return remark ? `重新生产（${remark}）` : '重新生产';
};
