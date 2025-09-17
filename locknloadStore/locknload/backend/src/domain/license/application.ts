import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { ApplicationId } from './applicationId';
import { UserEmail } from '../user/userEmail';
import { UserMorada } from '../user/userMorada';
import { UserBirthDate } from '../user/userBirthDate';
import { ApplicationStatus } from './applicationStatus';

interface ApplicationProps {
  name: string;
  email: UserEmail;
  birthDate: UserBirthDate;
  address: UserMorada;
  medicalCertificate: Buffer;
  documentId: Buffer;
  status: ApplicationStatus;
  date: Date;
}

export class Application extends AggregateRoot<ApplicationProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get applicationId(): ApplicationId {
    return ApplicationId.caller(this.id);
  }

  public get email(): UserEmail {
    return this.props.email;
  }

  public set email(value: UserEmail) {
    this.props.email = value;
  }

  public get medicalCertificate(): Buffer {
    return this.props.medicalCertificate;
  }

  public set medicalCertificate(value: Buffer) {
    this.props.medicalCertificate = value;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(value: string) {
    this.props.name = value;
  }

  public get birthDate(): UserBirthDate {
    return this.props.birthDate;
  }

  public set birthDate(value: UserBirthDate) {
    this.props.birthDate = value;
  }

  public get address(): UserMorada {
    return this.props.address;
  }

  public set address(value: UserMorada) {
    this.props.address = value;
  }

  public get documentId(): Buffer {
    return this.props.documentId;
  }

  public set documentId(value: Buffer) {
    this.props.documentId = value;
  }

  public get status(): ApplicationStatus {
    return this.props.status;
  }

  public set status(value: ApplicationStatus) {
    this.props.status = value;
  }

  public get date(): Date {
    return this.props.date;
  }

  public set date(value: Date) {
    this.props.date = value;
  }

  private constructor(props: ApplicationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ApplicationProps, id?: UniqueEntityID): Result<Application> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.birthDate, argumentName: 'birthDate' },
      { argument: props.address, argumentName: 'address' },
      { argument: props.medicalCertificate, argumentName: 'medicalCertificate' },
      { argument: props.documentId, argumentName: 'documentId' },
      { argument: props.status, argumentName: 'status' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Application>(guardResult.message);
    } else {
      const application = new Application(
        {
          ...props,
        },
        id,
      );

      return Result.ok<Application>(application);
    }
  }
}
