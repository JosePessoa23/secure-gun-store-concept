import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { UserId } from './userId';
import { UserEmail } from './userEmail';
import { Role } from '../../domain/user/role';
import { Guard } from '../../core/logic/Guard';
import { UserPassword } from './userPassword';
import { UserPhoneNumber } from './userPhoneNumber';
import { UserMorada } from './userMorada';
import { UserBirthDate } from './userBirthDate';

interface UserProps {
  name: string;
  email: UserEmail;
  password: UserPassword;
  phoneNumber: UserPhoneNumber;
  birthDate: UserBirthDate;
  role: Role;
  morada: UserMorada;
  fingerPrints: string[];
  twofaSecret: string;
}

export class User extends AggregateRoot<UserProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get userId(): UserId {
    return UserId.caller(this.id);
  }

  public get email(): UserEmail {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(value: string) {
    this.props.name = value;
  }

  public get password(): UserPassword {
    return this.props.password;
  }

  public set password(value: UserPassword) {
    this.props.password = value;
  }

  public get morada(): UserMorada {
    return this.props.morada;
  }

  public set morada(value: UserMorada) {
    this.props.morada = value;
  }

  public get phoneNumber(): UserPhoneNumber {
    return this.props.phoneNumber;
  }

  public set phoneNumber(value: UserPhoneNumber) {
    this.props.phoneNumber = value;
  }

  public get birthDate(): UserBirthDate {
    return this.props.birthDate;
  }

  public set birthDate(value: UserBirthDate) {
    this.props.birthDate = value;
  }

  public get role(): Role {
    return this.props.role;
  }

  public set role(value: Role) {
    this.props.role = value;
  }

  public get fingerPrints(): string[] {
    return this.props.fingerPrints;
  }

  public set fingerPrints(value: string[]) {
    this.props.fingerPrints = value;
  }

  public get twofaSecret(): string {
    return this.props.twofaSecret;
  }

  public set twofaSecret(value: string) {
    this.props.twofaSecret = value;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {

    const guardedProps = [
      { argument: props.name, argumentName: 'nome' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.phoneNumber, argumentName: 'phoneNumber' },
      { argument: props.morada, argumentName: 'morada' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.birthDate, argumentName: 'birthDate' },
      { argument: props.fingerPrints, argumentName: 'fingerPrints'},
      { argument: props.twofaSecret || '', argumentName: 'twofaSecret' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    } else {
      const user = new User(
        {
          ...props,
        },
        id,
      );

      return Result.ok<User>(user);
    }
  }
}
