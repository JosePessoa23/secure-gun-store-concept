import { Service } from 'typedi';

import IWeaponRepo from '../services/IRepos/IWeaponRepo';
import { WeaponId } from '../domain/weapon/weaponId';
import { Weapon } from '../domain/weapon/weapons';
import { WeaponMap } from '../mappers/WeaponMap';
import { Container } from 'typedi';
import { Document, Model } from 'mongoose';
import { IWeaponPersistence } from '../dataschema/IWeaponPersistence';
import { Price } from '../domain/order/Price';
@Service()
export default class WeaponRepo implements IWeaponRepo {
  private weaponSchema: Model<IWeaponPersistence & Document>;

  public constructor() {
    this.weaponSchema = Container.get('weaponSchema');
  }

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(weaponId: WeaponId | string): Promise<boolean> {
    const idX =
      weaponId instanceof WeaponId
        ? (weaponId as WeaponId).id.toValue()
        : weaponId;

    const query = { domainId: idX };
    const orderDocument = await this.weaponSchema.findOne(query);

    return !!orderDocument === true;
  }

  public async save(weapon: Weapon): Promise<Weapon> {
    const query = { domainId: weapon.id.toString() };

    const orderDocument = await this.weaponSchema.findOne(query);

    if (orderDocument === null) {
      const rawOrder: any = WeaponMap.toPersistence(weapon);

      const weaponCreated = await this.weaponSchema.create(rawOrder);

      return WeaponMap.toDomain(weaponCreated);
    }
  }

  public async findWeapons(): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({});

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }

  public async findWeaponsByNameAsc(): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({}).sort({name: 1});

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }

  public async findWeaponsByNameDesc(): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({}).sort({name: -1});

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }

  public async findWeaponsByName(name: string): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({ name: { $regex: name, $options: 'i' } }).sort({ name: 1 });

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }

  public async findWeaponsByPriceDesc(): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({}).sort({price: -1});

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }

  public async findWeaponsByPriceAsc(): Promise<Weapon[]> {
    const weaponRecord = await this.weaponSchema.find({}).sort({price: 1});

    if (weaponRecord != null) {
      const weapons: Weapon[] = [];
      for (const weaponsRecord of weaponRecord) {
        weapons.push(await WeaponMap.toDomain(weaponsRecord));
      }
      return weapons;
    } else {
      return null;
    }
  }
}
