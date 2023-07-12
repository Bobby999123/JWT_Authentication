const mongoose = require('mongoose');

require("dotenv").config();

const dbConnect = () =>{
    mongoose.connect(process.env.MORGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    .then(()=>{
        console.log("Database connected Sucessfully");
    })
    .catch((error) =>{
        console.log("Error received");
        console.error(error.message);
        process.exit(1);

    })
}

module.exports = dbConnect;
