const bcrypt = require('bcrypt');

const User= require("../models/user");

const jwt = require('jsonwebtoken');

require("dotenv").config();


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

exports.login = async(req,res) =>{
    try{

        // fetch the data from input 
        const {email, password} = req.body;
        
        // check both email and password present or not in the given input
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Fill all the details carefully",
                

            })
        }
        
        // check email in database
        let exitingUser = await User.findOne({email});

        // if user not exist before
        if(!exitingUser){
            return res.status(401).json({
                success:false,
                message:"User not Exist",
            })
        }

        // Validate password

        let payload = {
            email:exitingUser.email,
            id:exitingUser._id,
            role:exitingUser.role,

        }



        const validPassword = await bcrypt.compare(password,exitingUser.password);

        if(validPassword){

            // Password Matched
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn:"2h"
                }
                );

                // console.log(exitingUser);

            exitingUser = exitingUser.toObject();     // why we need to convert it into object

            
            exitingUser.token = token;
            // console.log(exitingUser);
            exitingUser.password = undefined;
            // console.log(exitingUser);


            // create option to pass in cookie function
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("bobbycookie",token,options).status(200).json({
                success:true,
                token,
                exitingUser,
                message:"User Logged in sucessfully"
            });

            
            
            


        }
        else{
            // password not matched 
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            })
        }



    }
    catch(err){
        console.log("Login Unsucessful");
        console.error(err.message);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error in Login",
        })
    }
}

