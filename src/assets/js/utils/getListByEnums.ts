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

export interface ILocalEnum {
  [key: string]: ILocalEnumValue
}

export const getListByEnums = (enums: ILocalEnum, options: IGetListByEnumsOptions = {}) => {
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
