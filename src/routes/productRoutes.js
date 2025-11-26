import Router from "express";
import { getProductsForDashboard } from "../controller/products.js";

const router = Router();

router.get("/get-products", getProductsForDashboard);

export default router;