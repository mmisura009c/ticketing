import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@lafmmticketing/common';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if user is not signed in', async () => {
    // Make unauthorised request to create the order
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .send({ ticketId })
        .expect(401);
});

it('returns an error if invalid ticket id is sent', async () => {
    const fakeTicketId = 'fake id';

    // Make request to create the order
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: fakeTicketId
        })
        .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'asdf',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    let orders = await Order.find({});
    expect(orders.length).toEqual(0);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    orders = await Order.find({});
    expect(orders.length).toEqual(1);
});

it('emits an order created event', async () => {
    let orders = await Order.find({});
    expect(orders.length).toEqual(0);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
