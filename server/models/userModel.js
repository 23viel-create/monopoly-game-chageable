const pool = require('../config/db');

const craeteUser = async (username,email,passwordHash)=> {
    //
    const query= `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
    `;
    const values =[username, email, passwordHash];
    //
    const result = await pool.query(query, values);
    return result.rows[0];
};
//
const findUserByEmail =async (email)=> {
    const query= `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query,[email]);
    return result.rows[0];//
};
//
module.exports= {
    craeteUser,
    findUserByEmail
};