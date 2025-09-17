import { Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserRepo from '../services/IRepos/IUserRepo';
import { User } from '../domain/user/user';
import { UserId } from '../domain/user/userId';
import { UserEmail } from '../domain/user/userEmail';
import { UserMap } from '../mappers/UserMap';
import { Container } from 'typedi';
import { SourceTextModule } from 'vm';
@Service()
export default class UserRepo implements IUserRepo {
  private userSchema: Model<IUserPersistence & Document>;

  public constructor() {
    this.userSchema = Container.get('userSchema');
  }

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(userId: UserId | string): Promise<boolean> {
    const idX =
      userId instanceof UserId ? (userId as UserId).id.toValue() : userId;

    const query = { domainId: idX };
    const userDocument = await this.userSchema.findOne(query);

    return !!userDocument === true;
  }

  public async save(user: User): Promise<User> {
    const query = { email: user.email.value };
    const userDocument = await this.userSchema.findOne(query);
    if (userDocument === null) {
      const rawUser: any = UserMap.toPersistence(user);

      const userCreated = await this.userSchema.create(rawUser);

      return UserMap.toDomain(userCreated);
    } else {
      const rawUser: any = UserMap.toPersistence(user);
      await this.userSchema.updateOne(query, rawUser)
      return user;
    }
  }

  public async update(user: User): Promise<User> {
    const query = { email: user.email.value };
    const rawUser: any = UserMap.toPersistence(user);
    await this.userSchema.updateOne(query, rawUser);
    return user;
  }

  public async delete(user: any): Promise<User> {
    const query = { email: user.email };
    await this.userSchema.updateOne(query, user);
    return user;
  }

  public async findByEmail(email: UserEmail | string): Promise<User> {
    const query = { email: email instanceof UserEmail ? email.value : email };
    const userRecord = await this.userSchema.findOne(query);
    if (userRecord != null) {
      return UserMap.toDomain(userRecord);
    } else return null;
  }

  public async findByEmail2(email: UserEmail | string): Promise<any> {
    const query = { email: email instanceof UserEmail ? email.value : email };
    const userRecord = await this.userSchema.findOne(query);
    if(userRecord == null){
      return null;
    }else{
    const userOrError = {
        name: userRecord.name,
        email: userRecord.email,
        password: userRecord.password,
        phoneNumber: userRecord.phoneNumber,
        birthDate: userRecord.birthDate,
        morada: userRecord.morada,
        fingerPrints: userRecord.fingerPrints,
        twofaSecret: userRecord.twofaSecret,
        role: userRecord.role,
      };
    return userOrError;
  }
  }

  public async findById(userId: UserId | string): Promise<User> {
    const idX =
      userId instanceof UserId ? (userId as UserId).id.toValue() : userId;

    const query = { domainId: idX };
    const userRecord = await this.userSchema.findOne(query);

    if (userRecord != null) {
      return UserMap.toDomain(userRecord);
    } else return null;
  }

  public async findUsers(): Promise<User[]> {
    const query = { phoneNumber: { $ne: 999999999 } };
    const userRecords = await this.userSchema.find(query);

    if (userRecords != null) {
      const users: User[] = [];
      for (const userRecord of userRecords) {
        const user = await UserMap.toDomain(userRecord);
        users.push(user);
      }
      return users;
    } else return null;
  }
}
