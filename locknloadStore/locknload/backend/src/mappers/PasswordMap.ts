import { Mapper } from '../core/infra/Mapper';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Password } from '../domain/password/password';
import { UserPassword } from '../domain/user/userPassword';

export class PasswordMap extends Mapper<Password> {
  public static async toDomain(raw: any): Promise<Password> {
    const password = await UserPassword.create({ value: raw.password, hashed: true });

    const passwordOrError = Password.create(
      {
        userId: raw.userId,
        password: password.getValue(),
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.domainId),
    );

    passwordOrError.isFailure ? console.log(passwordOrError.error) : '';

    return passwordOrError.isSuccess ? passwordOrError.getValue() : null;
  }

  public static toPersistence(password: Password): any {
    const a = {
      domainId: password.id.toString(),
      userId: password.userId,
      password: password.password.props.value,
      deletedAt: password.deletedAt,
    };
    return a;
  }
}
