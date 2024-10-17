import { reflectMetaDataHandler } from './reflectMetaDataHandler';
import type { IMeta } from './types';

/** 校验出错误时，是否直接进行提示 - 装饰类本身 */
export const Toast = (data: Required<IMeta>['toast']) => reflectMetaDataHandler.setMetaData('toast', data); // 改成一个配置对象
