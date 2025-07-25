/* eslint-disable @typescript-eslint/no-explicit-any */
// 定义一个工具类型，用于过滤掉私有属性（以 _ 开头）
type FilterPrivateKeys<T> = {
  [K in keyof T]: T[K];
};

// 定义一个工具类型，用于获取去除私有属性后的类类型
export type RemovePrivateProperties<T> = FilterPrivateKeys<T>;

// 定义一个工具类型，用于过滤掉私有属性（以 _ 开头）
type FilterUnderlinePrivateKeys<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

// 定义一个工具类型，用于获取去除下划线及私有属性后的类类型
export type RemoveUnderlinePrivateProperties<T> = FilterUnderlinePrivateKeys<T>;

/** 移除掉方法属性 */
export type RemoveFuncProperties<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K]
}
