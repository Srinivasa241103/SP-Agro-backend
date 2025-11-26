import Router from "express";
import passport from "../utils/passport.js";
import { googleAuthCallBack } from '../controller/googleAuth.js';

const router = Router();

router.get(
    "/google", 
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        session: false  
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`, 
        session: false
    }),
    googleAuthCallBack
);

export default router;