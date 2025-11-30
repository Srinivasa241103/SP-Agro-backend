import Router from "express";
import { cartOwnerMiddleware } from '../middlewares/cartAuth.js';
import { getCarts, addToCart } from '../controller/cartController.js';

const router = Router();

router.get("/get-carts",
    cartOwnerMiddleware,
    getCarts
);

router.post("/add-to-cart",
    cartOwnerMiddleware,
    addToCart
);

export default router;