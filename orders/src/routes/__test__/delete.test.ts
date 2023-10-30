import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if an invalid orderId is sent', async () => {
    const fakeOrderId = 'fake id';

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${fakeOrderId}`)
        .set('Cookie', global.signin())
        .send()
        .expect(400);
});

it('returns an error if order does not exist', async () => {
    const fakeOrderId = new mongoose.Types.ObjectId().toHexString();

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${fakeOrderId}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404);
});

it('returns an error if a user tries to cancel some elses order', async () => {
    // Create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});

it('marks an order as cancelled', async () => {
    // Create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // Expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
    // Create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // Make sure the publish has been called
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
