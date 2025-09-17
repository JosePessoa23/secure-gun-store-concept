import { Result } from '../../core/logic/Result';
import { IUserDTO } from '../../dto/IUserDTO';

export default interface IUserService {
  signUp(userDTO: IUserDTO): Promise<Result<IUserDTO>>;
  SignIn(email: string, password: string, fingerprint: string, twoFactorCode: string | string[]): Promise<Result<{ userDTO: IUserDTO; token: string }>>;
  getUsers(): Promise<Result<IUserDTO[]>>;
  deleteUser(token:string | string[]): Promise<boolean>;
  updateUser(userDTO: IUserDTO): Promise<Result<IUserDTO>>;
  getCurrentUser(token:string | string[]): Promise<Result<IUserDTO>>;
  getUserByEmail(email: string): Promise<Result<IUserDTO>>;
  get2fa(token: string | string[]): Promise<Result<string>>;
  has2fa(email: string | string[]): Promise<Result<boolean>>
}
