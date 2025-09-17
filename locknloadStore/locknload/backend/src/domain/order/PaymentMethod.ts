import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PaymentMethodProps {
  value: string;
}

export class PaymentMethod extends ValueObject<PaymentMethodProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: PaymentMethodProps) {
    super(props);
  }

  public static create(paymentMethod: string): Result<PaymentMethod> {
    const guardResult = Guard.againstNullOrUndefined(paymentMethod, 'paymentMethod');
    if (!guardResult.succeeded && paymentMethod != 'MBWAY' && paymentMethod != 'PAYPAL') {
      return Result.fail<PaymentMethod>(guardResult.message);
    } else {
      return Result.ok<PaymentMethod>(new PaymentMethod({ value: paymentMethod }));
    }
  }
}
