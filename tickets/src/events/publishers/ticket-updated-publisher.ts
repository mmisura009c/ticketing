import { Publisher, Subjects, TicketUpdatedEvent } from '@lafmmticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
