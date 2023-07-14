// auth , isStudent , isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();


// Auth middleware is used for Authentication 
exports.auth =(req,res,next) => {
    try{
        // extract jwt token 3 ways: (1.body) (2.cookies) (3.header of jsonwebtoken)
        // but whereever you made token you have to fetch it from there.
        

        // Here we find in body
        const token = req.body.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not available",
            });
        }

        // verify the token
        try{
            const payload = jwt.verify(token , process.env.JWT_SECRET_KEY);
            console.log(payload);

            req.exitingUser = payload;        // this line is important 
        }
        catch(err){

            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })


        }

        next();    // for calling next middleware




    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verify the token",
        })

    }

}

// isStudent and isAdmin middlewares are using for Authorization because it is find the role

exports.isStudent = (req,res,next) =>{

    try{
        if(req.exitingUser.role !== 'Student'){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student",
            });
        }

        next();

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"User role is not Matching",
        })

    }


}



exports.isAdmin =(req,res,next) =>{

    try{
        if(req.exitingUser.role !== 'Admin'){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin",
            });
        }

        next();

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"User role is not Matching",
        })

    }

    
}

// read about 
// 1.jwt.sign(), 
// 2.jwt.verify() , 
// 3.bcrypt.compare()



