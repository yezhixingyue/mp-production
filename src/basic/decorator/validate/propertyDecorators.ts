/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateIf } from 'class-validator';

/**
 * 当值为空时(是limitValues中的一项) 不再进行后续验证
 *
 * @param option 可选参数1. limitValues 当值属于该数组时生效 默认为['']
 * @param option 可选参数2. ifContinue 如果则继续后续验证 - 当返回值为true时不生效且继续后续验证 - 默认返回false
 * @returns
 */
export const AllowEmpty = <T = any>(option: { limitValues?: unknown[]; ifContinue?: (obj: T) => boolean } = {}) => ValidateIf((obj: T, val) => {
  const _limitValues = option.limitValues || [''];

  const _ifContinue = () => (option.ifContinue ? option.ifContinue(obj) : false);

  if (_ifContinue()) return true; // 返回true则需要通过后续验证

  return !_limitValues.includes(val);
});
