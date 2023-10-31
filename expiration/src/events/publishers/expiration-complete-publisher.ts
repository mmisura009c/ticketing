import { ExpirationCompleteEvent, Publisher, Subjects } from '@lafmmticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
