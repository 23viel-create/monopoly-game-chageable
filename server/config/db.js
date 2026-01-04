//Loads environment variables from the .env file into process.env 
require('dotenv').config();

//Imports the Pool class from the 'pg' library
const {Pool}=require('pg');


//Loads .env values into the pool variable
const pool=new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//Listens for the connection event to verify success in the logs
pool.on('connect', () => {
    console.log('✅The connection to the PostgreSQL database was successful')
})

//Exports the pool instance to make it accessible to other files
module.exports=pool;