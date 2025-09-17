import { IChangePasswordDTO } from 'backend/src/dto/IChangePasswordDTO';
import { Result } from '../../core/logic/Result';
import { IResetPasswordDTO } from '../../dto/IResetPasswordDTO';
import { IResetPasswordEmailDTO } from '../../dto/IResetPasswordEmailDTO';

export default interface IResetPasswordService {
  resetPasswordEmail(resetPasswordEmailDTO: IResetPasswordEmailDTO): Promise<Result<IResetPasswordEmailDTO>>;
  resetPassword(resetPasswordDTO: IResetPasswordDTO): Promise<Result<IResetPasswordDTO>>;
  addFingerPrint({email, token, fingerprint}: {email: string, token: string, fingerprint: string}): Promise<Result<{email: string, token: string, fingerprint: string}>>;
  changePassword(resetPasswordDTO: IChangePasswordDTO): Promise<Result<IChangePasswordDTO>>;
}
