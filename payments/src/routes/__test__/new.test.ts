import mongoose from 'mongoose';
import { OrderStatus } from '@lafmmticketing/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdf',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        version: 0,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdf',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        status: OrderStatus.Cancelled,
        price: 10,
        version: 0,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdf',
            orderId: order.id,
        })
        .expect(400);
});