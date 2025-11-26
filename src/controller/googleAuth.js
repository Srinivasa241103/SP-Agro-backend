import {generateAccessToken, generateRefreshToken} from '../utils/jwt.js';
import {UserRepository} from '../db/user.js'
import dotenv from "dotenv";

const userRepo = new UserRepository();

export const googleAuthCallBack = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Google authentication failed", status: "failed" });
        }
        const user = req.user;
        const {id} = user;

        //generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await userRepo.insertRefreshToken({
            user_id: id,
            token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.headers['user-agent']
        });

        const options = {
            httpOnly: true,
            secure: true
        }

        // Redirect to setup-username if no username, otherwise to dashboard
        const redirectUrl = user.isNewUser
            ? `${process.env.FRONTEND_URL}/setup-user`
            : `${process.env.FRONTEND_URL}/dashboard`;

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(redirectUrl);

    } catch (err){
        console.error("OAuth callback error:", err);
        res.status(500).json({ message: err.message || "Internal server error" });
    }
}