import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('[Connected to the database]');
});
pool.on('error', (err) => {
    console.error('Postgres pool error:', err);
});

const connectToDB = async () => {
    await pool.connect();
}
