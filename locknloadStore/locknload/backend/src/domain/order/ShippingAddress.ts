import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ShippingAddressProps {
  value: string;
}

export class ShippingAddress extends ValueObject<ShippingAddressProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: ShippingAddressProps) {
    super(props);
  }

  public static create(shippingAddress: string): Result<ShippingAddress> {
    const guardResult = Guard.againstNullOrUndefined(shippingAddress, 'shippingAddress');
    if (!guardResult.succeeded) {
      return Result.fail<ShippingAddress>(guardResult.message);
    } else {
      return Result.ok<ShippingAddress>(new ShippingAddress({ value: shippingAddress }));
    }
  }
}
