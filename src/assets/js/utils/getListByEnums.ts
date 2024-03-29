export type localEnumValueIDType = '' | number;

export interface ILocalEnumValue {
  ID: localEnumValueIDType,
  Name: string,
}

interface IGetListByEnumsOptions {
  withNoLimit?: boolean,
  label?: string,
  value?: localEnumValueIDType,
}

export interface IEnumsType {
  [key: string]: ILocalEnumValue
}

/**
 * 通过自定义枚举对象 生成 对应枚举列表
 *
 * @param {IEnumsType} enums 枚举对象
 * @param {IGetListByEnumsOptions} [options={}] 选项 withNoLimit： 是否包含不限 默认false  label："不限"的展示文字 value: "不限"的值
 * @returns
 */
export const getEnumList = (enums: IEnumsType, options: IGetListByEnumsOptions = {}) => {
  const list: ILocalEnumValue[] = [];

  Object.keys(enums).forEach(key => {
    list.push({ ...enums[key] });
  });

  const _options: Required<IGetListByEnumsOptions> = {
    withNoLimit: false,
    label: '不限',
    value: '',
    ...options,
  };

  if (_options.withNoLimit) {
    list.unshift({ ID: _options.value, Name: _options.label });
  }

  return list;
};

/**
 * 提取ts枚举中所有的值组成列表， 排除excepts内的内容项
 *
 * @template E 枚举类型
 * @param {any} Enums 枚举类型
 * @param {EnumT[]} [excepts=[]] 需要排除的枚举选项组成的数组
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEnumValuesByTsEnum = <EnumT = number>(Enums: any, excepts:EnumT[] = []):EnumT[] => {
  if (typeof Enums !== 'object' || !Enums) return [];
  const _list = Object.keys(Enums)
    .filter(key => !/^\d+$/.test(key) && !excepts.includes(Enums[key]))
    .map(key => Enums[key]);

  return _list;
};

/** 通过ID和枚举列表获取项目的Name */
export function getEnumNameByID(id: localEnumValueIDType, data: ILocalEnumValue[]): string
/** 通过ID和枚举对象获取项目的Name */
export function getEnumNameByID(id: localEnumValueIDType, data: IEnumsType): string
/** 通过ID和枚举列表（或枚举对象）获取项目的Name */
export function getEnumNameByID(id: localEnumValueIDType, data: ILocalEnumValue[] | IEnumsType) {
  let t: undefined | ILocalEnumValue;
  if (Array.isArray(data)) {
    t = data.find(it => it.ID === id);
  } else {
    t = Object.values(data).find(it => it.ID === id);
  }
  return t ? t.Name : '';
}
