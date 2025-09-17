interface IUseCaseErrorError {
  message: string;
}

export abstract class UseCaseError implements IUseCaseErrorError {
  public readonly message: string;

  public constructor(message: string) {
    this.message = message;
  }
}
