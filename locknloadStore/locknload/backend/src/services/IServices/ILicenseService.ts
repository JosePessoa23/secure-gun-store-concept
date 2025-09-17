import { Result } from '../../core/logic/Result';
import { IApplicationDTO } from '../../dto/IApplicationDTO';
import { IApplicationStatusDTO } from 'backend/src/dto/IApplicationStatusDTO';

export default interface ILicenseService {
  submitApplication(applicationDTO: IApplicationDTO): Promise<Result<IApplicationDTO>>;
  getApplicationByEmail(email: string): Promise<Result<IApplicationDTO>>;
  getApplicationStatusByEmail(email: string, token:string): Promise<Result<IApplicationStatusDTO>>;
  getApplicationsOrderedByDate(): Promise<Result<IApplicationDTO[]>>;
  approveApplication(email: string, approve: string): Promise<Result<IApplicationDTO>>;
}
