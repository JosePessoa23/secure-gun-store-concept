import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserMoradaProps {
  value: string;
}

export class UserMorada extends ValueObject<UserMoradaProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: UserMoradaProps) {
    super(props);
  }

  public static create(morada: string): Result<UserMorada> {
    const guardResult = Guard.againstNullOrUndefined(morada, 'morada');
    if (!guardResult.succeeded) {
      return Result.fail<UserMorada>(guardResult.message);
    } else {
      return Result.ok<UserMorada>(new UserMorada({ value: morada }));
    }
  }
}
