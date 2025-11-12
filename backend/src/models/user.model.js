import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        typeof:String,
        required:true,
        unique:true
    },
    name:{
        typeof:String,
        required:true
    },
    image:{
        typeof:String,
        required:true
    },
    clerkId:{
        typeof:String,
        required:true
    },
},{
    timestamps:true
}
)
export const User=mongoose.model("User",userSchema)