import { Publisher } from '../../../common/src';
import { TicketCreatedEvent } from '../../../common/src';
import { Subjects } from '../../../common/src';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
