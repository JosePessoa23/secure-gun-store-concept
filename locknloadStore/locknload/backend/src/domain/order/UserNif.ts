import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserNifProps {
  value: string;
}

export class UserNif extends ValueObject<UserNifProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNifProps) {
    super(props);
  }

  public static create(userNif: string): Result<UserNif> {
    const guardResult = Guard.againstNullOrUndefined(userNif, 'userNif');
    if (!guardResult.succeeded) {
      return Result.fail<UserNif>(guardResult.message);
    } else {
      return Result.ok<UserNif>(new UserNif({ value: userNif }));
    }
  }
}
