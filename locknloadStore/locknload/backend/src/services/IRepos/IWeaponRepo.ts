import { Repo } from '../../core/infra/Repo';
import { Weapon } from '../../domain/weapon/weapons';

export default interface IWeaponRepo extends Repo<Weapon> {
  save(weapon: Weapon): Promise<Weapon>;
  findWeapons(): Promise<Weapon[]>;
  findWeaponsByNameAsc(): Promise<Weapon[]>;
  findWeaponsByNameDesc(): Promise<Weapon[]>;
  findWeaponsByPriceAsc(): Promise<Weapon[]>;
  findWeaponsByPriceDesc(): Promise<Weapon[]>;
  findWeaponsByName(name: string): Promise<Weapon[]>;
}
