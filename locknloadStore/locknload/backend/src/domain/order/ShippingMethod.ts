import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ShippingMethodProps {
  value: string;
}

export class ShippingMethod extends ValueObject<ShippingMethodProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: ShippingMethodProps) {
    super(props);
  }

  public static create(shippingMethod: string): Result<ShippingMethod> {
    const guardResult = Guard.againstNullOrUndefined(shippingMethod, 'shippingMethod');
    if (!guardResult.succeeded && shippingMethod != 'CTT' && shippingMethod != 'PickUp') {
      return Result.fail<ShippingMethod>(guardResult.message);
    } else {
      return Result.ok<ShippingMethod>(new ShippingMethod({ value: shippingMethod }));
    }
  }
}
