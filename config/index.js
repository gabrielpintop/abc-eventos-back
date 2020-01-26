require('dotenv').config();

const config = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    authJwtSecret: process.env.AUTH_JWT_SECRET
};

module.exports = config;
