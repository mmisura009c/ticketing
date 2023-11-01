import { PaymentCreatedEvent, Publisher, Subjects } from '@lafmmticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
