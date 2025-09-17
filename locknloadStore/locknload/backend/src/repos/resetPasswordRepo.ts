import Container, { Service, Inject } from 'typedi';

import { Document, Model } from 'mongoose';
import IResetPasswordRepo from '../services/IRepos/IResetPasswordRepo';
import { ResetToken } from '../domain/token/resetTokens';
import { IResetPasswordTokenPersistence } from '../dataschema/IResetPasswordTokenPersistence';
import { ResetPasswordMap } from '../mappers/ResetPasswordTokenMap';
import { Password } from '../domain/password/password';
import { IPasswordPersistence } from '../dataschema/IPasswordPersistence';
import { PasswordMap } from '../mappers/PasswordMap';

@Service()
export default class ResetPasswordRepo implements IResetPasswordRepo {
  private resetPasswordTokenSchema: Model<
    IResetPasswordTokenPersistence & Document
  >;
  private passwordSchema: Model<IPasswordPersistence & Document>;

  public constructor() {
    this.resetPasswordTokenSchema = Container.get('resetPasswordTokenSchema');
    this.passwordSchema = Container.get('passwordSchema');
  }

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async createResetToken(resetToken: ResetToken): Promise<ResetToken> {
    const query = { domainId: resetToken.id.toString() };
    const resetTokenDocument = await this.resetPasswordTokenSchema.findOne(
      query
    );
    if (resetTokenDocument === null) {
      const rawResetToken: any = ResetPasswordMap.toPersistence(resetToken);
      const resetTokenCreated = await this.resetPasswordTokenSchema.create(
        rawResetToken
      );
      return ResetPasswordMap.toDomain(resetTokenCreated);
    }
  }

  public async getMostRecentNotExpiredTokenByUserId(
    userId: string
  ): Promise<ResetToken | null> {
    const currentDate = new Date();

    // Query Improvement:
    const query = {
      userId: userId,
      expiresAt: { $gt: currentDate }, // Ensure expiresAt is strictly greater than now
    };

    // Find and Sort:
    const resetTokenDocument = await this.resetPasswordTokenSchema
      .findOne(query)
      .sort({ createdAt: -1 }); // Get most recent first

    // Explicit Check for Expiration:
    if (resetTokenDocument && resetTokenDocument.expiresAt > currentDate) {
      return ResetPasswordMap.toDomain(resetTokenDocument);
    } else {
      return null; // No valid token found
    }
  }

  public async createPassword(password: Password): Promise<Password> {
    const query = { domainId: password.id.toString() };
    const passwordDocument = await this.passwordSchema.findOne(query);
    if (passwordDocument === null) {
      const rawPassword: any = PasswordMap.toPersistence(password);
      const passwordCreated = await this.passwordSchema.create(rawPassword);
      return PasswordMap.toDomain(passwordCreated);
    }
  }

  // public async exists (weaponId: WeaponId | string): Promise<boolean> {

  //   const idX = weaponId instanceof WeaponId ? (<WeaponId>weaponId).id.toValue() : weaponId;

  //   const query = { domainId: idX};
  //   const orderDocument = await this.weaponSchema.findOne( query );

  //   return !!orderDocument === true;
  // }

  // public async save (weapon: Weapon): Promise<Weapon> {

  //   const query = { domainId: weapon.id.toString() };

  //   const orderDocument = await this.weaponSchema.findOne( query );

  //   try {
  //     if (orderDocument === null ) {
  //       const rawOrder: any = WeaponMap.toPersistence(weapon);

  //       const weaponCreated = await this.weaponSchema.create(rawOrder);

  //       return WeaponMap.toDomain(weaponCreated);
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // public async findWeapons (): Promise<Weapon[]> {

  //   const weaponRecord = await this.weaponSchema.find({});

  //   if( weaponRecord != null) {
  //     let weapons: Array<Weapon> = [];
  //     weaponRecord.forEach(async function (weaponsRecord){
  //       weapons.push(await WeaponMap.toDomain(weaponsRecord))
  //     })
  //     return weapons
  //   }
  //   else
  //     return null;
  // }
}
