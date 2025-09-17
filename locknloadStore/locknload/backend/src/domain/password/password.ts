import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';
import { UserPassword } from '../user/userPassword';

interface PasswordProps {
  userId: string;
  password: UserPassword;
  deletedAt: Date;
}

export class Password extends AggregateRoot<PasswordProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public set userId(value: string) {
    this.props.userId = value;
  }

  public get password(): UserPassword {
    return this.props.password;
  }

  public set password(value: UserPassword) {
    this.props.password = value;
  }

  public get deletedAt(): Date {
    return this.props.deletedAt;
  }

  public set deletedAt(value: Date) {
    this.props.deletedAt = value;
  }

  private constructor(props: PasswordProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PasswordProps, id?: UniqueEntityID): Result<Password> {
    const guardedProps = [
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.deletedAt, argumentName: 'deletedAt' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Password>(guardResult.message);
    } else {
      const password = new Password(
        {
          ...props,
        },
        id,
      );

      return Result.ok<Password>(password);
    }
  }
}
