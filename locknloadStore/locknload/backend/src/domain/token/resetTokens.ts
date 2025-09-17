import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ResetTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
}

export class ResetToken extends AggregateRoot<ResetTokenProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public set userId(value: string) {
    this.props.userId = value;
  }

  public get token(): string {
    return this.props.token;
  }

  public set token(value: string) {
    this.props.token = value;
  }

  public get expiresAt(): Date {
    return this.props.expiresAt;
  }

  public set expiresAt(value: Date) {
    this.props.expiresAt = value;
  }

  private constructor(props: ResetTokenProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ResetTokenProps, id?: UniqueEntityID): Result<ResetToken> {
    const guardedProps = [
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.token, argumentName: 'token' },
      { argument: props.expiresAt, argumentName: 'expiresAt' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ResetToken>(guardResult.message);
    } else {
      const weapon = new ResetToken(
        {
          ...props,
        },
        id,
      );

      return Result.ok<ResetToken>(weapon);
    }
  }
}
