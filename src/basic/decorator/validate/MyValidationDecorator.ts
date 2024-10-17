/* eslint-disable @typescript-eslint/no-explicit-any */
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { reflectMetaDataHandler } from './reflectMetaDataHandler';
import { ValidateHandler } from './ValidateHandler';

/**
 * 装饰器 抽象类 需要继承 用于继承子类的属性校验相关
 *
 * @export
 * @abstract
 * @class MyValidationDecorator
 */
export abstract class MyValidationDecorator {
  /**
   * 校验字段 -- 用于elment-plus表单校验 - 只用于单个字段的验证，如涉及多个字段验证 如两次输入密码需要相同则另外进行相关验证编写
   *
   * 使用示例：\<el-form-item label="Activity name" prop="name" required :rules="[{ validator: ruleForm.validateField('name') }]"\>
   *
   * @param {MyValidationDecorator} this
   * @param {(keyof this & string)} fieldName
   * @returns
   * @memberof MyValidationDecorator
   */
  validateField(this: MyValidationDecorator, fieldName: keyof this & string) {
    return (rule: any, value: any, callback: (error?: string | Error) => void) => {
      const [error] = ValidateHandler.getValidationErrors(this, fieldName); // 获取到错误信息

      callback(error);
    };
  }

  /**
   * 整体校验 返回错误信息列表
   *
   * @param {MyValidationDecorator} this
   * @returns
   * @memberof MyValidationDecorator
   */
  validate(this: MyValidationDecorator) { // 限制this指向
    const errors = ValidateHandler.getValidationErrors(this); // 校验并获取错误信息列表

    if (errors.length > 0) {
      const meta = reflectMetaDataHandler.getMetaData(this.constructor);

      if (meta?.toast?.enable !== false) { // 需要弹窗提示
        MpMessage.error({ title: meta?.toast?.title || '验证失败', msg: errors[0] });
      }
    }

    return errors;
  }
}
