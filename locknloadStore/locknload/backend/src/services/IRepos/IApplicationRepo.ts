import { Repo } from '../../core/infra/Repo';
import { Application } from '../../domain/license/application';

export default interface IApplicationRepo extends Repo<Application> {
  save(application: Application): Promise<Application>;
  findByEmail(email: string): Promise<Application>;
  getAllOrderedByDate(): Promise<Application[]>;
}
