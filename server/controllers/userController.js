const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const USERNAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 255;
const PASSWORD_MIN_LENGTH = 6;
//bcrypt only uses the first 72 bytes of a password
const PASSWORD_MAX_LENGTH = 72;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//Postgres error code for a unique constraint violation
const UNIQUE_VIOLATION = '23505';

//Returns an error message if the registration input is invalid, otherwise null
const validateRegistration = (username, email, password) => {
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return 'Username, email and password are required';
    }
    if (!username || username.length > USERNAME_MAX_LENGTH) {
        return `Username must be 1-${USERNAME_MAX_LENGTH} characters`;
    }
    if (email.length > EMAIL_MAX_LENGTH || !EMAIL_REGEX.test(email)) {
        return 'A valid email address is required';
    }
    if (password.length < PASSWORD_MIN_LENGTH || Buffer.byteLength(password) > PASSWORD_MAX_LENGTH) {
        return `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters`;
    }
    return null;
};

const registerUser = async (req, res) => {
    const { password } = req.body || {};
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : req.body?.username;
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : req.body?.email;

    const validationError = validateRegistration(username, email, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const userExists = await userModel.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.createUser(username, email, hashedPassword);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.is_verified,
                preferredLanguage: newUser.preferred_language,
                createdAt: newUser.created_at
            }
        });
    } catch (error) {
        //Two requests with the same email can both pass the check above; the UNIQUE constraint catches the second
        if (error.code === UNIQUE_VIOLATION) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser };
