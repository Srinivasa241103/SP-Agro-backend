import { Router } from "express"
import { dashboard } from "../controller/dashboard.js";

const router = Router();

router.get("/", dashboard);

export default router;
