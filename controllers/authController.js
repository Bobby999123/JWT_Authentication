const bcrypt = require('bcrypt');

const User= require("../models/user");


//signup route handler
exports.signup = async(req,res) =>{

    try{
        // get input data
        const {name,email,password,role} = req.body;

        // check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            });
        }

        // secure your password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);    // bcrypt.hash(input password, no. of round to encrypt)

        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error received in hashing password",
            })
        }

        // create a user
        const user = await User.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success:true,
            message:"User Created Sucessfully",
        });




    }
    catch(err){
        console.log("Error received while create new record in signup");
        console.error(error.message);
        return res.status(500).json({
            success:false,
            data:"Data not inserted in Database",
            message:"Error"
        })
    }


}

// Login

