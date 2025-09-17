import { v4 as uuidV4 } from 'uuid';
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  public constructor(id?: string | number) {
    super(id ? id : uuidV4());
  }
}
