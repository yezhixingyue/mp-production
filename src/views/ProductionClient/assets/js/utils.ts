import { INextWorkingProduction } from './types';

/** 获取下一道工序的文字展示内容 仅下一道工序为单个送达地点时才可展示出来 */
export const getNextWorkContentOnlySingle = (NextWorkingList?: INextWorkingProduction[]) => {
  let str = '';

  if (NextWorkingList?.length === 1) {
    const next = NextWorkingList[0];
    if (!next.Name) return '';

    str += next.Name;

    if (next.Equipment) {
      const _class = [next.Equipment.GroupName, next.Equipment.Name].filter(it => it).join('-');
      if (_class) {
        str += `（${_class}）`;
      }
    }
  }

  return str;
};

export const filterNextWorkingList = (NextWorkingList: INextWorkingProduction[]) => {
  const obj: { [key: string]: INextWorkingProduction } = {};

  NextWorkingList.forEach(it => {
    if (it.Color && !obj[it.Color]) {
      obj[it.Color] = it;
    }
  });

  return Object.values(obj);
};
