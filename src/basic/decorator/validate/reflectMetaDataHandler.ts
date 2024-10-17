import { ReflectMetaDataHandler } from '../ReflectMetaDataHandler';
import type { IMeta } from './types';

const KEY = Symbol.for('descriptor');// 使用symbol符号来避免key值的重复问题

/** 使用reflect-metadata对装饰器附加数据的存储与读取操作类 */
export const reflectMetaDataHandler = new ReflectMetaDataHandler<IMeta>(KEY);
