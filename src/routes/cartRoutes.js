import Router from "express";
import { cartOwnerMiddleware } from '../middlewares/cartAuth.js';
import { getCarts } from '../controller/cartController.js';

const router = Router();

router.get("/get-carts",
    cartOwnerMiddleware,
    getCarts
);

export default router;