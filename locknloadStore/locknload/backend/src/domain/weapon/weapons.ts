import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';
import { Price } from '../order/Price';
import { WeaponId } from './weaponId';

interface WeaponProps {
  name: string;
  price: Price;
  description: string;
  image: string;
}

export class Weapon extends AggregateRoot<WeaponProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get weaponId(): WeaponId {
    return WeaponId.caller(this.id);
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(value: string) {
    this.props.name = value;
  }

  public get description(): string {
    return this.props.description;
  }

  public set description(value: string) {
    this.props.description = value;
  }

  public get price(): Price {
    return this.props.price;
  }

  public set price(value: Price) {
    this.props.price = value;
  }

  public get image(): string {
    return this.props.image;
  }

  public set image(value: string) {
    this.props.image = value;
  }

  private constructor(props: WeaponProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: WeaponProps, id?: UniqueEntityID): Result<Weapon> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.price, argumentName: 'price' },
      { argument: props.image, argumentName: 'image' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Weapon>(guardResult.message);
    } else {
      const weapon = new Weapon(
        {
          ...props,
        },
        id,
      );

      return Result.ok<Weapon>(weapon);
    }
  }
}
