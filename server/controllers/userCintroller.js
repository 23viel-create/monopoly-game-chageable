const bcrypt= require('bcryptjs');
const userModel= require('../models/userModel');

//
const registerUser = async(req, res)=>{
    //
    const {username, email, password}= req.body;

    //
    try{
        //
        const userExists= await userModel.findUserByEmail(email);
        //
        if(userExists){
            //
            return res.status(400).json({message: 'User already exists'});
        }
        //
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        //
        const newUser =userModel.craeteUser(username, email, hashedPassword);

        //
        res.status(201).json({
           message: 'User registered successfully',
             user: {
               id: newUser.id,
               username: newUser.username,
               email: newUser.email
            } 
        });
    } catch(error){
        //
        console.error(error);
        res.status(500).json({ message:'Server Error'});
    }
};

module.exports={registerUser};