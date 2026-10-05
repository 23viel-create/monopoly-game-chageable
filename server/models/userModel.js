const pool = require('../config/db');

//Inserts a new user and returns the public fields (never the password hash)
const createUser = async (username, email, passwordHash) => {
    const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, is_verified, preferred_language, created_at;
    `;
    const values = [username, email, passwordHash];
    const result = await pool.query(query, values);
    return result.rows[0];
};

//Returns the user with the given email, or undefined if none exists
const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};
