import { License } from 'backend/src/domain/license/license';
import { Repo } from '../../core/infra/Repo';

export default interface ILicenseRepo extends Repo<License> {
  save(license: License): Promise<License>;
}