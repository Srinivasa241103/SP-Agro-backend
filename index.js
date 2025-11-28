import dotenv from 'dotenv';
import app from './src/app.js';

// Only load .env if it exists locally
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
