import Router from "express";

const router = new Router();

router.get('/get-products', getProductsForDashboard);