//Runs db/init.sql against the database configured in .env
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initDb() {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    try {
        await pool.query(sql);
        console.log('✅Database schema initialized');
    } catch (err) {
        console.error('Database initialization failed:', err.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

initDb();
