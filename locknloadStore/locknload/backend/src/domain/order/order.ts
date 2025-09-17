import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';
import { UserEmail } from '../user/userEmail';
import { OrderStatus } from './OrderStatus';
import { PaymentMethod } from './PaymentMethod';
import { Price } from './Price';
import { ShippingMethod } from './ShippingMethod';
import { ShippingAddress } from './ShippingAddress';
import { ReceiptName } from './ReceiptName';
import { UserNif } from './UserNif';
import { OrderId } from './orderId';

interface OrderProps {
  date: Date;
  orderNumber: number;
  paymentMethod: PaymentMethod;
  totalPrice: Price;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  receiptName: ReceiptName;
  userNif: UserNif;
  email: UserEmail;
  orderStatus: OrderStatus;
  weapons: string[];
}

export class Order extends AggregateRoot<OrderProps> {
  public get id(): UniqueEntityID {
    return this._id;
  }

  public get orderId(): OrderId {
    return OrderId.caller(this.id);
  }

  public get date(): Date {
    return this.props.date;
  }

  public set date(value: Date) {
    this.props.date = value;
  }

  public get orderNumber(): number {
    return this.props.orderNumber;
  }

  public set orderNumber(value: number) {
    this.props.orderNumber = value;
  }

  public get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }

  public set paymentMethod(value: PaymentMethod) {
    this.props.paymentMethod = value;
  }

  public get totalPrice(): Price {
    return this.props.totalPrice;
  }

  public set totalPrice(value: Price) {
    this.props.totalPrice = value;
  }

  public get shippingMethod(): ShippingMethod {
    return this.props.shippingMethod;
  }

  public set shippingMethod(value: ShippingMethod) {
    this.props.shippingMethod = value;
  }

  public get shippingAddress(): ShippingAddress {
    return this.props.shippingAddress;
  }

  public set shippingAddress(value: ShippingAddress) {
    this.props.shippingAddress = value;
  }

  public get receiptName(): ReceiptName {
    return this.props.receiptName;
  }

  public set receiptName(value: ReceiptName) {
    this.props.receiptName = value;
  }

  public get userNif(): UserNif {
    return this.props.userNif;
  }

  public set userNif(value: UserNif) {
    this.props.userNif = value;
  }

  public get email(): UserEmail {
    return this.props.email;
  }

  public set email(value: UserEmail) {
    this.props.email = value;
  }

  public get orderStatus(): OrderStatus {
    return this.props.orderStatus;
  }

  public set orderStatus(value: OrderStatus) {
    this.props.orderStatus = value;
  }

  public get weapons(): string[] {
    return this.props.weapons;
  }

  public set weapons(value: string[]) {
    this.props.weapons = value;
  }

  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
    const guardedProps = [
      { argument: props.date, argumentName: 'date' },
      { argument: props.orderNumber, argumentName: 'orderNumber' },
      { argument: props.paymentMethod, argumentName: 'paymentMethod' },
      { argument: props.totalPrice, argumentName: 'totalPrice' },
      { argument: props.shippingMethod, argumentName: 'shippingMethod' },
      { argument: props.shippingAddress, argumentName: 'shippingAddress' },
      { argument: props.receiptName, argumentName: 'receiptName' },
      { argument: props.userNif, argumentName: 'userNif' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.orderStatus, argumentName: 'orderStatus' },
      { argument: props.weapons, argumentName: 'weapons' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.message);
    } else {
      const order = new Order(
        {
          ...props,
        },
        id,
      );

      return Result.ok<Order>(order);
    }
  }
}
