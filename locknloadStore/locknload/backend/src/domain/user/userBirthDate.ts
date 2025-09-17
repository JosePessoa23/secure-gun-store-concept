import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserBirthDateProps {
  value: Date;
}

export class UserBirthDate extends ValueObject<UserBirthDateProps> {
  public get value(): Date {
    return this.props.value;
  }

  private constructor(props: UserBirthDateProps) {
    super(props);
  }

  public static create(birthDate: Date): Result<UserBirthDate> {
    const guardResult = Guard.againstNullOrUndefined(birthDate, 'birthDate');
    if (!guardResult.succeeded) {
      return Result.fail<UserBirthDate>(guardResult.message);
    }

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (birthDate > minDate) {
      return Result.fail<UserBirthDate>('User must be 18 years or older.');
    }

    return Result.ok<UserBirthDate>(new UserBirthDate({ value: birthDate }));
  }
}
