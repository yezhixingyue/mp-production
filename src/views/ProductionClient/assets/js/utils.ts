import api from '@/api';
import clientApi from '@/api/client';
import { clientRouteName } from '@/router/modules/config';
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

export const filterNextWorkingList = async (TaskWorkingID: string) => {
  // 需要区分client还是后台 -- 通过url进行区分
  const requestFunc = window.location.hash.includes(`/${clientRouteName}`)
    ? clientApi.getEquipmentNextWorkingList
    : api.outsourceApis.getEquipmentNextWorkingList;

  const resp = await requestFunc(TaskWorkingID).catch(() => null);

  if (!resp || !resp.data.isSuccess) return [];

  const NextWorkingList = resp.data.Data || [];

  const obj: { [key: string]: INextWorkingProduction } = {};

  NextWorkingList.forEach(it => {
    const key = `${it.Color}${it.Name}`;
    if (it.Color && key && !obj[key]) {
      obj[key] = it;
    }
  });

  return Object.values(obj);
};
