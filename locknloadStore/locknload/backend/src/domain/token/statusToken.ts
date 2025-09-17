import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface StatusTokenProps {
    email: string;
    token: string;
    expiresAt: Date;
  }
  
  export class StatusToken extends AggregateRoot<StatusTokenProps> {
    public get id(): UniqueEntityID {
      return this._id;
    }
  
    public get email(): string {
      return this.props.email;
    }
  
    public set email(value: string) {
      this.props.email = value;
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
  
    private constructor(props: StatusTokenProps, id?: UniqueEntityID) {
      super(props, id);
    }
  
    public static create(props: StatusTokenProps, id?: UniqueEntityID): Result<StatusToken> {
      const guardedProps = [
        { argument: props.email, argumentName: 'userId' },
        { argument: props.token, argumentName: 'token' },
        { argument: props.expiresAt, argumentName: 'expiresAt' },
      ];
  
      const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
  
      if (!guardResult.succeeded) {
        return Result.fail<StatusToken>(guardResult.message);
      } else {
        const weapon = new StatusToken(
          {
            ...props,
          },
          id,
        );
  
        return Result.ok<StatusToken>(weapon);
      }
    }
  }
  