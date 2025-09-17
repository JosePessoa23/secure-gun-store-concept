import { Container } from 'typedi';
import { Mapper } from '../core/infra/Mapper';
import { IUserDTO } from '../dto/IUserDTO';
import { User } from '../domain/user/user';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { UserEmail } from '../domain/user/userEmail';
import { Role } from '../domain/user/role';
import { UserMorada } from '../domain/user/userMorada';
import { UserPhoneNumber } from '../domain/user/userPhoneNumber';
import { UserPassword } from '../domain/user/userPassword';
import { UserBirthDate } from '../domain/user/userBirthDate';

export class UserMap extends Mapper<User> {

  public static toDTO(user: User): IUserDTO {
    const userDTO: IUserDTO = {
      name: user.name,
      email: user.email.value,
      password: user.password.value,
      birthDate:user.birthDate.value,
      phoneNumber: user.phoneNumber.value,
      role: user.role.name,
      morada: user.morada.value,
      fingerPrints: user.fingerPrints,
      twofaSecret: user.twofaSecret,
    };
    return userDTO;
  }

  public static async toDomain(raw: any): Promise<User | null> {

    const userEmailOrError = UserEmail.create(raw.email);
    const role = Role.create(raw.role);
    const morada = UserMorada.create(raw.morada);
    const phoneNumber = UserPhoneNumber.create(raw.phoneNumber);
    const birthDate = UserBirthDate.create(raw.birthDate);
    const password = await UserPassword.create({ value: raw.password, hashed: true });
    const fingerPrints = raw.fingerPrints ? raw.fingerPrints : [];
    const twofaSecret = raw.twofaSecret ? raw.twofaSecret : null;

    if (userEmailOrError.isFailure || role.isFailure || morada.isFailure || phoneNumber.isFailure || password.isFailure) {
      console.log('Error creating user properties');
      return null;
    }

    const userOrError = User.create(
      {
        name: raw.name,
        email: userEmailOrError.getValue(),
        password: password.getValue(),
        phoneNumber: phoneNumber.getValue(),
        birthDate: birthDate.getValue(),
        morada: morada.getValue(),
        role: role.getValue(),
        fingerPrints: fingerPrints,
        twofaSecret: twofaSecret,
      },
      new UniqueEntityID(raw.domainId),
    );

    if (userOrError.isFailure) {
      console.log(userOrError.error);
      return null;
    }

    return userOrError.getValue();
  }

  public static toPersistence(user: User): any {
    const persistenceData = {
      domainId: user.id.toString(),
      email: user.email.props.value,
      name: user.name,
      password: user.password.props.value,
      phoneNumber: user.phoneNumber.value,
      birthDate: user.birthDate.value,
      role: user.role.name,
      morada: user.morada.value,
      fingerPrints: user.fingerPrints,
      twofaSecret: user.twofaSecret,
    };
    return persistenceData;
  }
}
