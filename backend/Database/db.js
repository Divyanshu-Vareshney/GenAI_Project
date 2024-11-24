import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI,{
            dbName:"GenAI",
        })
        const db = mongoose.connection;
        db.on("connected",()=>{
            console.log('MongoDB connected successfully!');
        })
        db.on('error', (err) => {
            console.error('MongoDB connection error:', err);
          });

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;