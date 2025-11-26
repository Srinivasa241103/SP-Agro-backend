import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

export const generateAccessToken = (user) =>{
    const payload = {
        id: user.id,
        email: user.email,
    }
    return jwt.sign(
            payload,
            process.env.JWT_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' },
        )
}

export const generateRefreshToken = (user) =>{
    const payload = {
        id: user.id,
    }
    return jwt.sign(
            payload,
            process.env.JWT_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' },
        )
}

export const generateTemporaryToken = () =>{
    const unHashedToken = crypto.randomBytes(15).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(unHashedToken)
        .digest('hex')
    
        const tokenExpiry = new Date(Date.now() + 3600000); // valid JS Date
        return {unHashedToken, hashedToken, tokenExpiry};
}