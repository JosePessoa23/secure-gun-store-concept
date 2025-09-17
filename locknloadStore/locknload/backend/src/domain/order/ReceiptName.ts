import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ReceiptNameProps {
  value: string;
}

export class ReceiptName extends ValueObject<ReceiptNameProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: ReceiptNameProps) {
    super(props);
  }

  public static create(receiptName: string): Result<ReceiptName> {
    const guardResult = Guard.againstNullOrUndefined(receiptName, 'receiptName');
    if (!guardResult.succeeded) {
      return Result.fail<ReceiptName>(guardResult.message);
    } else {
      return Result.ok<ReceiptName>(new ReceiptName({ value: receiptName }));
    }
  }
}
