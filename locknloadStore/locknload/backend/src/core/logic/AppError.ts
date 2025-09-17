import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

export class UnexpectedError extends Result<UseCaseError> {
  public constructor(err: any) {
    const useCaseError: UseCaseError = {
      message: `An unexpected error occurred.`,
    };
    super(false, useCaseError);
    console.log(`[AppError]: An unexpected error occurred`);
    console.error(err);
  }

  public static create(err: any): UnexpectedError {
    return new UnexpectedError(err);
  }
}
