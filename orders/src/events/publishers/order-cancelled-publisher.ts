import { OrderCancelledEvent, Publisher, Subjects } from '@lafmmticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
