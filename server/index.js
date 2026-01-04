const express = require('express');
const cors = require('cors');
const pool = require('./config/db');//Imports our database connection instance
require('dotenv').config();
const userRoutes=require('./routes/userRoutes');

const app= express();
const PORT =process.env.PORT || 5000;

//Enables the server to handle JSON request bodies
app.use(express.json());
//Allows the React client (on a separate port) to communicate with the API
app.use(cors());
//
app.use('/api/users',userRoutes);

//
app.get('/', (req, res) => {
  res.send('Monopoly Server is Running! ');
})

//
app.get('/api/test=db',async(req,res)=>{
    try{
        const result= await pool.query('SELECT NOW()');
        res.json({message: 'Database Connected',time: result.row[0].now});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Database connection failed'});
    }
});

app.listen(PORT, ()=>{
    console.log(`✅Server running on http://localhost:${PORT}`);
});