import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError } from '@lafmmticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty()
            .withMessage('Token is required'),
        body('orderId')
            .not()
            .isEmpty()
            .withMessage('OrderId is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // TODO: Finish implementation of payments api
        res.send({ success: true });
    }
);

export { router as createChargeRouter };
