import 'reflect-metadata';

/**
 * 使用reflect-metadata对装饰器附加数据的存储与读取操作类
 *
 * @export
 * @class ReflectMetaDataHandler
 * @template IMetaType
 */
export class ReflectMetaDataHandler<IMetaType> {
  private _KEY: symbol

  constructor(KEY: symbol) {
    this._KEY = KEY;
  }

  /**
   * 设置meta数据 [附加] - 返回ClassDecorator 作用于类本身 - 后续可能会扩充到类属性上
   *
   * @param {keyof IMetaType} key
   * @param {object} value
   * @returns {ClassDecorator}
   * @memberof ReflectHandler
   */
  setMetaData(key: keyof IMetaType, value: object): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
      const meta = Reflect.getMetadata(this._KEY, target) || {};
      meta[key] = value;

      Reflect.metadata(this._KEY, meta)(target);
    };
  }

  /**
   * 获取类本身上的元数据 -- 后续或可补充类属性元数据：使用传参区分类本身与类属性
   *
   * @param {Object} cons
   * @returns {(undefined | IMetaType)}
   * @memberof ReflectHandler
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  getMetaData(cons: Object): undefined | IMetaType {
    return Reflect.getMetadata(this._KEY, cons);
  }
}
