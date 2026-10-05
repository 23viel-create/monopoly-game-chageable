const pool = require('../config/db');

//board_data is passed as a JSON string and cast to jsonb, because pg would
//otherwise turn a top-level JS array into a Postgres array instead of JSON

//Creates a new draft game owned by userId and returns it
const createGame = async (userId, name, boardData = {}) => {
    const query = `
    INSERT INTO games (user_id, name, board_data)
    VALUES ($1, $2, $3::jsonb)
    RETURNING *;
    `;
    const result = await pool.query(query, [userId, name, JSON.stringify(boardData)]);
    return result.rows[0];
};

//Returns the game with the given id, or undefined if none exists
const getGameById = async (gameId) => {
    const query = `SELECT * FROM games WHERE id = $1`;
    const result = await pool.query(query, [gameId]);
    return result.rows[0];
};

//Returns all games owned by userId, newest first.
//board_data is left out because it can be large and a list doesn't need it.
const getGamesByUserId = async (userId) => {
    const query = `
    SELECT id, user_id, name, status, join_code, created_at
    FROM games
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

//Replaces board_data for a game, only if userId owns it.
//Returns the updated game, or undefined if it doesn't exist or isn't theirs.
const updateBoardData = async (gameId, userId, boardData) => {
    const query = `
    UPDATE games
    SET board_data = $3::jsonb
    WHERE id = $1 AND user_id = $2
    RETURNING *;
    `;
    const result = await pool.query(query, [gameId, userId, JSON.stringify(boardData)]);
    return result.rows[0];
};

module.exports = {
    createGame,
    getGameById,
    getGamesByUserId,
    updateBoardData
};
