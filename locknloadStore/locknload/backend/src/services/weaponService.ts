import { Service, Inject } from 'typedi';

import { Result } from '../core/logic/Result';
import { Price } from '../domain/order/Price';
import { IWeaponDTO } from '../dto/IWeaponDTO';
import IWeaponService from './IServices/IWeaponService';
import { WeaponMap } from '../mappers/WeaponMap';
import { Weapon } from '../domain/weapon/weapons';
import WeaponRepo from '../repos/weaponRepo';
import { Container } from 'typedi';

@Service()
export default class WeaponService implements IWeaponService {
  private weaponRepo: WeaponRepo;
  private logger: any;

  constructor() {
    this.weaponRepo = Container.get('WeaponRepo');
    this.logger = Container.get('logger');
  }

  public async postWeapon(weaponDTO: IWeaponDTO): Promise<Result<IWeaponDTO>> {
    try {
      /*
      const userDocument = await this.userRepo.findByEmail( userDTO.email );
      const found = !!userDocument;
      if (found) {
        return Result.fail<IUserDTO>("User already exists with email=" + userDTO.email);
      }
    */

      const price = Price.create(weaponDTO.price).getValue();

      const weaponOrError = Weapon.create({
        name: weaponDTO.name,
        price: price,
        description: weaponDTO.description,
        image: weaponDTO.image,
      });

      if (weaponOrError.isFailure) {
        throw Result.fail<IWeaponDTO>(weaponOrError.errorValue());
      }

      console.log(weaponOrError);

      const weaponResult = weaponOrError.getValue();

      console.log(weaponResult);

      await this.weaponRepo.save(weaponResult);

      const weaponDTOResult = WeaponMap.toDTO(weaponResult) as IWeaponDTO;
      return Result.ok<IWeaponDTO>(weaponDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWeapons(): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeapons();

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }


  public async getWeaponsByNameAsc(): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeaponsByNameAsc();

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }

  public async getWeaponsByNameDesc(): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeaponsByNameDesc();

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }

  public async getWeaponsByPriceDesc(): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeaponsByPriceDesc();

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }

  public async getWeaponsByPriceAsc(): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeaponsByPriceAsc();

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }

  public async getWeaponsByName(name: string): Promise<Result<IWeaponDTO[]>> {
    const weapons = await this.weaponRepo.findWeaponsByName(name);

    if (weapons === null) {
      return Result.fail<IWeaponDTO[]>('weapon não encontrada');
    } else {
      const weaponsResult: IWeaponDTO[] = [];
      weapons.forEach(function (weapon) {
        weaponsResult.push(WeaponMap.toDTO(weapon) as IWeaponDTO);
      });
      return Result.ok<IWeaponDTO[]>(weaponsResult);
    }
  }
  
}
