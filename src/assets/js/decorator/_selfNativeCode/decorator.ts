/* eslint-disable @typescript-eslint/no-explicit-any */

/** 创建一个类属性验证装饰器  */
const _createPropValidateItem = (validationFn: (propertyName: string, value?: any) => string) => (target: any, propertyName: string) => {
  const _target = target;

  if (!_target._validateList) {
    _target._validateList = [];
  }

  _target._validateList.push({
    validationFn: (value: any) => validationFn(propertyName, value),
    key: propertyName,
  });
};

/**
 * 非空验证 不能为''或null
 *
 * @param {(string | { msg: string })} msg
 */
export const NotEmpty = (option?: string | { msg: string }) => {
  const validationFn = (propertyName: string, value?: any) => {
    const msg = typeof option === 'string' ? option : option?.msg || `${propertyName}不能为空`;

    if (value === null || value === undefined || value === '') {
      return msg;
    }

    if (Array.isArray(value) && value.length === 0) {
      return msg;
    }

    if (typeof value === 'object' && Object.keys(value).length > 0) {
      return msg;
    }

    return '';
  };

  return _createPropValidateItem(validationFn);
};

/** 验证字符串类型属性的长度 */
export const Length = (option?: { min?: number, max?: number, msg?: string }) => {
  const validationFn = (propertyName: string, value?: any) => {
    if (option) {
      console.log('length value: ', value);
      if (typeof value !== 'string') {
        throw new Error('格式不正确，Length 仅能验证字符串类型');
      }
      const { min, max, msg } = option;

      if (typeof min !== 'number' && typeof max !== 'number') {
        throw new Error('Length 装饰器');
      }

      if ((typeof min === 'number' && value.length < min) || (typeof max === 'number' && value.length > max)) {
        return msg || `${propertyName}长度不符合要求`;
      }
    }

    return '';
  };

  return _createPropValidateItem(validationFn);
};

/** 验证属性是否符合传入的正则表达式 */
export const Is = (option: { reg: RegExp, msg: string }) => {
  const validationFn = (propertyName: string, value?: any) => {
    if (option && option.reg) {
      const { reg, msg } = option;

      if (!(reg instanceof RegExp)) {
        throw new Error('Is reg不是正则表达式');
      }

      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error('Is 仅能验证字符串或数字类型');
      }

      if (!reg.test(`${value}`)) {
        return msg || `${propertyName}格式不正确`;
      }
    }

    return '';
  };

  return _createPropValidateItem(validationFn);
};

// export const validate = (target: new (...args: any[]) => object) => { // ts提示会出问题 如果直接加到原型中的话 ts并不知道 所以暂不使用该方法
//   const _target = target;
//   _target.prototype._validate = (obj: object) => {
//     // 需要验证的条目信息
//     const validateList: { key: string, validationFn: (value: any) => string }[] = _target.prototype._validateList || [];

//     return validateList.map(it => it.validationFn(obj[it.key])).filter(it => it); // 此处写的较简单 未验证obj中是否存在key属性
//   };
// };

export const validate = (obj: any) => {
  // 需要验证的条目信息
  const validateList: { key: string, validationFn: (value: any) => string }[] = obj._validateList || [];

  return validateList.map(it => it.validationFn(obj[it.key])).filter(it => it); // 此处写的较简单 未验证obj中是否存在key属性
};
