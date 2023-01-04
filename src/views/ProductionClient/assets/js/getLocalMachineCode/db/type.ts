/**
 * IndexedDB 数据返回格式类型
 *
 * @export
 * @interface IIndexedDBResponse
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IIndexedDBResponse<T = any> {
  status: boolean
  message: string
  data: null | T
}
