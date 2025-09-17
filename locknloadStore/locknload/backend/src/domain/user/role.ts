import { ValueObject } from '../../core/domain/ValueObject';

import { Result } from '../../core/logic/Result';
import UserRole from './userRole';

interface RoleProps {
  name: string;
}

export class Role extends ValueObject<RoleProps> {
  public get name(): string {
    return this.props.name;
  }

  private constructor(props: RoleProps) {
    super(props);
  }

  public static create(role: string): Result<Role> {
    const name = role;

    if (!Object.values(UserRole).includes(name as UserRole)) {
      return Result.fail<Role>('Must provide a role name');
    } else {
      const role = new Role({ name: name });
      return Result.ok<Role>(role);
    }
  }
}
