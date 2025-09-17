import { IDomainEvent } from '../../../IDomainEvent';
import { UniqueEntityID } from '../../../../UniqueEntityID';

export class MockJobDeletedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public id: UniqueEntityID;

  public constructor(id: UniqueEntityID) {
    this.dateTimeOccurred = new Date();
    this.id = id;
  }

  public getAggregateId(): UniqueEntityID {
    return this.id;
  }
}
