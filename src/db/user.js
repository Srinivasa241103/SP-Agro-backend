import { pool } from './pool.js';

export class UserRepository {
    async checkUserExistsById(id) {
        const query = `
            SELECT 1 FROM users 
            WHERE email = $1 
            LIMIT 1
        `;
        const result = await pool.query(query, [email]);
        if (result.rowCount > 0) return true;
        return false;
    }
    async getUserDetailsById(id) {
        const query = `
            SELECT id       AS userId,
                name        AS userName,
                phone       AS userPhone,
                email       AS userEmail,
                avatar_url  AS userAvatarUrl,
                FROM users 
            WHERE id = $1
            LIMIT 1
        `;
        return await pool.query(query, [id]).then(res => res.rows[0]);
    }

    async createUserForGoogleLogin({ googleId, email, avatar }) {
        const query = `
            INSERT INTO users (provider_user_id, email, oauth_avatar_url, auth_provider, is_verified, oauth_email_verified)
            VALUES ($1, $2, $3, 'google', true, true)
            RETURNING *
        `;
    }

    // Google Auth related database operations
    async findUserByGoogleId(googleId) {
        const query = `
            SELECT * FROM users 
            WHERE google_id = $1
            LIMIT 1
        `;
        return await pool.query(query, [googleId]).then(res => res.rows[0]);
    }

    async findUserByEmail(email) {
        const query = `
            SELECT * FROM users 
            WHERE email = $1
            LIMIT 1
        `;
        return await pool.query(query, [email]).then(res => res.rows[0]);
    }

    async linkGoogleAccount(userId, googleId, profilePicture) {
        const query = `
            UPDATE users 
            SET google_id = $1, 
                profile_picture = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `;
        const values = [googleId, profilePicture, userId];
        return await pool.query(query, values).then(res => res.rows[0]);
    }

    async createUser({ email, name, google_id, profile_picture, is_verified, }) {
        const query = `
            INSERT INTO users (email, name, google_id, avatar_url, is_verified)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [email, name, google_id, profile_picture, is_verified];
        return await pool.query(query, values).then(res => res.rows[0]);
    }

    async findUserById(userId) {
        const query = `
            SELECT * FROM users 
            WHERE id = $1
            LIMIT 1
        `;
        return await pool.query(query, [userId]).then(res => res.rows[0]);
    }

    async insertRefreshToken({ user_id, token, expires_at, ip_address, user_agent }) {
        const query = `
            INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [user_id, token, expires_at, ip_address, user_agent];
        await pool.query(query, values);
    }
}