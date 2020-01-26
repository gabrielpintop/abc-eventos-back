const jwt = require('jsonwebtoken');
const { authJwtSecret } = require('../config');

const signToken = (payload) => {
    return jwt.sign(payload, authJwtSecret, {
        expiresIn: '1 day'
    });
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, authJwtSecret);
            req.decodedToken = decoded;
            return next();
        } catch (err) {
            console.log(err);
        }
    }

    res.status(301).json({
        data: 'No te encuentras autorizado'
    });
};

module.exports = {
    signToken,
    verifyToken
};