import { Mapper } from '../core/infra/Mapper';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Price } from '../domain/order/Price';
import { Weapon } from '../domain/weapon/weapons';
import { IWeaponDTO } from '../dto/IWeaponDTO';

export class WeaponMap extends Mapper<Weapon> {
  public static toDTO(weapon: Weapon): IWeaponDTO {
    const weaponDTO: IWeaponDTO = {
      name: weapon.name,
      price: weapon.price.value,
      description: weapon.description,
      image: weapon.image,
    };
    return weaponDTO;
  }

  public static async toDomain(raw: any): Promise<Weapon | null> {
    const priceOrError = await Price.create(raw.price);

    if (priceOrError.isFailure) {
      console.log(priceOrError.error);
      return null;
    }

    const weaponOrError = await Weapon.create(
      {
        name: raw.name,
        price: priceOrError.getValue(),
        description: raw.description,
        image: raw.image,
      },
      new UniqueEntityID(raw.domainId),
    );

    if (weaponOrError.isFailure) {
      console.log(weaponOrError.error);
      return null;
    }

    return weaponOrError.getValue();
  }

  public static toPersistence(weapon: Weapon): any {
    const persistenceData = {
      domainId: weapon.id.toString(),
      name: weapon.name,
      price: weapon.price.value,
      description: weapon.description,
      image: weapon.image,
    };
    return persistenceData;
  }
}
