import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import userRoute from './Routes/UserRoute.js'
dotenv.config();
const app=express();


app.use("/api/user",userRoute);
app.listen(process.env.PORT,()=>{
    console.log(`server is working on port ${process.env.PORT} `);
    connectDB();
    
})