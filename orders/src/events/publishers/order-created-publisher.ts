import { OrderCreatedEvent, Publisher, Subjects } from '@lafmmticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
