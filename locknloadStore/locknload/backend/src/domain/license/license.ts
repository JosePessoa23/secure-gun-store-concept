import { Result } from '../../core/logic/Result';
import { UserBirthDate } from "../user/userBirthDate";
import { UserEmail } from "../user/userEmail";
import { UserMorada } from "../user/userMorada";
import { Guard } from '../../core/logic/Guard';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { LicenseId } from "./licenseId";

interface LicenseProps {
    licenseNumber: number;
    name: string;
    email: UserEmail;
    birthDate: UserBirthDate;
    address: UserMorada;
    expiryDate: Date;
  }

  export class License extends AggregateRoot<LicenseProps> {
    public get id(): UniqueEntityID {
      return this._id;
    }
  
    public get licenseId(): LicenseId {
      return LicenseId.caller(this.id);
    }
  
    public get email(): UserEmail {
      return this.props.email;
    }
  
    public set email(value: UserEmail) {
      this.props.email = value;
    }
  
  
    public get name(): string {
      return this.props.name;
    }
  
    public set name(value: string) {
      this.props.name = value;
    }

    public get licenseNumber(): number {
        return this.props.licenseNumber;
      }
    
      public set licenseNumber(value: number) {
        this.props.licenseNumber = value;
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
  
    public get expiryDate(): Date {
      return this.props.expiryDate;
    }
  
    public set expiryDate(value: Date) {
      this.props.expiryDate = value;
    }
  
    private constructor(props: LicenseProps, id?: UniqueEntityID) {
      super(props, id);
    }
  
    public static create(props: LicenseProps, id?: UniqueEntityID): Result<License> {
      const guardedProps = [
        { argument: props.licenseNumber, argumentName: 'licenseNumber' },
        { argument: props.name, argumentName: 'name' },
        { argument: props.email, argumentName: 'email' },
        { argument: props.birthDate, argumentName: 'birthDate' },
        { argument: props.address, argumentName: 'address' },
        { argument: props.expiryDate, argumentName: 'expiryDate' },
      ];
  
      const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
  
      if (!guardResult.succeeded) {
        return Result.fail<License>(guardResult.message);
      } else {
        const license = new License(
          {
            ...props,
          },
          id,
        );
  
        return Result.ok<License>(license);
      }
    }
  }