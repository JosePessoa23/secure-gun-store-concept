import { Mapper } from '../core/infra/Mapper';

import { UniqueEntityID } from '../core/domain/UniqueEntityID';

import { ResetToken } from '../domain/token/resetTokens';

export class ResetPasswordMap extends Mapper<ResetToken> {
  public static async toDomain(raw: any): Promise<ResetToken> {
    const resetPasswordTokenOrError = ResetToken.create(
      {
        userId: raw.userId,
        token: raw.token,
        expiresAt: raw.expiresAt,
      },
      new UniqueEntityID(raw.domainId),
    );

    resetPasswordTokenOrError.isFailure ? console.log(resetPasswordTokenOrError.error) : '';

    return resetPasswordTokenOrError.isSuccess ? resetPasswordTokenOrError.getValue() : null;
  }

  public static toPersistence(resetToken: ResetToken): any {
    const a = {
      domainId: resetToken.id.toString(),
      userId: resetToken.userId,
      token: resetToken.token,
      expiresAt: resetToken.expiresAt,
    };
    return a;
  }
}
