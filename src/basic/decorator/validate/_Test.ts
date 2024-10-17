import { Length, Contains, IsInt, Min, Max, IsEmail, IsFQDN, IsDate, IsNotEmpty } from 'class-validator';
import { MyValidationDecorator } from './MyValidationDecorator';
import { Toast } from './classDecorators';
import { AllowEmpty } from './propertyDecorators';

@Toast({ enable: true })
export class TestDecorator extends MyValidationDecorator {
  @Length(10, 20, { message: '标题长度应为10 - 20位' })
  @IsNotEmpty({ message: '标题不能为空' })
  title = ''

  @Contains('hello', { message: 'text内容不符合要求，必须包含hello字段' })
  @IsNotEmpty({ message: 'text不能为空' })
  text = ''

  @Min(0, { message: 'rating不能小于0' })
  @Max(10, { message: 'rating不能大于10' })
  @IsInt({ message: 'rating必须为整数类型' })
  @AllowEmpty()
  rating: number | '' = ''

  @IsEmail(undefined, { message: '邮箱格式不正确' })
  @AllowEmpty()
  email = ''

  @IsFQDN(undefined, { message: '格式不正确' })
  @AllowEmpty()
  site = ''

  @IsDate({ message: '必须为日期格式' })
  @AllowEmpty()
  createDate: Date | '' = ''
}

// const test = async () => {
//   const obj = new TestDecorator();

//   obj.title = '1234567890';

//   const result = await obj._validate();

//   console.log('result', result);
// };

// test();
