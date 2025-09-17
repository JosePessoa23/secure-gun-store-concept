import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface OrderStatusProps {
  value: string;
}

export class OrderStatus extends ValueObject<OrderStatusProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: OrderStatusProps) {
    super(props);
  }

  public static create(orderStatus: string): Result<OrderStatus> {
    const guardResult = Guard.againstNullOrUndefined(orderStatus, 'orderStatus');
    if (
      !guardResult.succeeded &&
      orderStatus != 'pending' &&
      orderStatus != 'delivering' &&
      orderStatus != 'delivered' &&
      orderStatus != 'cancelled'
    ) {
      return Result.fail<OrderStatus>(guardResult.message);
    } else {
      return Result.ok<OrderStatus>(new OrderStatus({ value: orderStatus }));
    }
  }
}
