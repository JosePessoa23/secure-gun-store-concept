import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PriceProps {
  value: number;
}

export class Price extends ValueObject<PriceProps> {
  public get value(): number {
    return this.props.value;
  }

  private constructor(props: PriceProps) {
    super(props);
  }

  public static create(price: number): Result<Price> {
    const guardResult = Guard.againstNullOrUndefined(price, 'nif');
    if (!guardResult.succeeded || price <= 0) {
      return Result.fail<Price>(guardResult.message);
    } else {
      return Result.ok<Price>(new Price({ value: price }));
    }
  }
}
