import { validateSync, type ValidationError } from 'class-validator';
import type { MyValidationDecorator } from './MyValidationDecorator';

/**
 * 校验相关类
 *
 * @export
 * @class ValidateHandler
 */
export class ValidateHandler {
  private static result: null | { identifier: string; data: ValidationError[] } = null // 校验结果缓存

  private static validateWithCache(target: MyValidationDecorator) { // 校验及缓存相关
    const identifier = target.constructor.name + JSON.stringify(target);

    if (this.result && this.result.identifier === identifier) {
      return this.result.data;
    }

    const data = validateSync(target, { validationError: { target: false }, stopAtFirstError: true });

    this.result = { identifier, data }; // 缓存当次校验结果

    return data;
  }

  private static pickErrorsFromValidationResult(validationErrors: ValidationError[]) { // 提取错误信息字符串数组
    const errors: string[] = []; // 错误信息列表

    validationErrors.forEach(it => {
      if (it.constraints) {
        const arr = Object.values(it.constraints);
        if (arr.length > 0) errors.push(...arr.filter(_it => _it));
      }
    });

    return errors;
  }

  /**
   * 校验并获取校验结果
   *
   * @static
   * @param {MyValidationDecorator} target 校验目标 其应继承于MyValidationDecorator类
   * @param {string} [fieldName] 传递则校验字段 不传递则校验整体
   * @returns {errors} 返回错误信息列表  --  字符串数组
   * @memberof ValidateHandler
   */
  static getValidationErrors(target: MyValidationDecorator, fieldName?: string) {
    let validationErrors = this.validateWithCache(target);

    if (fieldName) {
      const t = validationErrors.find(it => it.property === fieldName);

      validationErrors = t ? [t] : [];
    }

    return this.pickErrorsFromValidationResult(validationErrors); // 返回由错误信息组成的字符串数组
  }
}
