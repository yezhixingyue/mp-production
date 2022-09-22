interface IgetNameByIDAndListOptions {
  key: string
  value: string
}

interface IListItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

type IdType = number|string|undefined;

/**
 * 在一个列表中， 根据ID去找到其对应的Name值 (ID 和 Name 字段可自定义)
 *
 * @template T
 * @param {T} ids 单个id  或 id组成的数组
 * @param {IListItem<T>[]} list
 * @param {IgetNameByIDAndListOptions} [options={ key: 'Name', value: 'ID' }] 自定义ID和Name字段
 * @returns 怎么根据T的类型 以及 options的值 去做为类型 来限制list的类型呢
 */
export const getNameByIDAndList = (ids: IdType|IdType[], list: IListItem[], options: IgetNameByIDAndListOptions = { key: 'Name', value: 'ID' }): string => {
  if (typeof ids === 'undefined') return '';
  if (ids && typeof ids === 'object') {
    return list.filter(it => ids.includes(it[options.value])).map(it => it[options.key] || '').filter(it => it).join('、');
  }
  const id = ids;
  const t = list.find(it => it[options.value] === id);
  return t && typeof t[options.key] === 'string' ? t[options.key] : '';
};
