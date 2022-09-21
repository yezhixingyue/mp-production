export type localEnumValueIDType = '' | number;

interface ILocalEnumValue {
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

export const getEnumNameByIDAndEnums = (id: localEnumValueIDType, enums: IEnumsType) => {
  const t = Object.values(enums).find(it => it.ID === id);
  return t ? t.Name : '';
};
