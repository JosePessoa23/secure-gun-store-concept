import { Result } from '../core/logic/Result';
import { Price } from '../domain/order/Price';
import { Weapon } from '../domain/weapon/weapons';

describe('Create a valid weapon', (): void => {
  const name1 = 'Carlos';
  const priceValue = 100;
  const description = 'Very good weapon';
  const image = 'imagem';

  const weaponResult: Result<Weapon> = Weapon.create({
    name: name1,
    price: Price.create(priceValue).getValue(),
    description: description,
    image: image,
  });

  it('ensure all parameters are well formed', (): void => {
    expect(weaponResult.isSuccess).toBe(true);

    const weaponValue = weaponResult.getValue().props;

    expect(weaponValue.name).toEqual(name1);
    expect(weaponValue.price.value).toEqual(priceValue);
    expect(weaponValue.description).toEqual(description);
    expect(weaponValue.image).toEqual(image);
  });

  it('ensure cannot create weapon without a name', (): void => {
    const weaponWithoutNameResult: Result<Weapon> = Weapon.create({
      price: Price.create(priceValue).getValue(),
      description: description,
      image: image,
    } as any);

    expect(weaponWithoutNameResult.isFailure).toBe(true);
  });

  it('ensure cannot create weapon without a price', (): void => {
    const priceResult: Result<Price> = Price.create(null as any);

    expect(priceResult.isFailure).toBe(true);
  });

  it('ensure cannot create weapon without a description', (): void => {
    const weaponWithoutDescriptionResult: Result<Weapon> = Weapon.create({
      name: name1,
      price: Price.create(priceValue).getValue(),
      image: image,
    } as any);

    expect(weaponWithoutDescriptionResult.isFailure).toBe(true);
  });

  it('ensure cannot create weapon without an image', (): void => {
    const weaponWithoutImageResult: Result<Weapon> = Weapon.create({
      name: name1,
      price: Price.create(priceValue).getValue(),
      description: description,
    } as any);

    expect(weaponWithoutImageResult.isFailure).toBe(true);
  });
});
