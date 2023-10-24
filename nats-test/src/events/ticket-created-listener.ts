import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src';
import { TicketCreatedEvent } from '../../../common/src';
import { Subjects } from '../../../common/src';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);

        console.log(data.id);
        console.log(data.title);
        console.log(data.price);

        msg.ack();
    }
}
