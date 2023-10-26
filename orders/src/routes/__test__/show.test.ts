import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns an error if invalid order id is sent', async () => {
    const fakeOrderId = 'fake id';

    // Make request to fetch the order
    await request(app)
        .get(`/api/orders/${fakeOrderId}`)
        .set('Cookie', global.signin())
        .send()
        .expect(400);
});

it('returns an error if no order exists', async () => {
    const fakeOrderId = new mongoose.Types.ObjectId().toHexString();

    // Make request to fetch the order
    await request(app)
        .get(`/api/orders/${fakeOrderId}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404);
});

it('returns an error if one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});
