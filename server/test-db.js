const pool = require('./config/db'); // מייבאים את החיבור שיצרנו הרגע

async function checkConnection() {
  try {
    // מנסים לשלוח שאילתה פשוטה שמבקשת את השעה הנוכחית
    const res = await pool.query('SELECT NOW()');
    console.log('Connection Test Passed:', res.rows[0]);
  } catch (err) {
    console.error('Connection Test Failed:', err.message);
  } finally {
    // סוגרים את החיבור בסוף הבדיקה
    pool.end();
  }
}

checkConnection();