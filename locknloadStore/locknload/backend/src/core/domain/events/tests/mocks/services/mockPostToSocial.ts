import { MockJobCreatedEvent } from '../events/mockJobCreatedEvent';
import { MockJobDeletedEvent } from '../events/mockJobDeletedEvent';
import { IHandle } from '../../../IHandle';
import { DomainEvents } from '../../../DomainEvents';

export class MockPostToSocial implements IHandle<MockJobCreatedEvent>, IHandle<MockJobDeletedEvent> {
  public constructor() {
    //
  }

  /**
   * This is how we may setup subscriptions to domain events.
   */

  public setupSubscriptions(): void {
    DomainEvents.register(this.handleJobCreatedEvent, MockJobCreatedEvent.name);
    DomainEvents.register(this.handleDeletedEvent, MockJobDeletedEvent.name);
  }

  /**
   * These are examples of how we define the handlers for domain events.
   */

  public handleJobCreatedEvent(event: MockJobCreatedEvent): void {
    console.log('A job was created!!!');
  }

  public handleDeletedEvent(event: MockJobDeletedEvent): void {
    console.log('A job was deleted!!!');
  }
}
