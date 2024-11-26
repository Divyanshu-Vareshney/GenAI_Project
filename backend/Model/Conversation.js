import mongoose from "mongoose";

const schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true,
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    }
},{
    timestamps:true
});

export const Conversation=mongoose.model("Conversation",schema);