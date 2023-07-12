const express = require('express');

const app= express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// middleware 
app.use(express.json());

const authRoutes = require("./routes/authRoute");
// mount the route
app.use("/api/v1",authRoutes);


app.listen(PORT,()=>{
    console.log(`Server Started at port no: ${PORT}`);

})

const dbConnect = require("./config/database");
dbConnect();


