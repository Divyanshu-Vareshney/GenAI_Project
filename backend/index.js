import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import userRoute from './Routes/UserRoute.js'
import chatRoute from './Routes/ChatRoute.js'
import cors from 'cors';
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());


app.use("/api/user",userRoute);
app.use('/api/chat',chatRoute);
app.listen(process.env.PORT,()=>{
    console.log(`server is working on port ${process.env.PORT} `);
    connectDB();
    
})