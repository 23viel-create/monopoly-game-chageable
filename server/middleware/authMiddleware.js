const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../config/jwt');

//Requires a valid "Authorization: Bearer <token>" header.
//On success attaches the user (without password hash) to req.user.
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Not authorized, token expired' : 'Not authorized, invalid token';
        return res.status(401).json({ message });
    }

    try {
        //Look the user up so tokens of deleted users stop working
        const user = await userModel.findUserById(payload.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { protect };
