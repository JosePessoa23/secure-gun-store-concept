import { IDomainEvent } from '../../../IDomainEvent';
import { UniqueEntityID } from '../../../../UniqueEntityID';

export class MockJobCreatedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public id: UniqueEntityID;

  public constructor(id: UniqueEntityID) {
    this.id = id;
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.id;
  }
}
