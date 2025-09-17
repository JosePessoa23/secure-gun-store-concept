import { Result } from '../../core/logic/Result';
import { IWeaponDTO } from '../../dto/IWeaponDTO';

export default interface IWeaponService {
  postWeapon(weaponDTO: IWeaponDTO): Promise<Result<IWeaponDTO>>;
  getWeapons(): Promise<Result<IWeaponDTO[]>>;
  getWeaponsByNameAsc(): Promise<Result<IWeaponDTO[]>>;
  getWeaponsByNameDesc(): Promise<Result<IWeaponDTO[]>>;
  getWeaponsByPriceAsc(): Promise<Result<IWeaponDTO[]>>;
  getWeaponsByPriceDesc(): Promise<Result<IWeaponDTO[]>>;
  getWeaponsByName(name: string): Promise<Result<IWeaponDTO[]>>;
}
