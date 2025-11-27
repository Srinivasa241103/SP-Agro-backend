import { UserRepository } from "../db/user.js";
import jwt from "jsonwebtoken";

const userRepo = new UserRepository();

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Authentication token missing", status: "failed" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        if (!decodedToken?.id) {
            return res
                .status(401)
                .json({ message: "Invalid token payload", status: "failed" });
        }

        const ifUserExists = await userRepo.checkUserExistsById(decodedToken.id);

        if (!ifUserExists) {
            return res.status(401).json({ message: "Unauthorized", status: "failed" });
        }

        const user = await userRepo.getUserDetailsById(decodedToken.id);
        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired token", status: "failed" });
        }
        return res.status(500).json({ message: "Internal server error", status: "failed" });
    }
};