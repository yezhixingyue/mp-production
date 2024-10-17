import { ArrayMinSize, IsNotEmpty, Length } from 'class-validator';
import { Toast } from '../validate/classDecorators';
import { MyValidationDecorator } from '../validate/MyValidationDecorator';

@Toast({ enable: false })
export class RuleForm extends MyValidationDecorator {
  @IsNotEmpty({ message: 'Please input Activity name' })
  @Length(3, 5, { message: 'Length should be 3 to 5' })
  name = 'Hello'

  @IsNotEmpty({ message: 'Please select Activity zone' })
  region = ''

  @IsNotEmpty({ message: 'Please select Activity count' })
  count = ''

  @IsNotEmpty({ message: 'Please pick a date' })
  date1 = ''

  @IsNotEmpty({ message: 'Please pick a time' })
  date2 = ''

  delivery = false

  @IsNotEmpty({ message: 'Please select a location' })
  location = ''

  @ArrayMinSize(1, { message: 'Please select at least one activity type' })
  type = []

  @IsNotEmpty({ message: 'Please select activity resource' })
  resource = ''

  @IsNotEmpty({ message: 'Please input activity form' })
  desc = ''
}
