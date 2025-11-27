import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../db/user.js";

const userRepo = new UserRepository();

export const cartOwnerMiddleware = async (req, res, next) => {
    try {
        // 1. CHECK FOR JWT TOKEN (AUTHENTICATED USER)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

                if (decodedToken?.id) {
                    const ifUserExists = await userRepo.checkUserExistsById(decodedToken.id);

                    if (ifUserExists) {
                        const user = await userRepo.getUserDetailsById(decodedToken.id);
                        req.cartOwner = {
                            type: "user",
                            userId: user.userId,
                            user: user
                        };
                        return next();
                    }
                }
            } catch (error) {
                console.error("JWT verification failed:", error);
            }
        }

        // 2. NO VALID JWT → CHECK GUEST SESSION COOKIE
        const cartSessionCookie = req.cookies?.cart_session;

        if (cartSessionCookie) {
            req.cartOwner = {
                type: "guest",
                sessionId: cartSessionCookie,
                isNew: false,
            };

            return next();
        }

        // 3. NO JWT & NO SESSION COOKIE → CREATE NEW GUEST SESSION
        const newSessionId = uuidv4();

        // Set cookie for 30 days
        res.cookie("cart_session", newSessionId, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        req.cartOwner = {
            type: "guest",
            sessionId: newSessionId,
            isNew: true,
        };

        next();

    } catch (error) {
        console.error("Cart Owner Middleware Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
